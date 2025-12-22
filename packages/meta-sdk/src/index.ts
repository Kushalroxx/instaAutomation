import axios, { AxiosInstance } from 'axios'

const META_GRAPH_API_VERSION = 'v19.0'
const META_GRAPH_BASE_URL = `https://graph.facebook.com/${META_GRAPH_API_VERSION}`

/**
 * Meta Graph API Client for Instagram Business Account
 */
export class MetaInstagramClient {
    private client: AxiosInstance
    private accessToken: string

    constructor(accessToken: string) {
        this.accessToken = accessToken
        this.client = axios.create({
            baseURL: META_GRAPH_BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    /**
     * Send a direct message to an Instagram user
     */
    async sendMessage(params: {
        recipientId: string
        message: string
        igUserId: string // Your IG Business Account ID
    }): Promise<{ messageId: string; success: boolean }> {
        try {
            const response = await this.client.post(
                `/${params.igUserId}/messages`,
                {
                    recipient: { id: params.recipientId },
                    message: { text: params.message }
                },
                {
                    params: { access_token: this.accessToken }
                }
            )

            return {
                messageId: response.data.message_id || response.data.id,
                success: true
            }
        } catch (error: any) {
            console.error('Failed to send Instagram message:', error.response?.data || error.message)
            throw new Error(`Meta API Error: ${error.response?.data?.error?.message || error.message}`)
        }
    }

    /**
     * Send a message with media (image, video)
     */
    async sendMediaMessage(params: {
        recipientId: string
        mediaUrl: string
        mediaType: 'image' | 'video'
        igUserId: string
    }): Promise<{ messageId: string; success: boolean }> {
        try {
            const attachment = {
                type: params.mediaType,
                payload: { url: params.mediaUrl }
            }

            const response = await this.client.post(
                `/${params.igUserId}/messages`,
                {
                    recipient: { id: params.recipientId },
                    message: { attachment }
                },
                {
                    params: { access_token: this.accessToken }
                }
            )

            return {
                messageId: response.data.message_id || response.data.id,
                success: true
            }
        } catch (error: any) {
            console.error('Failed to send media message:', error.response?.data || error.message)
            throw new Error(`Meta API Error: ${error.response?.data?.error?.message || error.message}`)
        }
    }

    /**
     * Reply to a comment on Instagram
     */
    async replyToComment(params: {
        commentId: string
        message: string
    }): Promise<{ commentId: string; success: boolean }> {
        try {
            const response = await this.client.post(
                `/${params.commentId}/replies`,
                { message: params.message },
                {
                    params: { access_token: this.accessToken }
                }
            )

            return {
                commentId: response.data.id,
                success: true
            }
        } catch (error: any) {
            console.error('Failed to reply to comment:', error.response?.data || error.message)
            throw new Error(`Meta API Error: ${error.response?.data?.error?.message || error.message}`)
        }
    }

    /**
     * Get Instagram account info
     */
    async getAccountInfo(igUserId: string): Promise<{
        id: string
        username: string
        name?: string
        profile_picture_url?: string
        followers_count?: number
    }> {
        try {
            const response = await this.client.get(`/${igUserId}`, {
                params: {
                    fields: 'id,username,name,profile_picture_url,followers_count',
                    access_token: this.accessToken
                }
            })

            return response.data
        } catch (error: any) {
            console.error('Failed to get account info:', error.response?.data || error.message)
            throw new Error(`Meta API Error: ${error.response?.data?.error?.message || error.message}`)
        }
    }

    /**
     * Subscribe to webhook events for an Instagram account
     */
    async subscribeToWebhooks(pageId: string, callbackUrl: string): Promise<boolean> {
        try {
            await this.client.post(
                `/${pageId}/subscribed_apps`,
                {},
                {
                    params: {
                        subscribed_fields: 'messages,messaging_postbacks,message_echoes',
                        access_token: this.accessToken
                    }
                }
            )
            return true
        } catch (error: any) {
            console.error('Failed to subscribe to webhooks:', error.response?.data || error.message)
            return false
        }
    }
}

/**
 * Exchange short-lived token for long-lived token (60 days)
 */
export async function exchangeForLongLivedToken(params: {
    shortLivedToken: string
    appId: string
    appSecret: string
}): Promise<{ accessToken: string; expiresIn: number }> {
    try {
        const response = await axios.get(`${META_GRAPH_BASE_URL}/oauth/access_token`, {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: params.appId,
                client_secret: params.appSecret,
                fb_exchange_token: params.shortLivedToken
            }
        })

        return {
            accessToken: response.data.access_token,
            expiresIn: response.data.expires_in || 5184000 // 60 days in seconds
        }
    } catch (error: any) {
        console.error('Failed to exchange token:', error.response?.data || error.message)
        throw new Error(`Token exchange failed: ${error.response?.data?.error?.message || error.message}`)
    }
}

/**
 * Get Instagram Business Account ID from Page ID
 */
export async function getInstagramAccountId(params: {
    pageId: string
    accessToken: string
}): Promise<string | null> {
    try {
        const response = await axios.get(`${META_GRAPH_BASE_URL}/${params.pageId}`, {
            params: {
                fields: 'instagram_business_account',
                access_token: params.accessToken
            }
        })

        return response.data.instagram_business_account?.id || null
    } catch (error: any) {
        console.error('Failed to get IG account ID:', error.response?.data || error.message)
        return null
    }
}

/**
 * Verify webhook signature from Meta
 */
export function verifyWebhookSignature(params: {
    payload: string
    signature: string
    appSecret: string
}): boolean {
    const crypto = require('crypto')
    const expectedSignature = crypto
        .createHmac('sha256', params.appSecret)
        .update(params.payload)
        .digest('hex')

    return `sha256=${expectedSignature}` === params.signature
}

/**
 * Generate Meta OAuth URL for Instagram login
 */
export function generateOAuthUrl(params: {
    appId: string
    redirectUri: string
    state?: string
}): string {
    const scopes = [
        'instagram_basic',
        'instagram_manage_messages',
        'instagram_manage_comments',
        'pages_show_list',
        'pages_manage_metadata',
        'business_management'
    ]

    const queryParams = new URLSearchParams({
        client_id: params.appId,
        redirect_uri: params.redirectUri,
        scope: scopes.join(','),
        response_type: 'code',
        ...(params.state && { state: params.state })
    })

    return `https://www.facebook.com/${META_GRAPH_API_VERSION}/dialog/oauth?${queryParams.toString()}`
}

/**
 * Exchange OAuth code for access token
 */
export async function exchangeCodeForToken(params: {
    code: string
    appId: string
    appSecret: string
    redirectUri: string
}): Promise<{ accessToken: string; expiresIn: number }> {
    try {
        const response = await axios.get(`${META_GRAPH_BASE_URL}/oauth/access_token`, {
            params: {
                client_id: params.appId,
                client_secret: params.appSecret,
                redirect_uri: params.redirectUri,
                code: params.code
            }
        })

        return {
            accessToken: response.data.access_token,
            expiresIn: response.data.expires_in || 3600
        }
    } catch (error: any) {
        console.error('Failed to exchange code for token:', error.response?.data || error.message)
        throw new Error(`OAuth error: ${error.response?.data?.error?.message || error.message}`)
    }
}

export default {
    MetaInstagramClient,
    exchangeForLongLivedToken,
    getInstagramAccountId,
    verifyWebhookSignature,
    generateOAuthUrl,
    exchangeCodeForToken
}
