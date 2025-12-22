import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            subscriptionTier?: string
            usageLimit?: number
            usageCount?: number
        } & DefaultSession["user"]
    }

    interface User {
        subscriptionTier?: string
        usageLimit?: number
        usageCount?: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string
    }
}
