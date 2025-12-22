'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Instagram, Sparkles, Zap, MessageSquare, TrendingUp, Shield, Clock, Brain } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        try {
            await signIn('google', { callbackUrl: '/dashboard' })
        } catch (error) {
            console.error('Sign in error:', error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen gradient-bg relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left side - Marketing content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full border border-primary-500/20 hover:border-primary-500/40 transition-all">
                            <Sparkles size={18} className="text-primary-400 animate-pulse" />
                            <span className="text-sm font-medium bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                                AI-Powered Instagram Automation
                            </span>
                        </div>

                        {/* Main headline */}
                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                                Automate Your<br />
                                <span className="instagram-gradient bg-clip-text text-transparent inline-block mt-2">
                                    Instagram DMs
                                </span>
                                <br />
                                <span className="text-4xl lg:text-5xl text-gray-300">with AI Magic</span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-2xl">
                                Never miss a message. Respond instantly to every DM.
                                Convert more leads while you sleep.
                                <span className="text-white font-semibold"> Your AI assistant is always on.</span>
                            </p>
                        </div>

                        {/* Stats/Social proof */}
                        <div className="grid grid-cols-3 gap-6 pt-4">
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-white">98%</div>
                                <div className="text-sm text-gray-400">Response Rate</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-white">&lt;2s</div>
                                <div className="text-sm text-gray-400">Avg Response</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-white">24/7</div>
                                <div className="text-sm text-gray-400">Availability</div>
                            </div>
                        </div>

                        {/* Features grid */}
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            {[
                                { icon: Brain, title: 'Smart AI', desc: 'Contextual conversations' },
                                { icon: Zap, title: 'Instant', desc: 'Reply in seconds' },
                                { icon: Shield, title: 'Secure', desc: 'Official Meta API' },
                                { icon: Clock, title: '24/7', desc: 'Always online' },
                            ].map((feature, i) => (
                                <div key={i} className="glass-card p-5 hover:bg-white/5 transition-all group hover:scale-105 hover:shadow-2xl duration-300">
                                    <feature.icon className="text-primary-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
                                    <h3 className="font-bold mb-1 text-white">{feature.title}</h3>
                                    <p className="text-sm text-gray-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Sign in card with better spacing */}
                    <div className="lg:pl-12">
                        <div className="glass-card p-10 lg:p-12 space-y-10 border border-white/10 hover:border-white/20 transition-all shadow-2xl">
                            {/* Header */}
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 mx-auto rounded-3xl instagram-gradient flex items-center justify-center shadow-lg shadow-primary-500/50 animate-pulse">
                                    <Instagram size={40} className="text-white" />
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-4xl font-black">Start Free Today</h2>
                                    <p className="text-lg text-gray-400 leading-relaxed">
                                        Join thousands automating Instagram DMs with AI
                                    </p>
                                </div>
                            </div>

                            {/* Sign in button */}
                            <div className="space-y-6">
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-4 transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="text-lg">
                                        {isLoading ? 'Signing in...' : 'Continue with Google'}
                                    </span>
                                </button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/20"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-6 bg-[#0a0a0f] text-gray-500 font-medium">Free Plan Includes</span>
                                    </div>
                                </div>

                                {/* Free plan benefits */}
                                <div className="space-y-3">
                                    {[
                                        '100 AI responses per day',
                                        'Unlimited automations',
                                        'Real-time analytics',
                                        'No credit card required'
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-300">{benefit}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Upgrade hint */}
                                <div className="glass-card p-5 border border-primary-500/20 bg-primary-500/5">
                                    <div className="flex items-start gap-3">
                                        <TrendingUp className="text-primary-400 mt-0.5 flex-shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-semibold text-white mb-1">Need more?</p>
                                            <p className="text-xs text-gray-400">Upgrade to Pro for 500 msgs/day at just $29/month</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center pt-6 border-t border-white/10 space-y-3">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    By continuing, you agree to our{' '}
                                    <Link href="/terms" className="text-primary-400 hover:text-primary-300 underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-primary-400 hover:text-primary-300 underline">
                                        Privacy Policy
                                    </Link>
                                </p>

                                <Link
                                    href="/"
                                    className="inline-block text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    ← Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
