import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIReplyOptions {
    incomingMessage: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    businessContext?: string;
    tone?: 'professional' | 'friendly' | 'casual' | 'enthusiastic';
    instructions?: string;
    maxTokens?: number;
}

interface AIAnalysisOptions {
    messages: string[];
    analysisType: 'lead_score' | 'intent' | 'sentiment' | 'keywords';
}

export class GeminiAIService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string, modelName: string = 'gemini-2.0-flash-exp') {
        if (!apiKey) {
            throw new Error('Gemini API key is required');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: modelName });
    }

    /**
     * Generate an AI reply for Instagram messages
     */
    async generateReply(options: AIReplyOptions): Promise<{
        reply: string;
        tokensUsed: number;
        model: string;
    }> {
        const {
            incomingMessage,
            conversationHistory = [],
            businessContext = '',
            tone = 'friendly',
            instructions = '',
            maxTokens = 500,
        } = options;

        // Build the system prompt
        const systemPrompt = this.buildSystemPrompt(businessContext, tone, instructions);

        // Build conversation context
        const conversationContext = conversationHistory
            .map((msg) => `${msg.role === 'user' ? 'Customer' : 'You'}: ${msg.content}`)
            .join('\n');

        // Complete prompt
        const fullPrompt = `${systemPrompt}

${conversationContext ? `Previous Conversation:\n${conversationContext}\n\n` : ''}New Customer Message: ${incomingMessage}

Generate a helpful, ${tone} response for Instagram DM. Keep it concise (2-3 sentences max), natural, and engaging. Do NOT use emojis unless the customer used them first. Do NOT include greetings like "Hi there!" if this is a continuation of a conversation.

Your Response:`;

        try {
            const result = await this.model.generateContent(fullPrompt);
            const response = result.response;
            const text = response.text();

            // Estimate tokens (rough approximation)
            const tokensUsed = Math.ceil((fullPrompt.length + text.length) / 4);

            return {
                reply: text.trim(),
                tokensUsed,
                model: 'gemini-2.0-flash-exp',
            };
        } catch (error: any) {
            console.error('Gemini AI Error:', error);
            throw new Error(`AI generation failed: ${error.message}`);
        }
    }

    /**
     * Analyze conversation for lead scoring, intent, sentiment
     */
    async analyzeConversation(options: AIAnalysisOptions): Promise<any> {
        const { messages, analysisType } = options;

        const conversationText = messages.join('\n');

        let prompt = '';

        switch (analysisType) {
            case 'lead_score':
                prompt = `Analyze this Instagram conversation and provide a lead score from 0-100 based on:
- Purchase intent (high intent = higher score)
- Engagement level (more engaged = higher score)
- Question quality (specific questions = higher score)
- Response speed (faster responses = higher score)

Conversation:
${conversationText}

Return ONLY a JSON object with this format:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation>",
  "signals": ["<positive signal 1>", "<positive signal 2>"]
}`;
                break;

            case 'intent':
                prompt = `Analyze this Instagram conversation and determine the customer's primary intent.

Conversation:
${conversationText}

Return ONLY a JSON object with this format:
{
  "intent": "<primary intent: inquiry, purchase, support, complaint, general>",
  "confidence": <number 0-100>,
  "details": "<specific details about what they want>"
}`;
                break;

            case 'sentiment':
                prompt = `Analyze the sentiment of this Instagram conversation.

Conversation:
${conversationText}

Return ONLY a JSON object with this format:
{
  "sentiment": "<positive, neutral, negative>",
  "score": <number -100 to 100>,
  "emotions": ["<emotion1>", "<emotion2>"]
}`;
                break;

            case 'keywords':
                prompt = `Extract important keywords and topics from this Instagram conversation.

Conversation:
${conversationText}

Return ONLY a JSON object with this format:
{
  "keywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "topics": ["<topic1>", "<topic2>"],
  "questions": ["<question1>", "<question2>"]
}`;
                break;

            default:
                throw new Error(`Unknown analysis type: ${analysisType}`);
        }

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Invalid JSON response from AI');
        } catch (error: any) {
            console.error('AI Analysis Error:', error);
            throw new Error(`AI analysis failed: ${error.message}`);
        }
    }

    /**
     * Generate automation rule suggestions
     */
    async suggestAutomations(businessType: string): Promise<Array<{
        name: string;
        description: string;
        trigger: string;
        sampleReply: string;
    }>> {
        const prompt = `You are an Instagram automation expert. Generate 5 smart automation rule suggestions for a ${businessType} business.

For each automation, provide:
1. Name (short, catchy)
2. Description (what it does)
3. Trigger (keyword or condition)
4. Sample AI reply template

Return ONLY a JSON array with this format:
[
  {
    "name": "<automation name>",
    "description": "<what it does>",
    "trigger": "<trigger keyword or condition>",
    "sampleReply": "<example reply template>"
  }
]`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Invalid JSON response from AI');
        } catch (error: any) {
            console.error('AI Suggestion Error:', error);
            throw new Error(`AI suggestion failed: ${error.message}`);
        }
    }

    /**
     * Build system prompt based on context
     */
    private buildSystemPrompt(businessContext: string, tone: string, instructions: string): string {
        let prompt = `You are an AI assistant managing Instagram direct messages for a business.`;

        if (businessContext) {
            prompt += `\n\nBusiness Context: ${businessContext}`;
        }

        const toneGuidelines = {
            professional: 'Maintain a professional, polished tone. Use proper grammar and formal language.',
            friendly: 'Be warm, approachable, and conversational. Sound like a helpful friend.',
            casual: 'Keep it relaxed and informal. Use casual language but stay respectful.',
            enthusiastic: 'Be energetic, positive, and excited. Show genuine enthusiasm.',
        };

        prompt += `\n\nTone: ${toneGuidelines[tone]}`;

        if (instructions) {
            prompt += `\n\nAdditional Instructions: ${instructions}`;
        }

        prompt += `\n\nGuidelines:
- Keep responses concise and Instagram-appropriate (2-3 sentences)
- Be helpful and aim to move the conversation forward
- If you don't know something, be honest
- Don't make promises you can't keep
- Match the customer's communication style
- Avoid generic corporate speak`;

        return prompt;
    }
}

// Singleton instance
let aiServiceInstance: GeminiAIService | null = null;

export function getAIService(): GeminiAIService {
    if (!aiServiceInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is required');
        }
        aiServiceInstance = new GeminiAIService(apiKey, 'gemini-2.0-flash-exp');
    }
    return aiServiceInstance;
}
