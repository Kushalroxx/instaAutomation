import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type {
    InstagramProfile,
    InstagramConversation,
    InstagramMessage,
    SendMessageResponse,
    GraphAPIError
} from './types'
import { InstagramAPIError, RateLimitError } from './types'
import { logger, retryWithBackoff } from './utils'

/**
 * Instagram Graph API Client
 * Handles all interactions with Meta's Instagram Graph API
 */
export class InstagramAPIClient {
    private client: AxiosInstance
    private accessToken: string
    private baseURL: string = 'https://graph.facebook.com/v18.0'

    constructor(accessToken: string) {
        this.accessToken = accessToken
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Add request interceptor for logging
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                logger.debug('Instagram API Request', {
                    method: config.method,
                    url: config.url,
                    params: config.params
                })
                return config
            },
            (error: any) => Promise.reject(error)
        )

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            (response: any) => response,
            (error: AxiosError<{ error: GraphAPIError }>) => {
                return this.handleAPIError(error)
            }
        )
    }

    /**
     * Handles API errors and converts them to custom error types
     */
    private handleAPIError(error: AxiosError<{ error: GraphAPIError }>): never {
        if (error.response) {
            const apiError = error.response.data.error

            // Rate limit error
            if (error.response.status === 429 || apiError?.code === 4) {
                const retryAfter = parseInt(error.response.headers['retry-after'] || '60')
                throw new RateLimitError(
                    `Instagram API rate limit exceeded. Retry after ${retryAfter}s`,
                    retryAfter
                )
            }

            // Other API errors
            throw new InstagramAPIError(
                apiError?.message || 'Instagram API error',
                apiError
            )
        }

        // Network or timeout errors
        throw new InstagramAPIError(
            error.message || 'Failed to connect to Instagram API'
        )
    }

    /**
     * Gets Instagram Business Account profile information
     */
    async getProfile(igBusinessAccountId: string): Promise<InstagramProfile> {
        try {
            const response = await this.client.get(`/${igBusinessAccountId}`, {
                params: {
                    fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count',
                    access_token: this.accessToken
                }
            })

            logger.info('Fetched Instagram profile', { username: response.data.username })
            return response.data
        } catch (error) {
            logger.error('Failed to fetch Instagram profile', error)
            throw error
        }
    }

    /**
     * Gets all conversations for an Instagram Business Account
     */
    async getConversations(
        igBusinessAccountId: string,
        limit: number = 25
    ): Promise<InstagramConversation[]> {
        try {
            const response = await this.client.get(`/${igBusinessAccountId}/conversations`, {
                params: {
                    platform: 'instagram',
                    fields: 'id,participants,messages{id,created_time,from,to,message,attachments}',
                    limit,
                    access_token: this.accessToken
                }
            })

            logger.info('Fetched conversations', { count: response.data.data.length })
            return response.data.data
        } catch (error) {
            logger.error('Failed to fetch conversations', error)
            throw error
        }
    }

    /**
     * Gets messages from a specific conversation
     */
    async getMessages(
        conversationId: string,
        limit: number = 25
    ): Promise<InstagramMessage[]> {
        try {
            const response = await this.client.get(`/${conversationId}/messages`, {
                params: {
                    fields: 'id,created_time,from,to,message,attachments',
                    limit,
                    access_token: this.accessToken
                }
            })

            return response.data.data
        } catch (error) {
            logger.error('Failed to fetch messages', error)
            throw error
        }
    }

    /**
     * Sends a message to a user
     */
    async sendMessage(
        recipientId: string,
        message: string,
        pageId: string
    ): Promise<SendMessageResponse> {
        try {
            const response = await retryWithBackoff(
                async () => {
                    return await this.client.post(
                        `/${pageId}/messages`,
                        {
                            recipient: { id: recipientId },
                            message: { text: message }
                        },
                        {
                            params: {
                                access_token: this.accessToken
                            }
                        }
                    )
                },
                3, // Max retries
                1000 // Base delay
            )

            logger.info('Message sent successfully', {
                recipientId,
                messageId: response.data.message_id
            })

            return {
                message_id: response.data.message_id,
                recipient_id: recipientId
            }
        } catch (error) {
            logger.error('Failed to send message', error)
            throw error
        }
    }

    /**
     * Subscribes to webhook events for a page
     */
    async subscribeToWebhooks(
        pageId: string,
        fields: string[] = ['messages', 'messaging_postbacks', 'message_echoes']
    ): Promise<boolean> {
        try {
            const response = await this.client.post(
                `/${pageId}/subscribed_apps`,
                {},
                {
                    params: {
                        subscribed_fields: fields.join(','),
                        access_token: this.accessToken
                    }
                }
            )

            logger.info('Subscribed to webhooks', { pageId, fields })
            return response.data.success
        } catch (error) {
            logger.error('Failed to subscribe to webhooks', error)
            throw error
        }
    }

    /**
     * Unsubscribes from webhook events
     */
    async unsubscribeFromWebhooks(pageId: string): Promise<boolean> {
        try {
            const response = await this.client.delete(
                `/${pageId}/subscribed_apps`,
                {
                    params: {
                        access_token: this.accessToken
                    }
                }
            )

            logger.info('Unsubscribed from webhooks', { pageId })
            return response.data.success
        } catch (error) {
            logger.error('Failed to unsubscribe from webhooks', error)
            throw error
        }
    }

    /**
     * Gets the current webhook subscriptions
     */
    async getWebhookSubscriptions(pageId: string): Promise<string[]> {
        try {
            const response = await this.client.get(
                `/${pageId}/subscribed_apps`,
                {
                    params: {
                        access_token: this.accessToken
                    }
                }
            )

            const subscriptions = response.data.data[0]?.subscribed_fields || []
            logger.info('Fetched webhook subscriptions', { pageId, subscriptions })
            return subscriptions
        } catch (error) {
            logger.error('Failed to fetch webhook subscriptions', error)
            throw error
        }
    }

    /**
     * Validates the access token
     */
    async validateToken(): Promise<{
        isValid: boolean
        expiresAt?: number
        scopes?: string[]
    }> {
        try {
            const response = await this.client.get('/debug_token', {
                params: {
                    input_token: this.accessToken,
                    access_token: this.accessToken
                }
            })

            const data = response.data.data
            logger.info('Token validated', {
                isValid: data.is_valid,
                expiresAt: data.expires_at
            })

            return {
                isValid: data.is_valid,
                expiresAt: data.expires_at,
                scopes: data.scopes
            }
        } catch (error) {
            logger.error('Failed to validate token', error)
            return { isValid: false }
        }
    }

    /**
     * Exchanges short-lived token for long-lived token
     */
    async exchangeToken(
        appId: string,
        appSecret: string,
        shortLivedToken: string
    ): Promise<{ accessToken: string; expiresIn: number }> {
        try {
            const response = await this.client.get('/oauth/access_token', {
                params: {
                    grant_type: 'fb_exchange_token',
                    client_id: appId,
                    client_secret: appSecret,
                    fb_exchange_token: shortLivedToken
                }
            })

            logger.info('Token exchanged successfully')
            return {
                accessToken: response.data.access_token,
                expiresIn: response.data.expires_in
            }
        } catch (error) {
            logger.error('Failed to exchange token', error)
            throw error
        }
    }

    /**
     * Marks a message as read
     */
    async markAsRead(messageId: string, pageId: string): Promise<boolean> {
        try {
            const response = await this.client.post(
                `/${pageId}/messages`,
                {
                    recipient: { id: messageId },
                    sender_action: 'mark_seen'
                },
                {
                    params: {
                        access_token: this.accessToken
                    }
                }
            )

            logger.debug('Message marked as read', { messageId })
            return response.data.success
        } catch (error) {
            logger.error('Failed to mark message as read', error)
            return false
        }
    }

    /**
     * Sends typing indicator
     */
    async sendTypingIndicator(recipientId: string, pageId: string): Promise<boolean> {
        try {
            const response = await this.client.post(
                `/${pageId}/messages`,
                {
                    recipient: { id: recipientId },
                    sender_action: 'typing_on'
                },
                {
                    params: {
                        access_token: this.accessToken
                    }
                }
            )

            logger.debug('Typing indicator sent', { recipientId })
            return response.data.success
        } catch (error) {
            logger.error('Failed to send typing indicator', error)
            return false
        }
    }
}

/**
 * Factory function to create Instagram API client
 */
export function createInstagramClient(accessToken: string): InstagramAPIClient {
    return new InstagramAPIClient(accessToken)
}
