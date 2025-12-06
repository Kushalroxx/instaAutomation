import Redis from 'ioredis'
import { Queue, Worker, Job } from 'bullmq'

// ============================================
// REDIS CONNECTION
// ============================================

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
}

// Create Redis connection for general use
export const redis = new Redis(redisConfig)

// Connection event handlers
redis.on('connect', () => {
    console.log('✅ Redis connected successfully')
})

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err)
})

redis.on('ready', () => {
    console.log('✅ Redis is ready to accept commands')
})

// ============================================
// QUEUE TYPES
// ============================================

export interface WebhookJobData {
    eventType: string
    payload: any
    receivedAt: string
    igAccountId?: string
}

export interface MessageJobData {
    conversationId: string
    automationId: string
    senderId: string
    senderUsername?: string
    messageText: string
    igAccountId: string
}

export interface SendMessageJobData {
    igAccountId: string
    recipientId: string
    message: string
    conversationId: string
    activityLogId?: string
}

// ============================================
// QUEUES
// ============================================

// Queue for incoming webhook events
export const webhookQueue = new Queue<WebhookJobData>('webhook-events', {
    connection: redisConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
            age: 24 * 3600, // Keep for 24 hours
        },
        removeOnFail: {
            count: 500, // Keep last 500 failed jobs for debugging
        },
    },
})

// Queue for processing messages and triggering automations
export const messageQueue = new Queue<MessageJobData>('message-processing', {
    connection: redisConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            count: 100,
            age: 24 * 3600,
        },
        removeOnFail: {
            count: 500,
        },
    },
})

// Queue for sending messages to Instagram
export const sendMessageQueue = new Queue<SendMessageJobData>('send-message', {
    connection: redisConfig,
    defaultJobOptions: {
        attempts: 5, // More retries for sending messages
        backoff: {
            type: 'exponential',
            delay: 3000,
        },
        removeOnComplete: {
            count: 1000,
            age: 7 * 24 * 3600, // Keep for 7 days
        },
        removeOnFail: {
            count: 1000,
        },
    },
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Add webhook event to queue
 */
export async function queueWebhookEvent(data: WebhookJobData) {
    return await webhookQueue.add('webhook-event', data, {
        priority: 1, // High priority
    })
}

/**
 * Add message processing job to queue
 */
export async function queueMessageProcessing(data: MessageJobData) {
    return await messageQueue.add('process-message', data, {
        priority: 2,
    })
}

/**
 * Add send message job to queue
 */
export async function queueSendMessage(data: SendMessageJobData) {
    return await sendMessageQueue.add('send-message', data, {
        priority: 3,
    })
}

/**
 * Get queue statistics
 */
export async function getQueueStats(queueName: 'webhook' | 'message' | 'send') {
    const queue = queueName === 'webhook' ? webhookQueue :
        queueName === 'message' ? messageQueue :
            sendMessageQueue

    const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
        queue.getDelayedCount(),
    ])

    return {
        waiting,
        active,
        completed,
        failed,
        delayed,
        total: waiting + active + completed + failed + delayed,
    }
}

/**
 * Clear all queues (use with caution!)
 */
export async function clearAllQueues() {
    await Promise.all([
        webhookQueue.drain(),
        messageQueue.drain(),
        sendMessageQueue.drain(),
    ])
    console.log('✅ All queues cleared')
}

/**
 * Graceful shutdown
 */
export async function closeRedisConnections() {
    await Promise.all([
        webhookQueue.close(),
        messageQueue.close(),
        sendMessageQueue.close(),
        redis.quit(),
    ])
    console.log('✅ All Redis connections closed')
}

// ============================================
// CACHING HELPERS
// ============================================

/**
 * Cache automation rules for quick access
 */
export async function cacheAutomationRules(igAccountId: string, rules: any[]) {
    const key = `automations:${igAccountId}`
    await redis.setex(key, 300, JSON.stringify(rules)) // Cache for 5 minutes
}

/**
 * Get cached automation rules
 */
export async function getCachedAutomationRules(igAccountId: string) {
    const key = `automations:${igAccountId}`
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
}

/**
 * Cache Instagram access token
 */
export async function cacheAccessToken(igAccountId: string, token: string, expiresIn: number) {
    const key = `token:${igAccountId}`
    await redis.setex(key, expiresIn, token)
}

/**
 * Get cached access token
 */
export async function getCachedAccessToken(igAccountId: string) {
    const key = `token:${igAccountId}`
    return await redis.get(key)
}

/**
 * Rate limiting check
 */
export async function checkRateLimit(userId: string, limit: number, windowSeconds: number): Promise<boolean> {
    const key = `ratelimit:${userId}`
    const current = await redis.incr(key)

    if (current === 1) {
        await redis.expire(key, windowSeconds)
    }

    return current <= limit
}

/**
 * Increment rate limit counter
 */
export async function getRateLimitRemaining(userId: string, limit: number): Promise<number> {
    const key = `ratelimit:${userId}`
    const current = await redis.get(key)
    return limit - (current ? parseInt(current) : 0)
}
