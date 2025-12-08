// ============================================
// AUTOMATION TYPES
// ============================================

export type TriggerType = 'keyword' | 'first_message' | 'reaction' | 'story_reply' | 'comment'

export type ActionType = 'ai_reply' | 'predefined_message' | 'save_lead' | 'tag_user' | 'webhook'

export type TonePreset = 'professional' | 'friendly' | 'casual' | 'enthusiastic' | 'formal'

export type SubscriptionTier = 'free' | 'pro' | 'business'

export type FunnelStage = 'new' | 'engaged' | 'qualified' | 'converted'

export type ProcessingStatus = 'success' | 'failed' | 'pending' | 'skipped'

export interface KeywordCondition {
    keyword: string
    matchType: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'regex'
    caseSensitive?: boolean
}

export interface AIReplyConfig {
    businessContext: string
    tone: TonePreset
    maxLength?: number
    includeEmojis?: boolean
    customInstructions?: string
    temperature?: number // 0-1 for AI creativity
}

export interface PredefinedMessageConfig {
    message: string
    variables?: Record<string, string> // For template variables like {{name}}
}

export interface WebhookConfig {
    url: string
    method: 'POST' | 'GET'
    headers?: Record<string, string>
    retryAttempts?: number
}

export interface SaveLeadConfig {
    tags?: string[]
    leadScore?: number
    funnelStage?: FunnelStage
    customFields?: Record<string, any>
}

// ============================================
// INSTAGRAM GRAPH API TYPES
// ============================================

export interface InstagramProfile {
    id: string
    username: string
    name?: string
    profile_picture_url?: string
    followers_count?: number
    follows_count?: number
    media_count?: number
}

export interface InstagramConversation {
    id: string
    participants: {
        data: Array<{
            id: string
            username: string
        }>
    }
    messages: {
        data: InstagramMessage[]
    }
}

export interface InstagramMessage {
    id: string
    created_time: string
    from: {
        id: string
        username: string
    }
    to: {
        data: Array<{
            id: string
            username: string
        }>
    }
    message?: string
    attachments?: {
        data: Array<{
            id: string
            mime_type: string
            name: string
            image_data?: {
                url: string
                preview_url: string
            }
            video_data?: {
                url: string
            }
        }>
    }
}

export interface SendMessageResponse {
    message_id: string
    recipient_id: string
}

export interface GraphAPIError {
    message: string
    type: string
    code: number
    error_subcode?: number
    fbtrace_id: string
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
        is_echo?: boolean
        reply_to?: {
            mid: string
        }
    }
}

export interface WebhookEvent {
    object: 'instagram'
    entry: Array<{
        id: string
        time: number
        messaging?: WebhookMessage[]
        changes?: Array<{
            field: string
            value: any
        }>
    }>
}

// ============================================
// AI SERVICE TYPES
// ============================================

export interface AIMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
    timestamp?: number
}

export interface AIGenerateRequest {
    conversationHistory: AIMessage[]
    businessContext: string
    tone: TonePreset
    customInstructions?: string
    maxTokens?: number
    temperature?: number
}

export interface AIGenerateResponse {
    message: string
    tokensUsed: number
    model: string
    cost: number
    processingTimeMs: number
}

export type AIProvider = 'openai' | 'gemini' | 'anthropic'

export interface AIConfig {
    provider: AIProvider
    model: string
    apiKey: string
    maxTokens?: number
    temperature?: number
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
    messageId: string
    timestamp: number
    attachments?: Array<{
        type: string
        url: string
    }>
}

export interface SendMessageJob {
    igAccountId: string
    recipientId: string
    message: string
    conversationId?: string
    automationId?: string
    retryCount?: number
}

export interface GenerateAIResponseJob {
    conversationId: string
    igAccountId: string
    automationId: string
    incomingMessage: string
    businessContext: string
    tone: TonePreset
}

export interface SyncConversationsJob {
    igAccountId: string
    since?: number
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
        details?: any
    }
    meta?: {
        timestamp: number
        requestId?: string
    }
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

// ============================================
// ERROR TYPES
// ============================================

export class AppError extends Error {
    constructor(
        public code: string,
        public message: string,
        public statusCode: number = 500,
        public details?: any
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super('VALIDATION_ERROR', message, 400, details)
        this.name = 'ValidationError'
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super('AUTHENTICATION_ERROR', message, 401)
        this.name = 'AuthenticationError'
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Rate limit exceeded', public retryAfter?: number) {
        super('RATE_LIMIT_ERROR', message, 429, { retryAfter })
        this.name = 'RateLimitError'
    }
}

export class InstagramAPIError extends AppError {
    constructor(message: string, public apiError?: GraphAPIError) {
        super('INSTAGRAM_API_ERROR', message, 502, apiError)
        this.name = 'InstagramAPIError'
    }
}

// ============================================
// METRICS & ANALYTICS TYPES
// ============================================

export interface ConversationMetrics {
    totalConversations: number
    activeConversations: number
    avgResponseTime: number
    messagesReceived: number
    messagesSent: number
    automationRate: number // % of messages automated
}

export interface AutomationMetrics {
    totalAutomations: number
    activeAutomations: number
    totalTriggers: number
    successRate: number
    avgProcessingTime: number
}

export interface UsageMetrics {
    messagesProcessed: number
    aiTokensUsed: number
    aiCostUSD: number
    webhookEvents: number
    apiCalls: number
}

// ============================================
// CONFIGURATION TYPES
// ============================================

export interface ServiceConfig {
    port: number
    env: 'development' | 'production' | 'test'
    logLevel: 'debug' | 'info' | 'warn' | 'error'
}

export interface DatabaseConfig {
    url: string
    poolSize?: number
    connectionTimeout?: number
}

export interface RedisConfig {
    host: string
    port: number
    password?: string
    db?: number
}

export interface RateLimitConfig {
    windowMs: number
    maxRequests: number
    skipSuccessfulRequests?: boolean
}
