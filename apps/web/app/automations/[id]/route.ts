import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/db';

export async function PATCH(
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
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const automationId = params.id;
        const body = await request.json();

        // Verify ownership
        const automation = await db.automationRule.findFirst({
            where: {
                id: automationId,
                userId: user.id,
            },
        });

        if (!automation) {
            return NextResponse.json(
                { error: 'Automation not found or access denied' },
                { status: 404 }
            );
        }

        // Update automation
        const updated = await db.automationRule.update({
            where: { id: automationId },
            data: {
                ...body,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            automation: updated,
        });
    } catch (error: any) {
        console.error('Error updating automation:', error);
        return NextResponse.json(
            { error: 'Failed to update automation', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
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
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const automationId = params.id;

        // Verify ownership
        const automation = await db.automationRule.findFirst({
            where: {
                id: automationId,
                userId: user.id,
            },
        });

        if (!automation) {
            return NextResponse.json(
                { error: 'Automation not found or access denied' },
                { status: 404 }
            );
        }

        // Delete automation
        await db.automationRule.delete({
            where: { id: automationId },
        });

        return NextResponse.json({
            success: true,
            message: 'Automation deleted successfully',
        });
    } catch (error: any) {
        console.error('Error deleting automation:', error);
        return NextResponse.json(
            { error: 'Failed to delete automation', details: error.message },
            { status: 500 }
        );
    }
}
