// ============================================
// SUBSCRIPTION TIERS
// ============================================

export const SUBSCRIPTION_TIERS = {
    free: {
        name: 'Free',
        price: 0,
        messagesPerDay: 100,
        maxAutomations: 1,
        features: [
            'Up to 100 messages/day',
            '1 automation rule',
            'Basic AI replies',
            'Activity log (7 days)',
        ]
    },
    pro: {
        name: 'Pro',
        price: 29,
        messagesPerDay: 1000,
        maxAutomations: 10,
        features: [
            'Up to 1,000 messages/day',
            '10 automation rules',
            'Advanced AI replies',
            'Activity log (30 days)',
            'Priority support',
            'Custom tone presets',
        ]
    },
    business: {
        name: 'Business',
        price: 99,
        messagesPerDay: 10000,
        maxAutomations: 100,
        features: [
            'Up to 10,000 messages/day',
            'Unlimited automations',
            'Advanced AI with GPT-4',
            'Unlimited activity log',
            '24/7 priority support',
            'Custom integrations',
            'Dedicated account manager',
        ]
    }
} as const

// ============================================
// AI TONE PRESETS
// ============================================

export const TONE_PRESETS = {
    professional: {
        name: 'Professional',
        description: 'Business-like, formal, and respectful',
        systemPrompt: 'Respond in a professional, business-like manner. Be respectful and formal.'
    },
    friendly: {
        name: 'Friendly',
        description: 'Warm, approachable, and conversational',
        systemPrompt: 'Respond in a warm, friendly, and approachable manner. Be conversational but helpful.'
    },
    casual: {
        name: 'Casual',
        description: 'Relaxed, informal, and easy-going',
        systemPrompt: 'Respond in a casual, relaxed manner. Use informal language and be easy-going.'
    },
    enthusiastic: {
        name: 'Enthusiastic',
        description: 'Energetic, positive, and excited',
        systemPrompt: 'Respond with enthusiasm and energy. Be positive and excited to help.'
    },
    formal: {
        name: 'Formal',
        description: 'Very professional, corporate, and polished',
        systemPrompt: 'Respond in a very formal, corporate manner. Be extremely professional and polished.'
    }
} as const

// ============================================
// AUTOMATION TEMPLATES
// ============================================

export const AUTOMATION_TEMPLATES = [
    {
        id: 'real-estate-lead',
        name: 'Real Estate Lead Capture',
        category: 'real_estate',
        description: 'Automatically respond to property inquiries and capture lead information',
        triggerType: 'keyword',
        conditions: { keyword: 'property', matchType: 'contains' },
        actionType: 'ai_reply',
        actionConfig: {
            businessContext: 'You are a real estate assistant. Help potential buyers with property inquiries, ask for their budget and preferences, and offer to schedule viewings.',
            tone: 'professional'
        }
    },
    {
        id: 'fitness-faq',
        name: 'Fitness Coach FAQ Bot',
        category: 'fitness',
        description: 'Answer common fitness questions automatically',
        triggerType: 'first_message',
        conditions: {},
        actionType: 'ai_reply',
        actionConfig: {
            businessContext: 'You are a fitness coach assistant. Answer questions about workouts, nutrition, and training programs. Be motivating and encouraging.',
            tone: 'enthusiastic'
        }
    },
    {
        id: 'ecommerce-support',
        name: 'E-commerce Customer Support',
        category: 'ecommerce',
        description: 'Handle product questions and order inquiries',
        triggerType: 'keyword',
        conditions: { keyword: 'order', matchType: 'contains' },
        actionType: 'ai_reply',
        actionConfig: {
            businessContext: 'You are a customer support assistant for an e-commerce store. Help with product questions, order status, shipping, and returns.',
            tone: 'friendly'
        }
    }
] as const

// ============================================
// ERROR CODES
// ============================================

export const ERROR_CODES = {
    // Authentication
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',

    // Instagram
    IG_NOT_CONNECTED: 'IG_NOT_CONNECTED',
    IG_TOKEN_EXPIRED: 'IG_TOKEN_EXPIRED',
    IG_API_ERROR: 'IG_API_ERROR',

    // Automation
    AUTOMATION_NOT_FOUND: 'AUTOMATION_NOT_FOUND',
    AUTOMATION_LIMIT_REACHED: 'AUTOMATION_LIMIT_REACHED',

    // Usage
    USAGE_LIMIT_EXCEEDED: 'USAGE_LIMIT_EXCEEDED',

    // AI
    AI_ERROR: 'AI_ERROR',
    AI_TIMEOUT: 'AI_TIMEOUT',

    // General
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const
