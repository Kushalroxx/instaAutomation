import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, mockSession } from '@/lib/auth';
import { db } from '@repo/db';
import { createInstagramClient } from '@repo/shared';

/**
 * Connect Instagram Account
 * This endpoint handles Instagram Business Account connection via OAuth
 */
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
        const { accessToken, pageId, igBusinessAccountId } = body;

        if (!accessToken || !pageId || !igBusinessAccountId) {
            return NextResponse.json(
                { error: 'Missing required fields: accessToken, pageId, igBusinessAccountId' },
                { status: 400 }
            );
        }

        // Create Instagram API client to fetch profile info
        const igClient = createInstagramClient(accessToken);

        // Get profile information
        const profile = await igClient.getProfile(igBusinessAccountId);

        // Calculate token expiration (60 days for long-lived tokens)
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 60);

        // Check if this Instagram account is already connected
        const existing = await db.instagramAccount.findUnique({
            where: { pageId },
        });

        let instagramAccount;

        if (existing) {
            // Update existing account
            instagramAccount = await db.instagramAccount.update({
                where: { id: existing.id },
                data: {
                    userId: user.id,
                    accessToken,
                    igBusinessAccountId,
                    username: profile.username,
                    profilePictureUrl: profile.profile_picture_url,
                    tokenExpiresAt,
                    tokenRefreshedAt: new Date(),
                    lastSyncAt: new Date(),
                    isActive: true,
                },
            });
        } else {
            // Create new account
            instagramAccount = await db.instagramAccount.create({
                data: {
                    userId: user.id,
                    pageId,
                    igBusinessAccountId,
                    username: profile.username,
                    profilePictureUrl: profile.profile_picture_url,
                    accessToken,
                    tokenExpiresAt,
                    isActive: true,
                },
            });
        }

        // Subscribe to webhooks
        try {
            await igClient.subscribeToWebhooks(pageId, [
                'messages',
                'messaging_postbacks',
                'messaging_optins',
                'message_deliveries',
                'message_reads',
            ]);

            await db.instagramAccount.update({
                where: { id: instagramAccount.id },
                data: { webhookSubscribed: true },
            });
        } catch (webhookError) {
            console.error('Failed to subscribe to webhooks:', webhookError);
            // Continue even if webhook subscription fails
        }

        return NextResponse.json({
            success: true,
            account: {
                id: instagramAccount.id,
                username: instagramAccount.username,
                profilePictureUrl: instagramAccount.profilePictureUrl,
                isActive: instagramAccount.isActive,
                webhookSubscribed: instagramAccount.webhookSubscribed,
            },
        });
    } catch (error: any) {
        console.error('Error connecting Instagram account:', error);
        return NextResponse.json(
            { error: 'Failed to connect Instagram account', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Get connected Instagram accounts
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            include: {
                instagramAccounts: {
                    select: {
                        id: true,
                        username: true,
                        profilePictureUrl: true,
                        isActive: true,
                        webhookSubscribed: true,
                        lastSyncAt: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            accounts: user.instagramAccounts,
        });
    } catch (error: any) {
        console.error('Error fetching Instagram accounts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Instagram accounts', details: error.message },
            { status: 500 }
        );
    }
}
