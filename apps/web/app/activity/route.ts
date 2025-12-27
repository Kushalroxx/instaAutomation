import { NextResponse } from 'next/server'
import { db } from '@repo/db'

export async function GET() {
    try {
        const recentActivity = await db.activityLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                automation: {
                    select: { name: true }
                },
                conversation: {
                    select: { senderUsername: true }
                }
            }
        })

        const formattedActivity = recentActivity.map(log => ({
            id: log.id,
            action: log.status === 'success' ? 'AI response sent' : 'Failed to send',
            user: log.conversation?.senderUsername || 'Unknown user',
            automationName: log.automation?.name,
            time: getTimeAgo(log.createdAt),
            status: log.status,
            message: log.incomingMessage.substring(0, 100)
        }))

        return NextResponse.json({ activity: formattedActivity })
    } catch (error) {
        console.error('Error fetching activity:', error)
        return NextResponse.json(
            { error: 'Failed to fetch activity' },
            { status: 500 }
        )
    }
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
}
