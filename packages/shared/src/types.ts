// ============================================
// AUTOMATION TYPES
// ============================================

export type TriggerType = 'keyword' | 'first_message' | 'reaction' | 'story_reply' | 'comment'

export type ActionType = 'ai_reply' | 'predefined_message' | 'save_lead' | 'tag_user' | 'webhook'

export type TonePreset = 'professional' | 'friendly' | 'casual' | 'enthusiastic' | 'formal'

export type SubscriptionTier = 'free' | 'pro' | 'business'

export interface KeywordCondition {
    keyword: string
    matchType: 'contains' | 'equals' | 'starts_with' | 'ends_with'
    caseSensitive?: boolean
}

export interface AIReplyConfig {
    businessContext: string
    tone: TonePreset
    maxLength?: number
    includeEmojis?: boolean
}

export interface PredefinedMessageConfig {
    message: string
}

export interface WebhookConfig {
    url: string
    method: 'POST' | 'GET'
    headers?: Record<string, string>
}

// ============================================
// WEBHOOK EVENT TYPES
// ============================================

export interface WebhookMessage {
    sender: {
        id: string
        username?: string
    }
    recipient: {
        id: string
    }
    timestamp: number
    message: {
        mid: string
        text?: string
        attachments?: Array<{
            type: string
            payload: {
                url: string
            }
        }>
    }
}

export interface WebhookEvent {
    object: 'instagram'
    entry: Array<{
        id: string
        time: number
        messaging?: WebhookMessage[]
    }>
}

// ============================================
// QUEUE JOB TYPES
// ============================================

export interface ProcessMessageJob {
    eventId: string
    igAccountId: string
    senderId: string
    senderUsername?: string
    message: string
    timestamp: number
}

export interface SendMessageJob {
    igAccountId: string
    recipientId: string
    message: string
    conversationId?: string
    automationId?: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
    }
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
