import { z } from 'zod'

// ============================================
// AUTOMATION VALIDATORS
// ============================================

export const TriggerTypeSchema = z.enum(['keyword', 'first_message', 'reaction', 'story_reply', 'comment'])

export const ActionTypeSchema = z.enum(['ai_reply', 'predefined_message', 'save_lead', 'tag_user', 'webhook'])

export const TonePresetSchema = z.enum(['professional', 'friendly', 'casual', 'enthusiastic', 'formal'])

export const SubscriptionTierSchema = z.enum(['free', 'pro', 'business'])

export const FunnelStageSchema = z.enum(['new', 'engaged', 'qualified', 'converted'])

export const ProcessingStatusSchema = z.enum(['success', 'failed', 'pending', 'skipped'])

export const KeywordConditionSchema = z.object({
    keyword: z.string().min(1, 'Keyword cannot be empty'),
    matchType: z.enum(['contains', 'equals', 'starts_with', 'ends_with', 'regex']),
    caseSensitive: z.boolean().optional().default(false)
})

export const AIReplyConfigSchema = z.object({
    businessContext: z.string().min(10, 'Business context must be at least 10 characters'),
    tone: TonePresetSchema,
    maxLength: z.number().min(50).max(1000).optional(),
    includeEmojis: z.boolean().optional().default(true),
    customInstructions: z.string().max(500).optional(),
    temperature: z.number().min(0).max(1).optional().default(0.7)
})

export const PredefinedMessageConfigSchema = z.object({
    message: z.string().min(1, 'Message cannot be empty').max(1000),
    variables: z.record(z.string()).optional()
})

export const WebhookConfigSchema = z.object({
    url: z.string().url('Invalid webhook URL'),
    method: z.enum(['POST', 'GET']),
    headers: z.record(z.string()).optional(),
    retryAttempts: z.number().min(0).max(5).optional().default(3)
})

export const SaveLeadConfigSchema = z.object({
    tags: z.array(z.string()).optional(),
    leadScore: z.number().min(0).max(100).optional(),
    funnelStage: FunnelStageSchema.optional(),
    customFields: z.record(z.any()).optional()
})

export const AutomationRuleSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
    isActive: z.boolean().default(true),
    triggerType: TriggerTypeSchema,
    conditions: z.union([
        KeywordConditionSchema,
        z.object({}) // For triggers without conditions
    ]),
    actionType: ActionTypeSchema,
    actionConfig: z.union([
        AIReplyConfigSchema,
        PredefinedMessageConfigSchema,
        WebhookConfigSchema,
        SaveLeadConfigSchema
    ])
})

// ============================================
// WEBHOOK VALIDATORS
// ============================================

export const WebhookMessageSchema = z.object({
    sender: z.object({
        id: z.string(),
        username: z.string().optional()
    }),
    recipient: z.object({
        id: z.string()
    }),
    timestamp: z.number(),
    message: z.object({
        mid: z.string(),
        text: z.string().optional(),
        attachments: z.array(z.object({
            type: z.string(),
            payload: z.object({
                url: z.string().url()
            })
        })).optional(),
        is_echo: z.boolean().optional(),
        reply_to: z.object({
            mid: z.string()
        }).optional()
    })
})

export const WebhookEventSchema = z.object({
    object: z.literal('instagram'),
    entry: z.array(z.object({
        id: z.string(),
        time: z.number(),
        messaging: z.array(WebhookMessageSchema).optional(),
        changes: z.array(z.object({
            field: z.string(),
            value: z.any()
        })).optional()
    }))
})

// ============================================
// INSTAGRAM API VALIDATORS
// ============================================

export const InstagramProfileSchema = z.object({
    id: z.string(),
    username: z.string(),
    name: z.string().optional(),
    profile_picture_url: z.string().url().optional(),
    followers_count: z.number().optional(),
    follows_count: z.number().optional(),
    media_count: z.number().optional()
})

export const SendMessageRequestSchema = z.object({
    recipient_id: z.string().min(1, 'Recipient ID is required'),
    message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long')
})

export const SendMessageResponseSchema = z.object({
    message_id: z.string(),
    recipient_id: z.string()
})

// ============================================
// AI SERVICE VALIDATORS
// ============================================

export const AIMessageSchema = z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1),
    timestamp: z.number().optional()
})

export const AIGenerateRequestSchema = z.object({
    conversationHistory: z.array(AIMessageSchema).min(1, 'Conversation history required'),
    businessContext: z.string().min(10, 'Business context must be at least 10 characters'),
    tone: TonePresetSchema,
    customInstructions: z.string().max(500).optional(),
    maxTokens: z.number().min(50).max(4000).optional().default(500),
    temperature: z.number().min(0).max(1).optional().default(0.7)
})

export const AIGenerateResponseSchema = z.object({
    message: z.string().min(1),
    tokensUsed: z.number(),
    model: z.string(),
    cost: z.number(),
    processingTimeMs: z.number()
})

export const AIProviderSchema = z.enum(['openai', 'gemini', 'anthropic'])

export const AIConfigSchema = z.object({
    provider: AIProviderSchema,
    model: z.string().min(1),
    apiKey: z.string().min(1),
    maxTokens: z.number().min(50).max(4000).optional(),
    temperature: z.number().min(0).max(1).optional()
})

// ============================================
// QUEUE JOB VALIDATORS
// ============================================

export const ProcessMessageJobSchema = z.object({
    eventId: z.string(),
    igAccountId: z.string(),
    senderId: z.string(),
    senderUsername: z.string().optional(),
    message: z.string(),
    messageId: z.string(),
    timestamp: z.number(),
    attachments: z.array(z.object({
        type: z.string(),
        url: z.string().url()
    })).optional()
})

export const SendMessageJobSchema = z.object({
    igAccountId: z.string(),
    recipientId: z.string(),
    message: z.string().min(1).max(1000),
    conversationId: z.string().optional(),
    automationId: z.string().optional(),
    retryCount: z.number().min(0).max(5).optional().default(0)
})

export const GenerateAIResponseJobSchema = z.object({
    conversationId: z.string(),
    igAccountId: z.string(),
    automationId: z.string(),
    incomingMessage: z.string(),
    businessContext: z.string(),
    tone: TonePresetSchema
})

export const SyncConversationsJobSchema = z.object({
    igAccountId: z.string(),
    since: z.number().optional()
})

// ============================================
// API REQUEST/RESPONSE VALIDATORS
// ============================================

export const ApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.any().optional()
    }).optional(),
    meta: z.object({
        timestamp: z.number(),
        requestId: z.string().optional()
    }).optional()
})

export const PaginationParamsSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20)
})

export const PaginatedResponseSchema = z.object({
    data: z.array(z.any()),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
        hasNext: z.boolean(),
        hasPrev: z.boolean()
    })
})

// ============================================
// CONFIGURATION VALIDATORS
// ============================================

export const ServiceConfigSchema = z.object({
    port: z.number().min(1000).max(65535),
    env: z.enum(['development', 'production', 'test']),
    logLevel: z.enum(['debug', 'info', 'warn', 'error'])
})

export const DatabaseConfigSchema = z.object({
    url: z.string().url(),
    poolSize: z.number().min(1).max(100).optional().default(10),
    connectionTimeout: z.number().min(1000).optional().default(30000)
})

export const RedisConfigSchema = z.object({
    host: z.string().min(1),
    port: z.number().min(1).max(65535),
    password: z.string().optional(),
    db: z.number().min(0).max(15).optional().default(0)
})

export const RateLimitConfigSchema = z.object({
    windowMs: z.number().min(1000),
    maxRequests: z.number().min(1),
    skipSuccessfulRequests: z.boolean().optional().default(false)
})

// ============================================
// USER INPUT VALIDATORS
// ============================================

export const CreateAutomationSchema = z.object({
    igAccountId: z.string().cuid('Invalid Instagram account ID'),
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    triggerType: TriggerTypeSchema,
    conditions: z.any(), // Will be validated based on triggerType
    actionType: ActionTypeSchema,
    actionConfig: z.any() // Will be validated based on actionType
})

export const UpdateAutomationSchema = CreateAutomationSchema.partial().omit({ igAccountId: true })

export const ConnectInstagramAccountSchema = z.object({
    pageId: z.string().min(1),
    igBusinessAccountId: z.string().min(1),
    accessToken: z.string().min(1),
    tokenExpiresAt: z.string().datetime().or(z.date())
})

// ============================================
// UTILITY VALIDATORS
// ============================================

export const CuidSchema = z.string().cuid('Invalid ID format')

export const EmailSchema = z.string().email('Invalid email address')

export const UrlSchema = z.string().url('Invalid URL')

export const DateTimeSchema = z.string().datetime().or(z.date())

// ============================================
// VALIDATION HELPER FUNCTIONS
// ============================================

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data)
    if (!result.success) {
        const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        throw new Error(`Validation failed: ${errors}`)
    }
    return result.data
}

export function validateOrNull<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
    const result = schema.safeParse(data)
    return result.success ? result.data : null
}

// Legacy exports for backward compatibility
export const createAutomationSchema = CreateAutomationSchema
export const updateAutomationSchema = UpdateAutomationSchema
export const sendMessageSchema = SendMessageRequestSchema
export const webhookEventSchema = WebhookEventSchema

export function validateAutomation(data: unknown) {
    return createAutomationSchema.safeParse(data)
}

export function validateWebhookEvent(data: unknown) {
    return webhookEventSchema.safeParse(data)
}
