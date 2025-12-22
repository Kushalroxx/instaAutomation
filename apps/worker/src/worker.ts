import { Worker } from "bullmq";
import dotenv from "dotenv";
import {
    db,
    getActiveAutomations,
    getOrCreateConversation,
    addMessageToConversation,
    logActivity,
    checkUsageLimit,
    incrementUsage
} from "@repo/db";
import { generateAIReply, generateTemplateReply, validateMessage, ToneType } from "@repo/ai";
import { MetaInstagramClient } from "@repo/meta-sdk";

dotenv.config();

const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: +(process.env.REDIS_PORT || 6379)
};

/**
 * Worker for processing webhook events and automation triggers
 */
const webhookWorker = new Worker("webhook-events", async job => {
    console.log(`🔄 Processing job ${job.id}: ${job.name}`);
    const startTime = Date.now();

    try {
        const { eventType, payload, igAccountId } = job.data;

        if (eventType === "message") {
            await processMessageEvent(payload, igAccountId, startTime);
        } else {
            console.log(`ℹ️ Skipping non-message event: ${eventType}`);
        }

        console.log(`✅ Job ${job.id} completed in ${Date.now() - startTime}ms`);
    } catch (error) {
        console.error(`❌ Job ${job.id} failed:`, error);
        throw error; // BullMQ will retry based on queue config
    }
}, { connection, concurrency: +(process.env.WORKER_CONCURRENCY || 5) });

/**
 * Process incoming Instagram message
 */
async function processMessageEvent(payload: any, igAccountId: string, startTime: number) {
    const { senderId, messageText, messageId, webhookEventId } = payload;

    try {
        // Step 1: Get Instagram account and check if it's active
        const igAccount = await db.instagramAccount.findUnique({
            where: { id: igAccountId },
            include: { user: true }
        });

        if (!igAccount || !igAccount.isActive) {
            console.log("⚠️ Instagram account not active");
            return;
        }

        // Step 2: Check user's usage limit
        const canProcess = await checkUsageLimit(igAccount.userId);
        if (!canProcess) {
            console.log(`⚠️ User ${igAccount.userId} has exceeded usage limit`);
            await logActivity({
                incomingMessage: messageText,
                status: "skipped",
                errorMessage: "Usage limit exceeded"
            });
            return;
        }

        // Step 3: Get or create conversation
        const conversation = await getOrCreateConversation(
            igAccountId,
            senderId,
            payload.senderUsername
        );

        // Add incoming message to conversation
        await addMessageToConversation(conversation.id, {
            role: "user",
            content: messageText,
            timestamp: new Date(),
            messageId
        });

        // Step 4: Get active automations for this account
        const automations = await getActiveAutomations(igAccountId);

        if (automations.length === 0) {
            console.log("ℹ️ No active automations found");
            return;
        }

        // Step 5: Find matching automation
        const matchedAutomation = findMatchingAutomation(automations, messageText, conversation);

        if (!matchedAutomation) {
            console.log("ℹ️ No automation matched");
            return;
        }

        console.log(`🎯 Matched automation: ${matchedAutomation.name}`);

        // Step 6: Generate response based on action type
        let response: string;
        let aiModel: string | undefined;
        let aiTokensUsed: number | undefined;
        let aiCost: number | undefined;

        const actionConfig = matchedAutomation.actionConfig as any;

        if (matchedAutomation.actionType === "ai_reply") {
            // Generate AI response
            const aiResult = await generateAIReply({
                incomingMessage: messageText,
                businessContext: actionConfig.businessContext || "General customer support",
                tone: (actionConfig.tone || "friendly") as ToneType,
                conversationHistory: getConversationHistory(conversation),
                customInstructions: actionConfig.customInstructions
            });

            response = aiResult.reply;
            aiModel = aiResult.model;
            aiTokensUsed = aiResult.tokensUsed;
            aiCost = aiResult.cost;

        } else if (matchedAutomation.actionType === "predefined_message") {
            // Use predefined template
            response = generateTemplateReply({
                template: actionConfig.message || "Thank you for your message!",
                variables: {
                    name: conversation.senderName || "there",
                    username: conversation.senderUsername || "friend"
                }
            });
        } else {
            console.log(`⚠️ Unknown action type: ${matchedAutomation.actionType}`);
            return;
        }

        // Step 7: Validate response
        const validation = validateMessage(response);
        if (!validation.isValid) {
            console.error(`❌ Invalid response: ${validation.reason}`);
            await logActivity({
                automationId: matchedAutomation.id,
                conversationId: conversation.id,
                incomingMessage: messageText,
                status: "failed",
                errorMessage: `Invalid response: ${validation.reason}`,
                processingTimeMs: Date.now() - startTime
            });
            return;
        }

        // Step 8: Send message via Instagram API
        const metaClient = new MetaInstagramClient(igAccount.accessToken);

        try {
            const sendResult = await metaClient.sendMessage({
                igUserId: igAccount.igBusinessAccountId,
                recipientId: senderId,
                message: response
            });

            console.log(`✅ Message sent successfully: ${sendResult.messageId}`);

            // Step 9: Add response to conversation
            await addMessageToConversation(conversation.id, {
                role: "assistant",
                content: response,
                timestamp: new Date(),
                messageId: sendResult.messageId
            });

            // Step 10: Log success
            await logActivity({
                automationId: matchedAutomation.id,
                conversationId: conversation.id,
                incomingMessage: messageText,
                outgoingResponse: response,
                status: "success",
                processingTimeMs: Date.now() - startTime,
                aiModel,
                aiTokensUsed,
                aiCost
            });

            // Step 11: Increment usage counter and automation stats
            await incrementUsage(igAccount.userId);
            await db.automationRule.update({
                where: { id: matchedAutomation.id },
                data: {
                    triggerCount: { increment: 1 },
                    successCount: { increment: 1 }
                }
            });

            // Mark webhook event as processed
            await db.webhookEvent.update({
                where: { id: webhookEventId },
                data: { processed: true, processedAt: new Date() }
            });

        } catch (sendError: any) {
            console.error("❌ Failed to send message:", sendError);

            await logActivity({
                automationId: matchedAutomation.id,
                conversationId: conversation.id,
                incomingMessage: messageText,
                outgoingResponse: response,
                status: "failed",
                errorMessage: sendError.message,
                processingTimeMs: Date.now() - startTime,
                aiModel,
                aiTokensUsed,
                aiCost
            });

            await db.automationRule.update({
                where: { id: matchedAutomation.id },
                data: {
                    triggerCount: { increment: 1 },
                    failureCount: { increment: 1 }
                }
            });
        }

    } catch (error: any) {
        console.error("❌ Error processing message:", error);
        throw error;
    }
}

/**
 * Find automation that matches the incoming message
 */
function findMatchingAutomation(automations: any[], messageText: string, conversation: any): any | null {
    const lowerMessage = messageText.toLowerCase().trim();
    const isFirstMessage = (conversation.messages as any[]).length === 1;

    for (const automation of automations) {
        const triggerType = automation.triggerType;
        const conditions = automation.conditions as any;

        // First message trigger
        if (triggerType === "first_message" && isFirstMessage) {
            return automation;
        }

        // Keyword trigger
        if (triggerType === "keyword") {
            const keyword = conditions.keyword?.toLowerCase() || "";
            const matchType = conditions.matchType || "contains";

            if (matchType === "contains" && lowerMessage.includes(keyword)) {
                return automation;
            }
            if (matchType === "equals" && lowerMessage === keyword) {
                return automation;
            }
            if (matchType === "starts_with" && lowerMessage.startsWith(keyword)) {
                return automation;
            }
        }

        // Reaction trigger (if payload includes reaction data)
        if (triggerType === "reaction") {
            return automation;
        }
    }

    return null;
}

/**
 * Get conversation history for AI context
 */
function getConversationHistory(conversation: any): Array<{ role: 'user' | 'assistant', content: string }> {
    const messages = conversation.messages as any[];
    return messages.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content
    }));
}

// Worker event handlers
webhookWorker.on("completed", job => {
    console.log(`✅ Job ${job.id} completed`);
});

webhookWorker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
});

webhookWorker.on("error", err => {
    console.error("❌ Worker error:", err);
});

console.log("🚀 Automation worker started");
console.log(`📊 Concurrency: ${process.env.WORKER_CONCURRENCY || 5}`);
console.log(`🔗 Redis: ${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`);
console.log("⏳ Listening to webhook-events queue...");
