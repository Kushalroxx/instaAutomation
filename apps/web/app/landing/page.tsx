'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Instagram, Sparkles, Zap, BarChart3, Bot, MessageSquare, Clock, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <div className="min-h-screen gradient-bg">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        {/* Logo */}
                        <div className="w-24 h-24 rounded-2xl instagram-gradient flex items-center justify-center mx-auto mb-8">
                            <Instagram className="text-white" size={48} />
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Instagram Automation
                            <br />
                            <span className="gradient-text">Powered by AI</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Automate your Instagram DMs with intelligent AI replies. Save time, engage better, and grow your business 24/7.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link
                                href="/auth/register"
                                className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                            >
                                <Sparkles size={24} />
                                Get Started Free
                            </Link>
                            <Link
                                href="/auth/signin"
                                className="glass-card px-8 py-4 text-lg hover:bg-white/10 transition-all rounded-xl flex items-center justify-center gap-3 hover:scale-105"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Sign In
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-green-500" />
                                <span>Secure & Private</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-primary-500" />
                                <span>AI-Powered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-blue-500" />
                                <span>24/7 Automation</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-xl text-gray-400">Powerful features to automate your Instagram</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Bot,
                                title: 'AI Auto-Replies',
                                description: 'Gemini AI generates contextual, natural replies to your Instagram DMs automatically',
                                color: 'from-purple-200 to-pink-200',
                            },
                            {
                                icon: Zap,
                                title: 'Smart Triggers',
                                description: 'Set up rule-based automation with keyword matching, first messages, and more',
                                color: 'from-sky-200 to-cyan-200',
                            },
                            {
                                icon: MessageSquare,
                                title: 'Conversation Management',
                                description: 'View all your Instagram conversations in one beautiful, organized interface',
                                color: 'from-green-200 to-emerald-200',
                            },
                            {
                                icon: BarChart3,
                                title: 'Advanced Analytics',
                                description: 'Track performance with detailed charts showing success rates and engagement',
                                color: 'from-orange-200 to-red-200',
                            },
                            {
                                icon: TrendingUp,
                                title: 'Performance Insights',
                                description: 'Understand peak hours, automation performance, and optimize your strategy',
                                color: 'from-pink-200 to-rose-200',
                            },
                            {
                                icon: Shield,
                                title: 'Secure & Reliable',
                                description: 'Enterprise-grade security with encrypted data and reliable message delivery',
                                color: 'from-indigo-200 to-purple-200',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-8 hover:border-primary-500/30 transition-all"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                                    <feature.icon className="text-white" size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-xl text-gray-400">Get started in 3 simple steps</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Connect Instagram',
                                description: 'Sign in with Google and connect your Instagram Business account in seconds',
                            },
                            {
                                step: '2',
                                title: 'Create Automations',
                                description: 'Set up AI-powered automation rules with custom triggers and business context',
                            },
                            {
                                step: '3',
                                title: 'Auto-Engage',
                                description: 'Sit back and let AI handle your DMs 24/7 while you track performance',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary-300 flex items-center justify-center text-2xl font-bold mx-auto mb-6 text-gray-900">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-12 text-center"
                    >
                        <h2 className="text-4xl font-bold mb-4">Ready to Automate?</h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands using AI to scale their Instagram engagement
                        </p>
                        <Link
                            href="/auth/register"
                            className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-3 mx-auto hover:scale-105 transition-transform"
                        >
                            <Sparkles size={24} />
                            Start Free Today
                        </Link>
                        <p className="text-sm text-gray-500 mt-6">No credit card required • Free trial included</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
                    <p>© 2024 InstaAuto. Powered by Google Gemini AI.</p>
                </div>
            </footer>
        </div>
    );
}
