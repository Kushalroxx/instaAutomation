import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create sample user
    const user = await prisma.user.upsert({
        where: { email: 'demo@instauto.com' },
        update: {},
        create: {
            email: 'demo@instauto.com',
            name: 'Demo User',
            subscriptionTier: 'pro',
            usageLimit: 1000,
            usageCount: 234,
        },
    })
    console.log('✅ Created user:', user.email)

    // Create sample Instagram account
    const igAccount = await prisma.instagramAccount.create({
        data: {
            userId: user.id,
            pageId: 'demo_page_123456',
            igBusinessAccountId: 'demo_ig_business_789',
            username: 'demo_business',
            profilePictureUrl: 'https://via.placeholder.com/150',
            accessToken: 'demo_access_token_placeholder',
            tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            webhookSubscribed: true,
            isActive: true,
        },
    })
    console.log('✅ Created Instagram account:', igAccount.username)

    // Create sample automations
    const automations = await prisma.automationRule.createMany({
        data: [
            {
                userId: user.id,
                igAccountId: igAccount.id,
                name: 'Welcome New Followers',
                description: 'Send a friendly welcome message to first-time DMs',
                triggerType: 'first_message',
                conditions: {},
                actionType: 'ai_reply',
                actionConfig: {
                    tone: 'friendly',
                    businessContext: 'We are a digital marketing agency',
                },
                isActive: true,
                triggerCount: 234,
                successCount: 228,
                failureCount: 6,
            },
            {
                userId: user.id,
                igAccountId: igAccount.id,
                name: 'Product Inquiry Response',
                description: 'Auto-reply to pricing and product questions',
                triggerType: 'keyword',
                conditions: { keyword: 'price', matchType: 'contains' },
                actionType: 'ai_reply',
                actionConfig: {
                    tone: 'professional',
                    businessContext: 'Our pricing starts at $99/month',
                },
                isActive: true,
                triggerCount: 156,
                successCount: 152,
                failureCount: 4,
            },
            {
                userId: user.id,
                igAccountId: igAccount.id,
                name: 'Lead Qualification',
                description: 'Qualify leads interested in our services',
                triggerType: 'keyword',
                conditions: { keyword: 'interested', matchType: 'contains' },
                actionType: 'ai_reply',
                actionConfig: {
                    tone: 'professional',
                    businessContext: 'We offer full-service digital marketing',
                },
                isActive: true,
                triggerCount: 89,
                successCount: 85,
                failureCount: 4,
            },
            {
                userId: user.id,
                igAccountId: igAccount.id,
                name: 'Support Ticket Creation',
                description: 'Create support tickets for help requests',
                triggerType: 'keyword',
                conditions: { keyword: 'help', matchType: 'contains' },
                actionType: 'predefined_message',
                actionConfig: {
                    message: 'Thanks for reaching out! Our support team will get back to you within 24 hours.',
                },
                isActive: false,
                triggerCount: 45,
                successCount: 42,
                failureCount: 3,
            },
        ],
    })
    console.log('✅ Created automations:', automations.count)

    // Create sample conversations
    const conversations = [
        {
            senderId: 'ig_user_001',
            senderUsername: '@sarah_designs',
            senderName: 'Sarah Johnson',
            messages: [
                {
                    role: 'user',
                    content: 'Hi! What are your prices for social media management?',
                    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
                },
                {
                    role: 'assistant',
                    content: 'Hello Sarah! Our social media management packages start at $299/month and include content creation, posting, and analytics. Would you like to schedule a call to discuss your specific needs?',
                    timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
                },
            ],
        },
        {
            senderId: 'ig_user_002',
            senderUsername: '@mike_photos',
            senderName: 'Mike Chen',
            messages: [
                {
                    role: 'user',
                    content: 'Do you offer photography services?',
                    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
                },
                {
                    role: 'assistant',
                    content: 'Hi Mike! Yes, we partner with professional photographers for product and brand photography. Our packages include 50-100 edited photos starting at $499. What type of photography are you looking for?',
                    timestamp: new Date(Date.now() - 14 * 60 * 1000),
                },
            ],
        },
        {
            senderId: 'ig_user_003',
            senderUsername: '@emma_art',
            senderName: 'Emma Wilson',
            messages: [
                {
                    role: 'user',
                    content: "I'm interested in your services for my art business",
                    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
                },
                {
                    role: 'assistant',
                    content: "That's wonderful, Emma! We'd love to help grow your art business. We specialize in visual content marketing which is perfect for artists. Can you tell me more about your current social media presence?",
                    timestamp: new Date(Date.now() - 59 * 60 * 1000),
                },
            ],
        },
        {
            senderId: 'ig_user_004',
            senderUsername: '@john_dev',
            senderName: 'John Davis',
            messages: [
                {
                    role: 'user',
                    content: 'Can you help me with Instagram ads?',
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                },
            ],
        },
    ]

    for (const convData of conversations) {
        const conv = await prisma.conversation.create({
            data: {
                igAccountId: igAccount.id,
                senderId: convData.senderId,
                senderUsername: convData.senderUsername,
                senderName: convData.senderName,
                messages: convData.messages,
                firstMessageAt: new Date(convData.messages[0].timestamp),
                lastMessageAt: new Date(convData.messages[convData.messages.length - 1].timestamp),
            },
        })

        // Create activity logs for each message exchange
        if (convData.messages.length > 1) {
            await prisma.activityLog.create({
                data: {
                    conversationId: conv.id,
                    incomingMessage: convData.messages[0].content,
                    outgoingResponse: convData.messages[1].content,
                    status: 'success',
                    processingTimeMs: Math.floor(Math.random() * 2000) + 500,
                    aiModel: 'gpt-4',
                    aiTokensUsed: Math.floor(Math.random() * 200) + 50,
                    aiCost: 0.002,
                },
            })
        }
    }
    console.log('✅ Created conversations:', conversations.length)

    // Create additional activity logs
    await prisma.activityLog.createMany({
        data: [
            {
                incomingMessage: 'Hello, I need help with my account',
                outgoingResponse: 'Hi! I\'d be happy to help. What issue are you experiencing?',
                status: 'success',
                processingTimeMs: 1200,
                aiModel: 'gpt-4',
                aiTokensUsed: 120,
                aiCost: 0.0015,
            },
            {
                incomingMessage: 'What are your business hours?',
                outgoingResponse: 'We\'re available Monday-Friday 9am-6pm EST. How can we assist you?',
                status: 'success',
                processingTimeMs: 800,
                aiModel: 'gpt-3.5-turbo',
                aiTokensUsed: 80,
                aiCost: 0.0008,
            },
            {
                incomingMessage: 'Can I get a discount?',
                status: 'failed',
                errorMessage: 'Rate limit exceeded',
                processingTimeMs: 500,
            },
        ],
    })
    console.log('✅ Created additional activity logs')

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log('  - Users: 1')
    console.log('  - Instagram Accounts: 1')
    console.log('  - Automations: 4')
    console.log('  - Conversations: 4')
    console.log('  - Activity Logs: ~7')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
