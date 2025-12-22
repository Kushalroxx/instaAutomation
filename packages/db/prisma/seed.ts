import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Clean existing data (in development only!)
    await prisma.activityLog.deleteMany()
    await prisma.conversation.deleteMany()
    await prisma.webhookEvent.deleteMany()
    await prisma.automationRule.deleteMany()
    await prisma.instagramAccount.deleteMany()
    await prisma.account.deleteMany()
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()
    await prisma.automationTemplate.deleteMany()

    console.log('🗑️  Cleared existing data')

    // Create demo user
    const demoUser = await prisma.user.create({
        data: {
            email: 'demo@instaautomation.com',
            name: 'Demo User',
            subscriptionTier: 'pro',
            usageLimit: 500,
            usageCount: 47,
            usageResetAt: new Date(),
        }
    })

    console.log('👤 Created demo user:', demoUser.email)

    // Create Instagram account (with dummy tokens)
    const igAccount = await prisma.instagramAccount.create({
        data: {
            userId: demoUser.id,
            pageId: 'dummy-page-id-12345',
            igBusinessAccountId: 'dummy-ig-business-id-67890',
            username: 'demo_business',
            profilePictureUrl: 'https://via.placeholder.com/150',
            accessToken: 'DUMMY_ACCESS_TOKEN_REPLACE_WITH_REAL_TOKEN',
            tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            tokenRefreshedAt: new Date(),
            webhookSubscribed: true,
            isActive: true,
            lastSyncAt: new Date(),
        }
    })

    console.log('📸 Created Instagram account:', igAccount.username)

    // Create automation templates
    const templates = await prisma.automationTemplate.createMany({
        data: [
            {
                name: 'Real Estate Lead Capture',
                description: 'Automatically respond to property inquiries with AI-powered details and schedule viewings',
                category: 'real_estate',
                icon: '🏠',
                triggerType: 'keyword',
                conditions: { keyword: 'property', matchType: 'contains' },
                actionType: 'ai_reply',
                actionConfig: {
                    businessContext: 'We are a real estate agency. Help users with property inquiries, pricing, and schedule viewings.',
                    tone: 'professional',
                },
                usageCount: 145,
                isPublic: true,
            },
            {
                name: 'Fitness Coach DM Bot',
                description: 'Engage fitness enthusiasts, answer workout questions, and promote training packages',
                category: 'fitness',
                icon: '💪',
                triggerType: 'first_message',
                conditions: {},
                actionType: 'ai_reply',
                actionConfig: {
                    businessContext: 'Personal fitness trainer. Answer workout questions, provide motivation, and offer training packages.',
                    tone: 'enthusiastic',
                },
                usageCount: 89,
                isPublic: true,
            },
            {
                name: 'E-commerce FAQ Bot',
                description: 'Answer product questions, shipping info, and help with order tracking',
                category: 'ecommerce',
                icon: '🛍️',
                triggerType: 'keyword',
                conditions: { keyword: 'order', matchType: 'contains' },
                actionType: 'ai_reply',
                actionConfig: {
                    businessContext: 'E-commerce store. Help customers with product info, shipping, returns, and order tracking.',
                    tone: 'friendly',
                },
                usageCount: 234,
                isPublic: true,
            },
        ]
    })

    console.log(`📋 Created ${templates.count} automation templates`)

    // Create sample automations
    const automation1 = await prisma.automationRule.create({
        data: {
            userId: demoUser.id,
            igAccountId: igAccount.id,
            name: 'Welcome New Followers',
            description: 'Send friendly welcome message to first-time DMs',
            isActive: true,
            triggerType: 'first_message',
            conditions: {},
            actionType: 'ai_reply',
            actionConfig: {
                businessContext: 'We help businesses automate Instagram DMs with AI. Be friendly and helpful.',
                tone: 'friendly',
                customInstructions: 'Always ask how you can help them today.',
            },
            triggerCount: 23,
            successCount: 22,
            failureCount: 1,
        }
    })

    const automation2 = await prisma.automationRule.create({
        data: {
            userId: demoUser.id,
            igAccountId: igAccount.id,
            name: 'Pricing Inquiries',
            description: 'Handle pricing questions with AI',
            isActive: true,
            triggerType: 'keyword',
            conditions: { keyword: 'price', matchType: 'contains' },
            actionType: 'ai_reply',
            actionConfig: {
                businessContext: 'Our pricing: Free (100 msgs/day), Pro $29/mo (500 msgs/day), Business $99/mo (unlimited).',
                tone: 'professional',
            },
            triggerCount: 15,
            successCount: 15,
            failureCount: 0,
        }
    })

    const automation3 = await prisma.automationRule.create({
        data: {
            userId: demoUser.id,
            igAccountId: igAccount.id,
            name: 'Support Keywords',
            description: 'Help users looking for support',
            isActive: true,
            triggerType: 'keyword',
            conditions: { keyword: 'help', matchType: 'contains' },
            actionType: 'predefined_message',
            actionConfig: {
                message: 'Hi! 👋 I\'m here to help. You can ask me about:\n\n• Pricing & Plans\n• Features\n• Integration setup\n• Troubleshooting\n\nWhat would you like to know?',
            },
            triggerCount: 8,
            successCount: 8,
            failureCount: 0,
        }
    })

    console.log('⚡ Created 3 active automations')

    // Create sample conversations
    const conversations = await prisma.conversation.createMany({
        data: [
            {
                igAccountId: igAccount.id,
                senderId: 'instagram-user-001',
                senderUsername: 'sarah_designs',
                senderName: 'Sarah Johnson',
                messages: [
                    { role: 'user', content: 'Hey! What are your prices?', timestamp: new Date(Date.now() - 3600000) },
                    { role: 'assistant', content: 'Hi Sarah! Our pricing is: Free (100 msgs/day), Pro $29/mo (500 msgs/day), Business $99/mo (unlimited). Which plan interests you?', timestamp: new Date(Date.now() - 3500000) },
                    { role: 'user', content: 'The Pro plan sounds good!', timestamp: new Date(Date.now() - 3000000) },
                ],
                tags: ['interested', 'pro-plan'],
                leadScore: 75,
                funnelStage: 'qualified',
                firstMessageAt: new Date(Date.now() - 3600000),
                lastMessageAt: new Date(Date.now() - 3000000),
            },
            {
                igAccountId: igAccount.id,
                senderId: 'instagram-user-002',
                senderUsername: 'mike_photos',
                senderName: 'Mike Chen',
                messages: [
                    { role: 'user', content: 'How does this work?', timestamp: new Date(Date.now() - 7200000) },
                    { role: 'assistant', content: 'Great question! InstaAuto uses AI to automatically respond to your Instagram DMs. You create automation rules, and we handle the rest. Want to see a demo?', timestamp: new Date(Date.now() - 7100000) },
                ],
                tags: ['new'],
                leadScore: 40,
                funnelStage: 'engaged',
                firstMessageAt: new Date(Date.now() - 7200000),
                lastMessageAt: new Date(Date.now() - 7100000),
            },
            {
                igAccountId: igAccount.id,
                senderId: 'instagram-user-003',
                senderUsername: 'emma_art',
                senderName: 'Emma Wilson',
                messages: [
                    { role: 'user', content: 'Hello!', timestamp: new Date(Date.now() - 1800000) },
                    { role: 'assistant', content: 'Hi Emma! 👋 Welcome! How can I help you today?', timestamp: new Date(Date.now() - 1700000) },
                ],
                tags: [],
                leadScore: 20,
                funnelStage: 'new',
                firstMessageAt: new Date(Date.now() - 1800000),
                lastMessageAt: new Date(Date.now() - 1700000),
            },
        ]
    })

    console.log(`💬 Created ${conversations.count} conversations`)

    // Create activity logs
    const activityLogs = await prisma.activityLog.createMany({
        data: [
            {
                automationId: automation1.id,
                incomingMessage: 'Hi! I\'m interested in your service',
                outgoingResponse: 'Hello! Thanks for reaching out. I\'d be happy to help you learn about our Instagram automation platform. What would you like to know?',
                status: 'success',
                processingTimeMs: 847,
                aiModel: 'gpt-3.5-turbo',
                aiTokensUsed: 156,
                aiCost: 0.00023,
                createdAt: new Date(Date.now() - 300000),
            },
            {
                automationId: automation2.id,
                incomingMessage: 'What\'s the price?',
                outgoingResponse: 'Our pricing is designed to scale with your needs: Free tier (100 messages/day), Pro at $29/month (500 messages/day), and Business at $99/month (unlimited). Which plan would work best for you?',
                status: 'success',
                processingTimeMs: 923,
                aiModel: 'gpt-3.5-turbo',
                aiTokensUsed: 178,
                aiCost: 0.00027,
                createdAt: new Date(Date.now() - 600000),
            },
            {
                automationId: automation3.id,
                incomingMessage: 'I need help setting this up',
                outgoingResponse: 'Hi! 👋 I\'m here to help. You can ask me about:\n\n• Pricing & Plans\n• Features\n• Integration setup\n• Troubleshooting\n\nWhat would you like to know?',
                status: 'success',
                processingTimeMs: 234,
                createdAt: new Date(Date.now() - 900000),
            },
            {
                automationId: automation1.id,
                incomingMessage: 'Testing message',
                outgoingResponse: null,
                status: 'failed',
                errorMessage: 'Rate limit exceeded',
                processingTimeMs: 120,
                createdAt: new Date(Date.now() - 1200000),
            },
        ]
    })

    console.log(`📊 Created ${activityLogs.count} activity logs`)

    console.log('✅ Database seeded successfully!')
    console.log('\n📋 Summary:')
    console.log('   - 1 demo user (demo@instaautomation.com)')
    console.log('   - 1 Instagram account (demo_business)')
    console.log('   - 3 automation templates')
    console.log('   - 3 active automations')
    console.log('   - 3 conversations')
    console.log('   - 4 activity logs')
    console.log('\n🚀 You can now test the dashboard with real data!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
