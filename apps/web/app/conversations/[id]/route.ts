import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            include: { instagramAccounts: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const conversationId = params.id;

        // Get conversation and verify access
        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId,
                igAccount: {
                    userId: user.id,
                },
            },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found or access denied' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            messages: conversation.messages || [],
        });
    } catch (error: any) {
        console.error('Error fetching conversation messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages', details: error.message },
            { status: 500 }
        );
    }
}
