import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/db';
import { getAIService } from '@repo/shared/ai-service';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const {
            incomingMessage,
            conversationId,
            businessContext,
            tone = 'friendly',
            instructions,
        } = body;

        if (!incomingMessage) {
            return NextResponse.json(
                { error: 'Missing incoming message' },
                { status: 400 }
            );
        }

        // Get conversation history if conversationId provided
        let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

        if (conversationId) {
            const conversation = await db.conversation.findUnique({
                where: { id: conversationId },
            });

            if (conversation) {
                const messages = conversation.messages as any[];
                conversationHistory = messages.slice(-10).map((msg: any) => ({
                    role: msg.from === 'user' ? 'user' : 'assistant',
                    content: msg.content || msg.message || '',
                }));
            }
        }

        // Generate AI reply using Gemini
        const aiService = getAIService();
        const result = await aiService.generateReply({
            incomingMessage,
            conversationHistory,
            businessContext,
            tone,
            instructions,
        });

        return NextResponse.json({
            success: true,
            reply: result.reply,
            tokensUsed: result.tokensUsed,
            model: result.model,
        });
    } catch (error: any) {
        console.error('Error generating AI reply:', error);
        return NextResponse.json(
            { error: 'Failed to generate AI reply', details: error.message },
            { status: 500 }
        );
    }
}
