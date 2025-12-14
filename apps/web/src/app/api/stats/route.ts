import { NextResponse } from 'next/server'
import { db } from '@repo/db'

export async function GET() {
    try {
        // Get total users
        const totalUsers = await db.user.count()

        // Get total automations
        const totalAutomations = await db.automationRule.count()
        const activeAutomations = await db.automationRule.count({
            where: { isActive: true }
        })

        // Get total messages processed (from activity logs)
        const totalMessages = await db.activityLog.count()
        const successfulMessages = await db.activityLog.count({
            where: { status: 'success' }
        })

        // Calculate response rate
        const responseRate = totalMessages > 0
            ? ((successfulMessages / totalMessages) * 100).toFixed(1)
            : '0.0'

        // Get total conversations
        const totalConversations = await db.conversation.count()

        return NextResponse.json({
            stats: {
                messagesProcessed: totalMessages,
                activeAutomations,
                responseRate: `${responseRate}%`,
                activeUsers: totalUsers,
                totalConversations
            }
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}
