import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/db';

export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const {
            name,
            description,
            igAccountId,
            triggerType,
            conditions,
            actionType,
            actionConfig,
            isActive = true,
        } = body;

        // Validation
        if (!name || !igAccountId || !triggerType || !actionType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify the Instagram account belongs to the user
        const igAccount = user.instagramAccounts.find((acc) => acc.id === igAccountId);
        if (!igAccount) {
            return NextResponse.json(
                { error: 'Instagram account not found or does not belong to you' },
                { status: 403 }
            );
        }

        // Create automation rule
        const automation = await db.automationRule.create({
            data: {
                userId: user.id,
                igAccountId,
                name,
                description,
                isActive,
                triggerType,
                conditions: conditions || {},
                actionType,
                actionConfig: actionConfig || {},
            },
        });

        return NextResponse.json({
            success: true,
            automation: {
                id: automation.id,
                name: automation.name,
                description: automation.description,
                triggerType: automation.triggerType,
                actionType: automation.actionType,
                isActive: automation.isActive,
                createdAt: automation.createdAt,
            },
        });
    } catch (error: any) {
        console.error('Error creating automation:', error);
        return NextResponse.json(
            { error: 'Failed to create automation', details: error.message },
            { status: 500 }
        );
    }
}
