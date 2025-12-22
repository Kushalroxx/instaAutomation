'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, Home } from 'lucide-react'

export default function AuthError() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const errorMessages: Record<string, string> = {
        Configuration: 'There is a problem with the server configuration.',
        AccessDenied: 'You do not have permission to sign in.',
        Verification: 'The verification token has expired or has already been used.',
        Default: 'An error occurred during authentication.',
    }

    const message = errorMessages[error || 'Default'] || errorMessages.Default

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-card p-8 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle size={32} className="text-red-500" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
                    <p className="text-gray-400">{message}</p>
                </div>

                <div className="flex gap-3">
                    <Link href="/auth/signin" className="flex-1 btn-primary">
                        Try Again
                    </Link>
                    <Link href="/" className="flex-1 glass-card px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                        <Home size={18} />
                        Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
