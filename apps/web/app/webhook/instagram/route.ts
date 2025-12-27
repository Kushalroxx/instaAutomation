import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/db';
import { createInstagramClient } from '@repo/shared/instagram-api';
import { getAIService } from '@repo/shared/ai-service';

/**
 * Webhook Verification (GET)
 * Meta will send a GET request to verify your webhook endpoint
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'your-verify-token-here';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified successfully');
        return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * Webhook Event Handler (POST)
 * Receives Instagram messages and processes them
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('Webhook received:', JSON.stringify(body, null, 2));

        // Store raw webhook event
        if (body?.entry) {
            for (const entry of body.entry) {
                const messaging = entry.messaging || [];
                const changes = entry.changes || [];

                // Handle Instagram DM messages
                for (const event of messaging) {
                    await handleIncomingMessage(event);
                }

                // Handle Instagram comments, mentions, story replies
                for (const change of changes) {
                    if (change.value) {
                        await handleWebhookChange(change);
                    }
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

/**
 * Handle incoming Instagram DM message
 */
async function handleIncomingMessage(event: any) {
    try {
        const senderId = event.sender?.id;
        const recipientId = event.recipient?.id;
        const messageData = event.message;

        if (!senderId || !messageData) return;

        // Find the Instagram account that received this message
        const igAccount = await db.instagramAccount.findFirst({
            where: { pageId: recipientId },
            include: {
                automations: {
                    where: { isActive: true },
                },
            },
        });

        if (!igAccount) {
            console.log('No Instagram account found for page:', recipientId);
            return;
        }

        // Store webhook event
        await db.webhookEvent.create({
            data: {
                igAccountId: igAccount.id,
                eventType: 'messages',
                payload: event,
            },
        });

        const messageText = messageData.text || '';
        const messageId = messageData.mid;

        // Find or create conversation
        let conversation = await db.conversation.findUnique({
            where: {
                igAccountId_senderId: {
                    igAccountId: igAccount.id,
                    senderId: senderId,
                },
            },
        });

        if (!conversation) {
            conversation = await db.conversation.create({
                data: {
                    igAccountId: igAccount.id,
                    senderId,
                    senderUsername: event.sender?.username,
                    senderName: event.sender?.name,
                    messages: [],
                    lastMessageAt: new Date(),
                },
            });
        }

        // Add message to conversation
        const messages = (conversation.messages as any[]) || [];
        messages.push({
            from: 'user',
            content: messageText,
            messageId,
            timestamp: new Date().toISOString(),
        });

        await db.conversation.update({
            where: { id: conversation.id },
            data: {
                messages,
                lastMessageAt: new Date(),
            },
        });

        // Check if any automation should trigger
        const matchingAutomations = igAccount.automations.filter((auto) => {
            if (auto.triggerType === 'all_messages') return true;
            if (auto.triggerType === 'first_message') return messages.length === 1;
            if (auto.triggerType === 'keyword') {
                const conditions = auto.conditions as any;
                const keyword = conditions?.keyword?.toLowerCase();
                return keyword && messageText.toLowerCase().includes(keyword);
            }
            return false;
        });

        // Process each matching automation
        for (const automation of matchingAutomations) {
            await processAutomation(automation, conversation, messageText, igAccount);
        }
    } catch (error) {
        console.error('Error handling incoming message:', error);
    }
}

/**
 * Process automation rule
 */
async function processAutomation(
    automation: any,
    conversation: any,
    incomingMessage: string,
    igAccount: any
) {
    const startTime = Date.now();

    try {
        let response = null;
        let tokensUsed = 0;
        let aiModel = null;

        if (automation.actionType === 'ai_reply') {
            // Generate AI reply
            const aiService = getAIService();
            const actionConfig = automation.actionConfig as any;

            const conversationHistory = ((conversation.messages as any[]) || [])
                .slice(-10)
                .map((msg: any) => ({
                    role: msg.from === 'user' ? 'user' : 'assistant',
                    content: msg.content || '',
                }));

            const aiResult = await aiService.generateReply({
                incomingMessage,
                conversationHistory,
                businessContext: actionConfig?.businessContext || '',
                tone: actionConfig?.tone || 'friendly',
                instructions: actionConfig?.instructions || '',
            });

            response = aiResult.reply;
            tokensUsed = aiResult.tokensUsed;
            aiModel = aiResult.model;

            // Send reply via Instagram API
            const igClient = createInstagramClient(igAccount.accessToken);
            await igClient.sendMessage(conversation.senderId, response, igAccount.pageId);

            // Update conversation with AI response
            const messages = (conversation.messages as any[]) || [];
            messages.push({
                from: 'assistant',
                content: response,
                timestamp: new Date().toISOString(),
                automationId: automation.id,
            });

            await db.conversation.update({
                where: { id: conversation.id },
                data: {
                    messages,
                    lastMessageAt: new Date(),
                },
            });
        }

        const processingTime = Date.now() - startTime;

        // Log activity
        await db.activityLog.create({
            data: {
                automationId: automation.id,
                conversationId: conversation.id,
                incomingMessage,
                outgoingResponse: response,
                status: 'success',
                processingTimeMs: processingTime,
                aiModel,
                aiTokensUsed: tokensUsed,
                aiCost: calculateAICost(tokensUsed, aiModel),
            },
        });

        // Update automation stats
        await db.automationRule.update({
            where: { id: automation.id },
            data: {
                triggerCount: { increment: 1 },
                successCount: { increment: 1 },
            },
        });
    } catch (error: any) {
        console.error('Error processing automation:', error);

        const processingTime = Date.now() - startTime;

        // Log failure
        await db.activityLog.create({
            data: {
                automationId: automation.id,
                conversationId: conversation.id,
                incomingMessage,
                outgoingResponse: null,
                status: 'failed',
                errorMessage: error.message,
                processingTimeMs: processingTime,
            },
        });

        // Update automation stats
        await db.automationRule.update({
            where: { id: automation.id },
            data: {
                triggerCount: { increment: 1 },
                failureCount: { increment: 1 },
            },
        });
    }
}

/**
 * Handle other webhook changes (comments, mentions, story replies)
 */
async function handleWebhookChange(change: any) {
    try {
        const field = change.field;
        const value = change.value;

        // Store webhook event
        await db.webhookEvent.create({
            data: {
                eventType: field,
                payload: value,
            },
        });

        // You can add handlers for comments, mentions, story replies here
        console.log('Received webhook change:', field, value);
    } catch (error) {
        console.error('Error handling webhook change:', error);
    }
}

/**
 * Calculate AI cost based on tokens and model
 */
function calculateAICost(tokens: number, model: string | null): number {
    if (!model || !tokens) return 0;

    // Gemini pricing (approximate)
    // Gemini 2.0 Flash: $0.075 per 1M input tokens, $0.30 per 1M output tokens
    // Gemini 2.5 Pro: $1.25 per 1M input tokens, $5.00 per 1M output tokens

    if (model.includes('flash')) {
        // Assuming 50/50 input/output for simplicity
        return (tokens / 1000000) * ((0.075 + 0.3) / 2);
    } else if (model.includes('pro')) {
        return (tokens / 1000000) * ((1.25 + 5.0) / 2);
    }

    return 0;
}
