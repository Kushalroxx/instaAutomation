import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/db';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            include: { instagramAccounts: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7');
        const igAccountId = searchParams.get('igAccountId');

        // Build filter for time range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Build filter for Instagram account
        const accountFilter = igAccountId
            ? {
                igAccount: user.instagramAccounts.find((acc) => acc.id === igAccountId)
                    ? { id: igAccountId }
                    : undefined,
            }
            : {};

        // Get activity logs for the period
        const activityLogs = await db.activityLog.findMany({
            where: {
                createdAt: { gte: startDate },
                automation: {
                    userId: user.id,
                    ...accountFilter,
                },
            },
            include: {
                automation: {
                    select: { name: true, triggerType: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        // Calculate daily stats
        const dailyStats: Record<
            string,
            {
                date: string;
                messages: number;
                successful: number;
                failed: number;
                avgResponseTime: number;
            }
        > = {};

        activityLogs.forEach((log) => {
            const date = log.createdAt.toISOString().split('T')[0];
            if (!dailyStats[date!]) {
                dailyStats[date!] = {
                    date: date!,
                    messages: 0,
                    successful: 0,
                    failed: 0,
                    avgResponseTime: 0,
                };
            }

            dailyStats[date!]!.messages++;
            if (log.status === 'success') {
                dailyStats[date!]!.successful++;
            } else if (log.status === 'failed') {
                dailyStats[date!]!.failed++;
            }

            if (log.processingTimeMs) {
                dailyStats[date!]!.avgResponseTime += log.processingTimeMs;
            }
        });

        // Calculate averages
        Object.values(dailyStats).forEach((stat) => {
            if (stat.messages > 0) {
                stat.avgResponseTime = Math.round(stat.avgResponseTime / stat.messages);
            }
        });

        // Get automation performance
        const automationPerformance: Record<
            string,
            { name: string; triggerType: string; triggers: number; successRate: number }
        > = {};

        activityLogs.forEach((log) => {
            if (!log.automation) return;

            const key = log.automation.name;
            if (!automationPerformance[key]) {
                automationPerformance[key] = {
                    name: log.automation.name,
                    triggerType: log.automation.triggerType,
                    triggers: 0,
                    successRate: 0,
                };
            }

            automationPerformance[key]!.triggers++;
            if (log.status === 'success') {
                automationPerformance[key]!.successRate++;
            }
        });

        // Calculate success rates
        Object.values(automationPerformance).forEach((auto) => {
            if (auto.triggers > 0) {
                auto.successRate = Math.round((auto.successRate / auto.triggers) * 100);
            }
        });

        // Get top performing hours
        const hourlyPerformance: Record<number, number> = {};
        activityLogs.forEach((log) => {
            const hour = log.createdAt.getHours();
            hourlyPerformance[hour] = (hourlyPerformance[hour] || 0) + 1;
        });

        // Get response rate by trigger type
        const triggerTypeStats: Record<string, { total: number; successful: number }> = {};
        activityLogs.forEach((log) => {
            if (!log.automation) return;

            const type = log.automation.triggerType;
            if (!triggerTypeStats[type]) {
                triggerTypeStats[type] = { total: 0, successful: 0 };
            }

            triggerTypeStats[type]!.total++;
            if (log.status === 'success') {
                triggerTypeStats[type]!.successful++;
            }
        });

        const triggerTypePerformance = Object.entries(triggerTypeStats).map(([type, stats]) => ({
            type,
            total: stats.total,
            successRate: Math.round((stats.successful / stats.total) * 100),
        }));

        // Calculate overall stats
        const totalMessages = activityLogs.length;
        const successfulMessages = activityLogs.filter((log) => log.status === 'success').length;
        const failedMessages = activityLogs.filter((log) => log.status === 'failed').length;
        const successRate = totalMessages > 0 ? Math.round((successfulMessages / totalMessages) * 100) : 0;
        const avgResponseTime = activityLogs.reduce((sum, log) => sum + (log.processingTimeMs || 0), 0) / (totalMessages || 1);

        // Get AI token usage and costs
        const totalTokens = activityLogs.reduce((sum, log) => sum + (log.aiTokensUsed || 0), 0);
        const totalCost = activityLogs.reduce((sum, log) => sum + (log.aiCost || 0), 0);

        return NextResponse.json({
            success: true,
            analytics: {
                overview: {
                    totalMessages,
                    successfulMessages,
                    failedMessages,
                    successRate,
                    avgResponseTime: Math.round(avgResponseTime),
                    totalTokens,
                    totalCost: totalCost.toFixed(4),
                },
                dailyStats: Object.values(dailyStats),
                automationPerformance: Object.values(automationPerformance),
                hourlyPerformance: Object.entries(hourlyPerformance).map(([hour, count]) => ({
                    hour: parseInt(hour),
                    count,
                })),
                triggerTypePerformance,
            },
        });
    } catch (error: any) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics', details: error.message },
            { status: 500 }
        );
    }
}
