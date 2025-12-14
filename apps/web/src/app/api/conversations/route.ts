import { NextResponse } from 'next/server'
import { db } from '@repo/db'

export async function GET() {
    try {
        const conversations = await db.conversation.findMany({
            take: 20,
            orderBy: { lastMessageAt: 'desc' },
            include: {
                igAccount: {
                    select: { username: true }
                },
                _count: {
                    select: { activityLogs: true }
                }
            }
        })

        const formattedConversations = conversations.map(conv => {
            const messages = conv.messages as any[]
            const lastMessage = messages[messages.length - 1]

            return {
                id: conv.id,
                user: conv.senderName || conv.senderUsername || 'Unknown',
                username: conv.senderUsername || `@user_${conv.senderId.substring(0, 8)}`,
                lastMessage: lastMessage?.content || 'No messages yet',
                time: getTimeAgo(conv.lastMessageAt),
                unread: 0, // TODO: Implement unread count logic
                messageCount: messages.length,
                tags: conv.tags
            }
        })

        return NextResponse.json({ conversations: formattedConversations })
    } catch (error) {
        console.error('Error fetching conversations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
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
