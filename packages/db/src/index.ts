import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Export all Prisma types
export * from '@prisma/client'

// Export Redis and Queue utilities
export * from './redis'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if user has reached their usage limit
 */
export async function checkUsageLimit(userId: string): Promise<boolean> {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { usageCount: true, usageLimit: true, usageResetAt: true }
    })

    if (!user) return false

    // Reset usage if 24 hours have passed
    const now = new Date()
    const resetTime = new Date(user.usageResetAt)
    if (now.getTime() - resetTime.getTime() > 24 * 60 * 60 * 1000) {
        await db.user.update({
            where: { id: userId },
            data: {
                usageCount: 0,
                usageResetAt: now
            }
        })
        return true
    }

    return user.usageCount < user.usageLimit
}

/**
 * Increment user's usage count
 */
export async function incrementUsage(userId: string): Promise<void> {
    await db.user.update({
        where: { id: userId },
        data: {
            usageCount: { increment: 1 }
        }
    })
}

/**
 * Get active automations for an Instagram account
 */
export async function getActiveAutomations(igAccountId: string) {
    return db.automationRule.findMany({
        where: {
            igAccountId,
            isActive: true
        },
        include: {
            igAccount: true,
            user: true
        }
    })
}

/**
 * Log activity
 */
export async function logActivity(data: {
    automationId?: string
    conversationId?: string
    incomingMessage: string
    outgoingResponse?: string
    status: 'success' | 'failed' | 'pending' | 'skipped'
    errorMessage?: string
    processingTimeMs?: number
    aiModel?: string
    aiTokensUsed?: number
    aiCost?: number
}) {
    return db.activityLog.create({
        data
    })
}

/**
 * Get or create conversation
 */
export async function getOrCreateConversation(
    igAccountId: string,
    senderId: string,
    senderUsername?: string
) {
    return db.conversation.upsert({
        where: {
            igAccountId_senderId: {
                igAccountId,
                senderId
            }
        },
        create: {
            igAccountId,
            senderId,
            senderUsername,
            messages: [],
            firstMessageAt: new Date(),
            lastMessageAt: new Date()
        },
        update: {
            lastMessageAt: new Date()
        }
    })
}

/**
 * Add message to conversation
 */
export async function addMessageToConversation(
    conversationId: string,
    message: {
        role: 'user' | 'assistant'
        content: string
        timestamp: Date
        messageId?: string
    }
) {
    const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        select: { messages: true }
    })

    if (!conversation) throw new Error('Conversation not found')

    const messages = conversation.messages as any[]
    messages.push(message)

    return db.conversation.update({
        where: { id: conversationId },
        data: {
            messages,
            lastMessageAt: message.timestamp
        }
    })
}
