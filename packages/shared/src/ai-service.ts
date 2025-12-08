import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import type {
    AIMessage,
    AIGenerateRequest,
    AIGenerateResponse,
    AIProvider,
    TonePreset
} from './types'
import { logger, calculateOpenAICost, calculateGeminiCost, retryWithBackoff } from './utils'

/**
 * AI Service for generating automated responses
 * Supports multiple AI providers (OpenAI, Gemini)
 */
export class AIService {
    private provider: AIProvider
    private openai?: OpenAI
    private gemini?: GoogleGenerativeAI
    private model: string = 'gpt-3.5-turbo'

    constructor(provider: AIProvider, apiKey: string, model?: string) {
        this.provider = provider

        if (provider === 'openai') {
            this.openai = new OpenAI({ apiKey })
            this.model = model || 'gpt-3.5-turbo'
        } else if (provider === 'gemini') {
            this.gemini = new GoogleGenerativeAI(apiKey)
            this.model = model || 'gemini-pro'
        }
    }

    /**
     * Generates an AI response based on conversation history
     */
    async generateResponse(request: AIGenerateRequest): Promise<AIGenerateResponse> {
        const startTime = Date.now()

        try {
            logger.info('Generating AI response', {
                provider: this.provider,
                model: this.model,
                tone: request.tone
            })

            let response: AIGenerateResponse

            if (this.provider === 'openai' && this.openai) {
                response = await this.generateOpenAIResponse(request)
            } else if (this.provider === 'gemini' && this.gemini) {
                response = await this.generateGeminiResponse(request)
            } else {
                throw new Error(`Unsupported AI provider: ${this.provider}`)
            }

            response.processingTimeMs = Date.now() - startTime
            logger.info('AI response generated', {
                tokensUsed: response.tokensUsed,
                cost: response.cost,
                processingTime: response.processingTimeMs
            })

            return response
        } catch (error) {
            logger.error('Failed to generate AI response', error)
            throw error
        }
    }

    /**
     * Generates response using OpenAI
     */
    private async generateOpenAIResponse(request: AIGenerateRequest): Promise<AIGenerateResponse> {
        if (!this.openai) throw new Error('OpenAI client not initialized')

        const systemPrompt = this.buildSystemPrompt(request.businessContext, request.tone, request.customInstructions)
        const messages = [
            { role: 'system' as const, content: systemPrompt },
            ...request.conversationHistory.map((msg: AIMessage) => ({
                role: msg.role,
                content: msg.content
            }))
        ]

        const completion = await this.openai.chat.completions.create({
            model: this.model,
            messages,
            temperature: request.temperature || 0.7,
            max_tokens: request.maxTokens || 500
        })

        const message = completion.choices[0].message.content || ''
        const tokensUsed = completion.usage?.total_tokens || 0
        const cost = calculateOpenAICost(this.model, tokensUsed)

        return {
            message,
            tokensUsed,
            model: this.model,
            cost,
            processingTimeMs: 0 // Will be set by caller
        }
    }

    /**
     * Generates response using Google Gemini
     */
    private async generateGeminiResponse(request: AIGenerateRequest): Promise<AIGenerateResponse> {
        if (!this.gemini) throw new Error('Gemini client not initialized')

        const model = this.gemini.getGenerativeModel({ model: this.model })
        const systemPrompt = this.buildSystemPrompt(request.businessContext, request.tone, request.customInstructions)

        // Build conversation history for Gemini
        const chat = model.startChat({
            history: request.conversationHistory.slice(0, -1).map((msg: AIMessage) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                temperature: request.temperature || 0.7,
                maxOutputTokens: request.maxTokens || 500
            }
        })

        // Add system prompt to the last user message
        const lastMessage = request.conversationHistory[request.conversationHistory.length - 1]
        const prompt = `${systemPrompt}\n\nUser message: ${lastMessage.content}`

        const result = await chat.sendMessage(prompt)
        const response = result.response
        const message = response.text()

        // Gemini doesn't provide exact token count, estimate it
        const tokensUsed = Math.ceil((message.length + prompt.length) / 4)
        const cost = calculateGeminiCost(this.model, tokensUsed)

        return {
            message,
            tokensUsed,
            model: this.model,
            cost,
            processingTimeMs: 0
        }
    }

    /**
     * Builds the system prompt based on business context and tone
     */
    private buildSystemPrompt(
        businessContext: string,
        tone: TonePreset,
        customInstructions?: string
    ): string {
        const toneInstructions = this.getToneInstructions(tone)

        return `You are an AI assistant helping with Instagram direct messages for a business.

BUSINESS CONTEXT:
${businessContext}

TONE & STYLE:
${toneInstructions}

INSTRUCTIONS:
1. Respond naturally and conversationally
2. Keep responses concise (1-3 sentences max)
3. Be helpful and address the user's question or concern
4. Use the business context to provide relevant information
5. Don't mention that you're an AI unless asked
6. Use emojis sparingly and appropriately
7. If you don't know something, be honest and offer to help in another way
${customInstructions ? `\nADDITIONAL INSTRUCTIONS:\n${customInstructions}` : ''}

Generate a response to the user's latest message following these guidelines.`
    }

    /**
     * Gets tone-specific instructions
     */
    private getToneInstructions(tone: TonePreset): string {
        const toneMap: Record<TonePreset, string> = {
            professional: 'Use professional, polished language. Be respectful and formal. Avoid slang and excessive emojis.',
            friendly: 'Be warm and approachable. Use a conversational tone with occasional emojis. Sound like a helpful friend.',
            casual: 'Keep it relaxed and informal. Use everyday language and emojis. Be personable and easy-going.',
            enthusiastic: 'Show excitement and energy! Use exclamation points and emojis. Be upbeat and positive.',
            formal: 'Maintain strict formality. Use proper grammar and professional vocabulary. No emojis or casual language.'
        }

        return toneMap[tone] || toneMap.friendly
    }

    /**
     * Generates a quick reply for common scenarios
     */
    async generateQuickReply(
        scenario: 'greeting' | 'thanks' | 'goodbye' | 'help',
        businessContext: string,
        tone: TonePreset = 'friendly'
    ): Promise<string> {
        const prompts: Record<string, string> = {
            greeting: 'Generate a warm greeting message for a new customer.',
            thanks: 'Generate a thank you message for a customer.',
            goodbye: 'Generate a friendly goodbye message.',
            help: 'Generate a message offering help and asking how you can assist.'
        }

        const request: AIGenerateRequest = {
            conversationHistory: [
                { role: 'user', content: prompts[scenario] }
            ],
            businessContext,
            tone,
            maxTokens: 150
        }

        const response = await this.generateResponse(request)
        return response.message
    }

    /**
     * Analyzes sentiment of a message
     */
    async analyzeSentiment(message: string): Promise<'positive' | 'neutral' | 'negative'> {
        try {
            if (this.provider === 'openai' && this.openai) {
                const completion = await this.openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'Analyze the sentiment of the message. Respond with only one word: positive, neutral, or negative.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 10
                })

                const sentiment = completion.choices[0].message.content?.toLowerCase().trim() as 'positive' | 'neutral' | 'negative'
                return sentiment || 'neutral'
            }

            // Fallback: simple keyword-based sentiment analysis
            return this.simpleSentimentAnalysis(message)
        } catch (error) {
            logger.error('Failed to analyze sentiment', error)
            return 'neutral'
        }
    }

    /**
     * Simple keyword-based sentiment analysis (fallback)
     */
    private simpleSentimentAnalysis(message: string): 'positive' | 'neutral' | 'negative' {
        const lowerMessage = message.toLowerCase()

        const positiveWords = ['great', 'awesome', 'excellent', 'love', 'thanks', 'perfect', 'amazing', 'good']
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'disappointed', 'angry']

        const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length
        const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length

        if (positiveCount > negativeCount) return 'positive'
        if (negativeCount > positiveCount) return 'negative'
        return 'neutral'
    }

    /**
     * Extracts key information from a message (like name, email, phone)
     */
    async extractInformation(message: string): Promise<{
        name?: string
        email?: string
        phone?: string
        intent?: string
    }> {
        try {
            if (this.provider === 'openai' && this.openai) {
                const completion = await this.openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'Extract any personal information and intent from the message. Return a JSON object with fields: name, email, phone, intent. If a field is not found, omit it.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 150
                })

                const content = completion.choices[0].message.content || '{}'
                return JSON.parse(content)
            }

            return {}
        } catch (error) {
            logger.error('Failed to extract information', error)
            return {}
        }
    }
}

/**
 * Factory function to create AI service
 */
export function createAIService(
    provider: AIProvider,
    apiKey: string,
    model?: string
): AIService {
    return new AIService(provider, apiKey, model)
}

/**
 * Creates AI service from environment variables
 */
export function createAIServiceFromEnv(): AIService {
    const provider = (process.env.AI_PROVIDER || 'openai') as AIProvider
    const apiKey = process.env.AI_API_KEY || ''
    const model = process.env.AI_MODEL

    if (!apiKey) {
        throw new Error('AI_API_KEY environment variable is required')
    }

    return new AIService(provider, apiKey, model)
}
