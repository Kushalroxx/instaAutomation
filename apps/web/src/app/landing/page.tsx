'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
    Instagram, ArrowRight, Sparkles, Zap, Brain, MessageSquare,
    TrendingUp, Shield, Clock, CheckCircle, Star, Users, BarChart3,
    Award, Globe, Lock
} from 'lucide-react'

export default function LandingPage() {
    const [activePricing, setActivePricing] = useState<'monthly' | 'yearly'>('monthly')

    return (
        <div className="min-h-screen gradient-bg">
            {/* Navigation */}
            <nav className="glass-card border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl instagram-gradient flex items-center justify-center">
                                <Instagram size={24} className="text-white" />
                            </div>
                            <span className="text-xl font-black">InstaAuto</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/auth/signin" className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors font-medium">
                                Sign In
                            </Link>
                            <Link href="/auth/signin" className="btn-primary px-8 py-2.5 flex items-center gap-2">
                                Start Free
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full border border-primary-500/30">
                            <Sparkles size={20} className="text-primary-400 animate-pulse" />
                            <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                                Trusted by 10,000+ businesses worldwide
                            </span>
                            <Sparkles size={20} className="text-purple-400 animate-pulse" />
                        </div>

                        {/* Main headline */}
                        <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] tracking-tight">
                            Your Instagram
                            <br />
                            <span className="instagram-gradient bg-clip-text text-transparent">
                                AI Assistant
                            </span>
                            <br />
                            <span className="text-5xl lg:text-6xl text-gray-300">
                                Never Sleeps
                            </span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                            Automate Instagram DMs with AI. Respond instantly to every message,
                            qualify leads, and convert customers — all while you focus on growing your business.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                            <Link
                                href="/auth/signin"
                                className="btn-primary px-10 py-5 text-lg font-bold flex items-center gap-3 shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70"
                            >
                                Start Free Trial
                                <ArrowRight size={24} />
                            </Link>
                            <button className="px-10 py-5 glass-card hover:bg-white/10 rounded-2xl font-bold text-lg transition-all">
                                Watch Demo
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-400" />
                                <span>No credit card</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-400" />
                                <span>100 free msgs/day</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-400" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>

                    {/* Social proof stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-5xl mx-auto">
                        {[
                            { number: '10K+', label: 'Active Users' },
                            { number: '5M+', label: 'Messages Sent' },
                            { number: '98%', label: 'Response Rate' },
                            { number: '4.9/5', label: 'User Rating' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 text-center hover:scale-105 transition-transform">
                                <div className="text-4xl font-black instagram-gradient bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 lg:py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-5xl font-black mb-6">
                            Why Choose <span className="instagram-gradient bg-clip-text text-transparent">InstaAuto</span>?
                        </h2>
                        <p className="text-xl text-gray-400">
                            Everything you need to automate Instagram DMs and convert more leads
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Brain,
                                title: 'AI-Powered Conversations',
                                desc: 'Smart AI understands context and responds naturally to every message',
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: Zap,
                                title: 'Instant Responses',
                                desc: 'Reply in under 2 seconds, 24/7. Never miss a lead again',
                                color: 'from-yellow-500 to-orange-500'
                            },
                            {
                                icon: TrendingUp,
                                title: 'More Conversions',
                                desc: 'Qualify leads automatically and convert up to 3x more customers',
                                color: 'from-green-500 to-emerald-500'
                            },
                            {
                                icon: Shield,
                                title: 'Secure & Compliant',
                                desc: 'Official Meta API integration. Your data is always safe',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: BarChart3,
                                title: 'Advanced Analytics',
                                desc: 'Track every conversation, measure ROI, and optimize performance',
                                color: 'from-indigo-500 to-purple-500'
                            },
                            {
                                icon: Globe,
                                title: 'Multi-Language Support',
                                desc: 'AI responds in your customers\' language automatically',
                                color: 'from-pink-500 to-red-500'
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="glass-card p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={32} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 lg:py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-5xl font-black mb-6">
                            Simple, Transparent <span className="instagram-gradient bg-clip-text text-transparent">Pricing</span>
                        </h2>
                        <p className="text-xl text-gray-400">
                            Start free, upgrade as you grow. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <div className="glass-card p-8 hover:scale-105 transition-all">
                            <div className="text-sm font-bold text-gray-400 mb-2">STARTER</div>
                            <div className="text-5xl font-black mb-2">$0</div>
                            <div className="text-gray-400 mb-6">Forever free</div>

                            <Link href="/auth/signin" className="w-full glass-card hover:bg-white/10 px-6 py-3 rounded-xl font-bold text-center block mb-6">
                                Get Started
                            </Link>

                            <ul className="space-y-3">
                                {['100 messages/day', 'Basic automations', 'Email support', 'Analytics dashboard'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Pro Plan */}
                        <div className="glass-card p-8 border-2 border-primary-500 hover:scale-105 transition-all relative overflow-hidden">
                            <div className="absolute top-4 right-4 px-3 py-1 bg-primary-500 rounded-full text-xs font-bold">
                                POPULAR
                            </div>

                            <div className="text-sm font-bold instagram-gradient bg-clip-text text-transparent mb-2">PRO</div>
                            <div className="text-5xl font-black mb-2">$29</div>
                            <div className="text-gray-400 mb-6">per month</div>

                            <Link href="/auth/signin" className="w-full btn-primary px-6 py-3 rounded-xl font-bold text-center block mb-6">
                                Start Free Trial
                            </Link>

                            <ul className="space-y-3">
                                {['500 messages/day', 'Advanced AI', 'Priority support', 'Custom automations', 'Advanced analytics'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle size={20} className="text-primary-400 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Business Plan */}
                        <div className="glass-card p-8 hover:scale-105 transition-all">
                            <div className="text-sm font-bold text-gray-400 mb-2">BUSINESS</div>
                            <div className="text-5xl font-black mb-2">$99</div>
                            <div className="text-gray-400 mb-6">per month</div>

                            <Link href="/auth/signin" className="w-full glass-card hover:bg-white/10 px-6 py-3 rounded-xl font-bold text-center block mb-6">
                                Get Started
                            </Link>

                            <ul className="space-y-3">
                                {['Unlimited messages', 'White-label option', 'Dedicated support', 'API access', 'Custom integrations'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle size={20} className="text-purple-400 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="glass-card p-12 lg:p-16 border border-primary-500/30 hover:border-primary-500/50 transition-all">
                        <h2 className="text-5xl font-black mb-6">
                            Ready to <span className="instagram-gradient bg-clip-text text-transparent">Automate</span>?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10">
                            Join thousands of businesses using AI to convert more Instagram DMs into customers
                        </p>
                        <Link
                            href="/auth/signin"
                            className="btn-primary px-12 py-6 text-xl font-bold inline-flex items-center gap-3"
                        >
                            Start Free Today
                            <ArrowRight size={24} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl instagram-gradient flex items-center justify-center">
                            <Instagram size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-black">InstaAuto</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 InstaAuto. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
