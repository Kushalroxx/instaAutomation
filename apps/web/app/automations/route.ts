import { NextResponse } from 'next/server'
import { db } from '@repo/db'

export async function GET() {
    try {
        const automations = await db.automationRule.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                igAccount: {
                    select: { username: true }
                },
                _count: {
                    select: { activityLogs: true }
                }
            }
        })

        const formattedAutomations = automations.map(auto => ({
            id: auto.id,
            name: auto.name,
            description: auto.description,
            trigger: formatTrigger(auto.triggerType, auto.conditions),
            status: auto.isActive ? 'active' : 'paused',
            triggers: auto._count.activityLogs,
            igUsername: auto.igAccount.username,
            createdAt: auto.createdAt
        }))

        return NextResponse.json({ automations: formattedAutomations })
    } catch (error) {
        console.error('Error fetching automations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch automations' },
            { status: 500 }
        )
    }
}

function formatTrigger(type: string, conditions: any): string {
    if (type === 'keyword') {
        const keyword = (conditions as any)?.keyword || 'unknown'
        return `Keyword: "${keyword}"`
    }
    if (type === 'first_message') return 'First Message'
    if (type === 'reaction') return 'Reaction'
    if (type === 'story_reply') return 'Story Reply'
    if (type === 'comment') return 'Comment'
    return type
}
