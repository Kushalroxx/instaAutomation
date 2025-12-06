/// <reference types="@prisma/client" />

declare module '@repo/db' {
    export * from '@prisma/client'
    export const db: import('@prisma/client').PrismaClient

    export function checkUsageLimit(userId: string): Promise<boolean>
    export function incrementUsage(userId: string): Promise<void>
    export function getActiveAutomations(igAccountId: string): Promise<any>
    export function logActivity(data: {
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
    }): Promise<any>
    export function getOrCreateConversation(
        igAccountId: string,
        senderId: string,
        senderUsername?: string
    ): Promise<any>
    export function addMessageToConversation(
        conversationId: string,
        message: {
            role: 'user' | 'assistant'
            content: string
            timestamp: Date
            messageId?: string
        }
    ): Promise<any>
}
