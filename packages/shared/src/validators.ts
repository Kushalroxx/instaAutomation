import { z } from 'zod'

// ============================================
// AUTOMATION VALIDATORS
// ============================================

export const createAutomationSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    igAccountId: z.string(),
    triggerType: z.enum(['keyword', 'first_message', 'reaction', 'story_reply', 'comment']),
    conditions: z.record(z.any()),
    actionType: z.enum(['ai_reply', 'predefined_message', 'save_lead', 'tag_user', 'webhook']),
    actionConfig: z.record(z.any()),
    isActive: z.boolean().default(true)
})

export const updateAutomationSchema = createAutomationSchema.partial().omit({ igAccountId: true })

// ============================================
// MESSAGE VALIDATORS
// ============================================

export const sendMessageSchema = z.object({
    recipientId: z.string(),
    message: z.string().min(1).max(1000),
    igAccountId: z.string()
})

// ============================================
// WEBHOOK VALIDATORS
// ============================================

export const webhookEventSchema = z.object({
    object: z.literal('instagram'),
    entry: z.array(z.object({
        id: z.string(),
        time: z.number(),
        messaging: z.array(z.object({
            sender: z.object({
                id: z.string()
            }),
            recipient: z.object({
                id: z.string()
            }),
            timestamp: z.number(),
            message: z.object({
                mid: z.string(),
                text: z.string().optional(),
                attachments: z.array(z.any()).optional()
            }).optional()
        })).optional()
    }))
})

// ============================================
// HELPER FUNCTIONS
// ============================================

export function validateAutomation(data: unknown) {
    return createAutomationSchema.safeParse(data)
}

export function validateWebhookEvent(data: unknown) {
    return webhookEventSchema.safeParse(data)
}
