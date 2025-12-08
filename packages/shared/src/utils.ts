import crypto from 'crypto'

// ============================================
// ENCRYPTION UTILITIES
// ============================================

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const TAG_POSITION = SALT_LENGTH + IV_LENGTH
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH

/**
 * Encrypts sensitive data (like access tokens)
 */
export function encrypt(text: string, secretKey: string): string {
    const iv = crypto.randomBytes(IV_LENGTH)
    const salt = crypto.randomBytes(SALT_LENGTH)

    const key = crypto.pbkdf2Sync(secretKey, salt, 100000, 32, 'sha512')
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()

    return Buffer.concat([salt, iv, tag, encrypted]).toString('base64')
}

/**
 * Decrypts sensitive data
 */
export function decrypt(encryptedData: string, secretKey: string): string {
    const buffer = Buffer.from(encryptedData, 'base64')

    const salt = buffer.slice(0, SALT_LENGTH)
    const iv = buffer.slice(SALT_LENGTH, TAG_POSITION)
    const tag = buffer.slice(TAG_POSITION, ENCRYPTED_POSITION)
    const encrypted = buffer.slice(ENCRYPTED_POSITION)

    const key = crypto.pbkdf2Sync(secretKey, salt, 100000, 32, 'sha512')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    return decipher.update(encrypted) + decipher.final('utf8')
}

// ============================================
// RATE LIMITING UTILITIES
// ============================================

interface RateLimitStore {
    [key: string]: {
        count: number
        resetAt: number
    }
}

const rateLimitStore: RateLimitStore = {}

/**
 * Simple in-memory rate limiter
 * For production, use Redis-based rate limiting
 */
export function checkRateLimit(
    key: string,
    maxRequests: number,
    windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const record = rateLimitStore[key]

    if (!record || now > record.resetAt) {
        rateLimitStore[key] = {
            count: 1,
            resetAt: now + windowMs
        }
        return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
    }

    if (record.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetAt: record.resetAt }
    }

    record.count++
    return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt }
}

/**
 * Clean up expired rate limit records
 */
export function cleanupRateLimits() {
    const now = Date.now()
    Object.keys(rateLimitStore).forEach(key => {
        if (rateLimitStore[key].resetAt < now) {
            delete rateLimitStore[key]
        }
    })
}

// ============================================
// STRING UTILITIES
// ============================================

/**
 * Checks if a message matches a keyword condition
 */
export function matchesKeyword(
    message: string,
    keyword: string,
    matchType: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'regex',
    caseSensitive: boolean = false
): boolean {
    const msg = caseSensitive ? message : message.toLowerCase()
    const kw = caseSensitive ? keyword : keyword.toLowerCase()

    switch (matchType) {
        case 'contains':
            return msg.includes(kw)
        case 'equals':
            return msg === kw
        case 'starts_with':
            return msg.startsWith(kw)
        case 'ends_with':
            return msg.endsWith(kw)
        case 'regex':
            try {
                const regex = new RegExp(keyword, caseSensitive ? '' : 'i')
                return regex.test(message)
            } catch {
                return false
            }
        default:
            return false
    }
}

/**
 * Replaces template variables in a message
 * Example: "Hello {{name}}" with { name: "John" } => "Hello John"
 */
export function replaceVariables(
    template: string,
    variables: Record<string, string>
): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] || match
    })
}

/**
 * Truncates text to a maximum length
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Sanitizes text for safe storage/display
 */
export function sanitizeText(text: string): string {
    return text
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim()
}

// ============================================
// TIME UTILITIES
// ============================================

/**
 * Formats a timestamp to a human-readable string
 */
export function formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toISOString()
}

/**
 * Gets time difference in human-readable format
 */
export function getTimeDiff(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return `${seconds}s ago`
}

/**
 * Checks if a token has expired
 */
export function isTokenExpired(expiresAt: Date | string | number): boolean {
    const expiryTime = typeof expiresAt === 'number'
        ? expiresAt
        : new Date(expiresAt).getTime()
    return Date.now() >= expiryTime
}

/**
 * Adds time to current timestamp
 */
export function addTime(amount: number, unit: 'seconds' | 'minutes' | 'hours' | 'days'): number {
    const multipliers = {
        seconds: 1000,
        minutes: 60 * 1000,
        hours: 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000
    }
    return Date.now() + (amount * multipliers[unit])
}

// ============================================
// RETRY UTILITIES
// ============================================

/**
 * Retries a function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error as Error
            if (i < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, i)
                await sleep(delay)
            }
        }
    }

    throw lastError!
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Checks if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Checks if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Generates a random string
 */
export function generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
}

/**
 * Generates a unique request ID
 */
export function generateRequestId(): string {
    return `req_${Date.now()}_${generateRandomString(8)}`
}

// ============================================
// COST CALCULATION UTILITIES
// ============================================

/**
 * Calculates OpenAI API cost based on model and tokens
 */
export function calculateOpenAICost(model: string, tokensUsed: number): number {
    const pricing: Record<string, { input: number; output: number }> = {
        'gpt-4': { input: 0.03, output: 0.06 },
        'gpt-4-turbo': { input: 0.01, output: 0.03 },
        'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
        'gpt-3.5-turbo-16k': { input: 0.003, output: 0.004 }
    }

    const modelPricing = pricing[model] || pricing['gpt-3.5-turbo']
    // Simplified: assuming 50/50 split between input and output
    const avgCostPer1K = (modelPricing.input + modelPricing.output) / 2
    return (tokensUsed / 1000) * avgCostPer1K
}

/**
 * Calculates Gemini API cost
 */
export function calculateGeminiCost(model: string, tokensUsed: number): number {
    // Gemini pricing (as of 2024)
    const pricing: Record<string, number> = {
        'gemini-pro': 0.00025,
        'gemini-pro-vision': 0.00025
    }

    const costPer1K = pricing[model] || pricing['gemini-pro']
    return (tokensUsed / 1000) * costPer1K
}

// ============================================
// PAGINATION UTILITIES
// ============================================

/**
 * Calculates pagination metadata
 */
export function calculatePagination(
    total: number,
    page: number,
    limit: number
) {
    const totalPages = Math.ceil(total / limit)
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    }
}

/**
 * Gets skip value for database queries
 */
export function getSkip(page: number, limit: number): number {
    return (page - 1) * limit
}

// ============================================
// ERROR UTILITIES
// ============================================

/**
 * Extracts error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'An unknown error occurred'
}

/**
 * Creates a safe error object for API responses
 */
export function createErrorResponse(error: unknown) {
    const message = getErrorMessage(error)
    return {
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message
        },
        meta: {
            timestamp: Date.now()
        }
    }
}

// ============================================
// LOGGING UTILITIES
// ============================================

export const logger = {
    debug: (message: string, meta?: any) => {
        if (process.env.LOG_LEVEL === 'debug') {
            console.log(`[DEBUG] ${message}`, meta || '')
        }
    },
    info: (message: string, meta?: any) => {
        console.log(`[INFO] ${message}`, meta || '')
    },
    warn: (message: string, meta?: any) => {
        console.warn(`[WARN] ${message}`, meta || '')
    },
    error: (message: string, error?: any) => {
        console.error(`[ERROR] ${message}`, error || '')
    }
}
