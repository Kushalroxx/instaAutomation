import express from "express";
import dotenv from "dotenv";
import { db, webhookQueue } from "@repo/db";
import crypto from "crypto";

dotenv.config();
const app = express();

// Raw body parser for signature verification
app.use(express.json({
    verify: (req: any, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

/**
 * GET /webhook - Meta webhook verification
 * Meta will call this to verify your webhook URL
 */
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"] as string;
    const token = req.query["hub.verify_token"] as string;
    const challenge = req.query["hub.challenge"] as string;

    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        console.log("✅ Webhook verified!");
        return res.status(200).send(challenge);
    }

    console.log("❌ Webhook verification failed");
    return res.sendStatus(403);
});

/**
 * POST /webhook - Receive Instagram events from Meta
 * This is where all Instagram DMs, comments, mentions arrive
 */
app.post("/webhook", async (req, res) => {
    try {
        // STEP 1: Verify signature (important for security!)
        const signature = req.headers["x-hub-signature-256"] as string;
        if (signature && process.env.META_APP_SECRET) {
            const expectedSignature = crypto
                .createHmac("sha256", process.env.META_APP_SECRET)
                .update((req as any).rawBody || JSON.stringify(req.body))
                .digest("hex");

            if (`sha256=${expectedSignature}` !== signature) {
                console.error("❌ Invalid webhook signature");
                return res.sendStatus(403);
            }
        }

        const body = req.body;

        // STEP 2: Log the event
        console.log("📥 Webhook event received:", JSON.stringify(body, null, 2));

        // STEP 3: Process each entry
        if (body.object === "instagram") {
            for (const entry of body.entry || []) {
                const pageId = entry.id; // Facebook Page ID

                // Handle messaging events (DMs)
                if (entry.messaging) {
                    for (const event of entry.messaging) {
                        await handleMessagingEvent(event, pageId);
                    }
                }

                // Handle changes (comments, mentions, story replies)
                if (entry.changes) {
                    for (const change of entry.changes) {
                        await handleChangeEvent(change, pageId);
                    }
                }
            }
        }

        // STEP 4: Always respond 200 OK quickly (Meta requires <20s response)
        res.sendStatus(200);

    } catch (error) {
        console.error("❌ Webhook error:", error);
        res.sendStatus(500);
    }
});

/**
 * Handle Instagram DM events
 */
async function handleMessagingEvent(event: any, pageId: string) {
    try {
        // Find Instagram account by page ID
        const igAccount = await db.instagramAccount.findUnique({
            where: { pageId }
        });

        if (!igAccount) {
            console.log(`⚠️ No IG account found for page ${pageId}`);
            return;
        }

        // Extract message data
        const senderId = event.sender?.id;
        const recipientId = event.recipient?.id;
        const messageData = event.message;

        // Ignore messages sent by the bot itself
        if (!messageData || recipientId === igAccount.igBusinessAccountId) {
            return;
        }

        const messageText = messageData.text || "[Media or unsupported content]";
        const messageId = messageData.mid;

        console.log(`💬 Message from ${senderId}: "${messageText}"`);

        // Store raw webhook event in database
        const webhookEvent = await db.webhookEvent.create({
            data: {
                igAccountId: igAccount.id,
                eventType: "messages",
                payload: event,
                processed: false
            }
        });

        // Push to queue for processing
        await webhookQueue.add("webhook-event", {
            eventType: "message",
            payload: {
                webhookEventId: webhookEvent.id,
                igAccountId: igAccount.id,
                senderId,
                messageText,
                messageId,
                timestamp: event.timestamp
            },
            receivedAt: new Date().toISOString(),
            igAccountId: igAccount.id
        });

        console.log(`✅ Queued message for processing`);

    } catch (error) {
        console.error("Error handling messaging event:", error);
    }
}

/**
 * Handle Instagram comments, mentions, story replies
 */
async function handleChangeEvent(change: any, pageId: string) {
    try {
        const igAccount = await db.instagramAccount.findUnique({
            where: { pageId }
        });

        if (!igAccount) {
            return;
        }

        const field = change.field; // "comments", "mentions", "story_insights"
        const value = change.value;

        console.log(`📌 Change event: ${field}`, value);

        // Store webhook event
        const webhookEvent = await db.webhookEvent.create({
            data: {
                igAccountId: igAccount.id,
                eventType: field,
                payload: change,
                processed: false
            }
        });

        // Queue for processing based on type
        await webhookQueue.add("webhook-event", {
            eventType: field,
            payload: {
                webhookEventId: webhookEvent.id,
                igAccountId: igAccount.id,
                value
            },
            receivedAt: new Date().toISOString(),
            igAccountId: igAccount.id
        });

    } catch (error) {
        console.error("Error handling change event:", error);
    }
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Webhook server listening on port ${PORT}`);
    console.log(`📍 Webhook URL: http://localhost:${PORT}/webhook`);
    console.log(`🔐 Verify token: ${process.env.WEBHOOK_VERIFY_TOKEN || 'NOT SET'}`);
});
