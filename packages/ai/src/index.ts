import OpenAI from 'openai'

// Initialize OpenAI client (will use OPENAI_API_KEY from env)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-replace-me'
})

/**
 * Tone presets for AI responses
 */
export const TONE_PRESETS = {
    professional: 'Professional and courteous, addressing the user formally',
    friendly: 'Warm, casual, and conversational like talking to a friend',
    enthusiastic: 'Excited, energetic, and encouraging with emojis',
    concise: 'Brief and to-the-point, maximum 2 sentences'
} as const

export type ToneType = keyof typeof TONE_PRESETS

/**
 * Generate AI reply based on conversation context and business rules
 */
export async function generateAIReply(params: {
    incomingMessage: string
    businessContext: string
    tone?: ToneType
    conversationHistory?: Array<{ role: 'user' | 'assistant', content: string }>
    customInstructions?: string
}): Promise<{ reply: string; tokensUsed: number; model: string; cost: number }> {
    const {
        incomingMessage,
        businessContext,
        tone = 'friendly',
        conversationHistory = [],
        customInstructions
    } = params

    // Build system prompt
    const systemPrompt = `You are an AI assistant for Instagram DM automation.

BUSINESS CONTEXT:
${businessContext}

TONE: ${TONE_PRESETS[tone]}

RULES:
- Keep responses under 2000 characters (Instagram DM limit)
- Be helpful and relevant to the business context
- Don't make promises the business can't keep
- If you don't know something, be honest
- Always maintain the specified tone
${customInstructions ? `\n${customInstructions}` : ''}

Remember: You're responding to an Instagram direct message. Keep it conversational.`

    // Build messages array for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        })),
        { role: 'user', content: incomingMessage }
    ]

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Fast and cost-effective for DM replies
            messages,
            max_tokens: 300, // Limit response length
            temperature: 0.7, // Balanced creativity
        })

        const reply = response.choices[0]?.message?.content || 'I apologize, but I couldn\'t process your message.'
        const tokensUsed = response.usage?.total_tokens || 0
        const model = response.model

        // Calculate cost (rough estimate for gpt-3.5-turbo)
        // $0.0015 per 1K input tokens, $0.002 per 1K output tokens
        const inputTokens = response.usage?.prompt_tokens || 0
        const outputTokens = response.usage?.completion_tokens || 0
        const cost = (inputTokens * 0.0015 + outputTokens * 0.002) / 1000

        return {
            reply,
            tokensUsed,
            model,
            cost
        }
    } catch (error: any) {
        console.error('OpenAI API error:', error)

        // Fallback response on error
        return {
            reply: 'Thank you for your message! We\'ll get back to you soon.',
            tokensUsed: 0,
            model: 'fallback',
            cost: 0
        }
    }
}

/**
 * Generate AI reply with a predefined template (faster, no API call)
 */
export function generateTemplateReply(params: {
    template: string
    variables?: Record<string, string>
}): string {
    let { template, variables = {} } = params

    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })

    return template
}

/**
 * Validate message is safe and appropriate
 */
export function validateMessage(message: string): { isValid: boolean; reason?: string } {
    // Check length
    if (message.length > 2000) {
        return { isValid: false, reason: 'Message exceeds Instagram DM limit (2000 chars)' }
    }

    if (message.trim().length === 0) {
        return { isValid: false, reason: 'Message is empty' }
    }

    // Check for potentially harmful content (basic filter)
    const bannedKeywords = ['spam', 'scam', 'click here now', 'money back guarantee']
    const lowerMessage = message.toLowerCase()
    for (const keyword of bannedKeywords) {
        if (lowerMessage.includes(keyword)) {
            return { isValid: false, reason: `Message contains banned keyword: ${keyword}` }
        }
    }

    return { isValid: true }
}

export default {
    generateAIReply,
    generateTemplateReply,
    validateMessage,
    TONE_PRESETS
}
