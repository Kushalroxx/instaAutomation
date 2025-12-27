'use client'

import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export function UserMenu() {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return (
            <div className="glass-card p-4 flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-white/10"></div>
                <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-16"></div>
                </div>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        redirect('/auth/signin')
    }

    if (!session?.user) return null

    return (
        <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center overflow-hidden">
                {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                    <User size={20} className="text-white" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{session.user.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">
                    {session.user.subscriptionTier === 'free' && 'Free Plan'}
                    {session.user.subscriptionTier === 'pro' && 'Pro Plan'}
                    {session.user.subscriptionTier === 'business' && 'Business Plan'}
                </p>
            </div>
            <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Sign out"
            >
                <LogOut size={18} className="text-gray-400" />
            </button>
        </div>
    )
}
