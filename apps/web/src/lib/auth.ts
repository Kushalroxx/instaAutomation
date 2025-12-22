import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@repo/db"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],

    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub

                // Fetch user data including subscription info
                const user = await db.user.findUnique({
                    where: { id: token.sub },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                        subscriptionTier: true,
                        usageLimit: true,
                        usageCount: true,
                    }
                })

                if (user) {
                    session.user.subscriptionTier = user.subscriptionTier
                    session.user.usageLimit = user.usageLimit
                    session.user.usageCount = user.usageCount
                }
            }
            return session
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
    },

    events: {
        async signIn({ user, isNewUser }) {
            if (isNewUser) {
                console.log(`🎉 New user signed up: ${user.email}`)

                // Set default subscription tier for new users
                await db.user.update({
                    where: { id: user.id },
                    data: {
                        subscriptionTier: 'free',
                        usageLimit: 100,
                        usageCount: 0,
                        usageResetAt: new Date(),
                    }
                })
            }
        },
    },

    debug: process.env.NODE_ENV === 'development',
}
