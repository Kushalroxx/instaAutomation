'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Instagram,
    MessageSquare,
    Sparkles,
    ShoppingBag,
    Users,
    BarChart3,
    ChevronDown,
    ArrowRight,
    CheckCircle,
    Calendar,
    FileText,
    Database,
    CreditCard,
    MapPin,
    Clock
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ExactLandingPage() {
    const [activeDemo, setActiveDemo] = useState('small-business')
    const [isUseCasesOpen, setIsUseCasesOpen] = useState(false)
    const [isExploreOpen, setIsExploreOpen] = useState(false)

    return (
        <div className="min-h-screen bg-white">
            {/* TOP NAVIGATION - Exact Match */}
            <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center transform rotate-45">
                                    <div className="transform -rotate-45 text-white text-sm font-bold">J</div>
                                </div>
                                <span className="text-2xl font-bold text-gray-900">Jotform</span>
                            </div>
                            <span className="text-gray-600 font-medium ml-4">Instagram Agent</span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#benefits" className="text-gray-700 hover:text-purple-600 font-medium border-b-2 border-purple-600 pb-1">Benefits</a>
                            <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium">Features</a>
                            <a href="#templates" className="text-gray-700 hover:text-purple-600 font-medium">Templates</a>

                            <button
                                className="flex items-center gap-1 text-gray-700 hover:text-purple-600 font-medium"
                                onClick={() => setIsUseCasesOpen(!isUseCasesOpen)}
                            >
                                Use Cases
                                <ChevronDown size={16} />
                            </button>

                            <button
                                className="flex items-center gap-1 text-gray-700 hover:text-purple-600 font-medium"
                                onClick={() => setIsExploreOpen(!isExploreOpen)}
                            >
                                Explore
                                <ChevronDown size={16} />
                            </button>

                            <a href="#demo" className="text-gray-700 hover:text-purple-600 font-medium">Demo</a>
                            <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium">Pricing</a>
                        </div>

                        {/* CTA Button */}
                        <Link href="/dashboard">
                            <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all">
                                Get Started Now — It's Free
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION - Exact Match */}
            <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-pink-50/30 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-pink-600 font-bold text-lg mb-4">Jotform Instagram Agent</p>

                            <h1 className="text-6xl font-bold text-[#1a1f3a] mb-6 leading-tight">
                                AI Replies<br />
                                <span className="text-pink-600">for Your Instagram</span>
                            </h1>

                            <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                                Capture every DM, reply instantly, and engage<br />
                                with followers without lifting a finger.
                            </p>

                            <div className="flex gap-4 mb-4">
                                <Link href="/dashboard">
                                    <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg">
                                        Create Instagram Agent
                                    </button>
                                </Link>
                                <button className="px-8 py-4 bg-white border-2 border-gray-300 hover:border-purple-600 text-gray-900 rounded-lg font-bold text-lg transition-all">
                                    See Demo
                                </button>
                            </div>

                            <p className="text-purple-600 font-medium text-sm">— it's free!</p>
                        </motion.div>

                        {/* Right - Mockup with Chat Bubble */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Background circles */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-40 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-40 blur-3xl" />

                            {/* Floating Chat Bubble */}
                            <div className="absolute -left-12 top-20 bg-white rounded-3xl shadow-2xl p-5 w-96 z-10 border border-gray-100">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-[#1a1f3a] font-medium">Hi! Do you have a bouquet for birthdays?</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5 text-white">
                                    <p className="mb-4">Yes Amy! 🎉 Our best-sellers are the Elegant Blooms and Sunny Birthday Mix.</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded-xl p-3">
                                            <div className="w-full h-24 bg-pink-200 rounded-lg mb-2 flex items-center justify-center">
                                                <div className="text-pink-600 text-4xl">🌸</div>
                                            </div>
                                            <p className="text-xs text-gray-900 font-semibold mb-2">Elegant Blooms</p>
                                            <button className="w-full px-3 py-2 bg-purple-600 text-white text-xs rounded-lg font-semibold">
                                                Shop Now
                                            </button>
                                        </div>

                                        <div className="bg-white rounded-xl p-3">
                                            <div className="w-full h-24 bg-yellow-200 rounded-lg mb-2 flex items-center justify-center">
                                                <div className="text-yellow-600 text-4xl">🌻</div>
                                            </div>
                                            <p className="text-xs text-gray-900 font-semibold mb-2">Sunny Birthday</p>
                                            <button className="w-full px-3 py-2 bg-purple-600 text-white text-xs rounded-lg font-semibold">
                                                Shop Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Woman with Instagram Photo */}
                            <div className="relative mt-12">
                                <div className="w-full aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl flex items-center justify-center relative overflow-hidden">
                                    {/* Instagram Badge */}
                                    <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl transform rotate-12">
                                        <Instagram className="text-white" size={40} />
                                    </div>

                                    {/* Placeholder for woman image */}
                                    <div className="text-gray-300 text-center">
                                        <Users size={120} />
                                        <p className="mt-4 text-sm">Woman with phone</p>
                                    </div>

                                    {/* Meta Business Partner Badge */}
                                    <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">M</span>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-900">Meta Business Partner</span>
                                    </div>
                                </div>

                                {/* Floating Avatar */}
                                <div className="absolute bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 border-4 border-white shadow-xl" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION - Dark Navy - Exact Match */}
            <section id="features" className="py-16 px-6 bg-[#1a1f3a]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Take <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Your Instagram</span>, upgraded.
                        </h2>
                        <p className="text-gray-300 text-lg">
                            From replying to comments and answering DMs to selling products and taking payments, Jotform's Instagram<br />
                            Agent does the work so you can focus on what you love.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Card 1 - Automate DMs - PINK */}
                        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white mb-3">
                                    Automate your <span className="text-yellow-300">DMs</span>
                                </h3>
                                <p className="text-white/95 text-lg mb-6 leading-relaxed">
                                    Never miss a message again — automatically collect, organize,<br />
                                    and respond to DMs from customers, clients, or fans.
                                </p>
                            </div>

                            {/* Mockup */}
                            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/20 rounded-xl p-4 aspect-square flex items-center justify-center">
                                        <MessageSquare size={60} className="text-white/60" />
                                    </div>
                                    <div className="bg-white/20 rounded-xl p-4 aspect-square flex items-center justify-center">
                                        <Users size={60} className="text-white/60" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - Reply to Comments - PURPLE */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white mb-3">
                                    Reply to <span className="text-yellow-300">comments</span>
                                </h3>
                                <p className="text-white/95 text-lg mb-6 leading-relaxed">
                                    Engage your audience with instant AI replies — all without<br />
                                    needing to lift a finger.
                                </p>
                            </div>

                            {/* Mockup */}
                            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6">
                                <div className="space-y-3">
                                    <div className="bg-white/20 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-white/30" />
                                            <div className="h-2 w-20 bg-white/30 rounded" />
                                        </div>
                                        <div className="h-2 w-full bg-white/30 rounded" />
                                    </div>
                                    <div className="bg-purple-500 rounded-xl p-3">
                                        <div className="h-2 w-3/4 bg-white/50 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Card 3 - Connect Tools - BLUE */}
                        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white mb-3">
                                    Connect with your <span className="text-yellow-300">tools</span>
                                </h3>
                                <p className="text-white/95 text-lg mb-6 leading-relaxed">
                                    Connect your agent with platforms like Shopify, Calendly,<br />
                                    Google Sheets, and more to streamline your actions.
                                </p>
                            </div>

                            {/* Integration Icons */}
                            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6">
                                <div className="grid grid-cols-4 gap-3">
                                    {[...Array(12)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl p-3 aspect-square flex items-center justify-center">
                                            <div className="w-8 h-8 bg-blue-200 rounded" />
                                        </div>
                                    ))}
                                    <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-xl p-3 aspect-square flex items-center justify-center">
                                        <Instagram className="text-white" size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 - Sell Products - GREEN */}
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white mb-3">
                                    <span className="text-yellow-300">Sell</span> products on Instagram
                                </h3>
                                <p className="text-white/95 text-lg mb-6 leading-relaxed">
                                    Showcase products, send purchase links, and guide followers<br />
                                    through checkout — all without leaving Instagram.
                                </p>
                            </div>

                            {/* Product Cards */}
                            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6">
                                <div className="grid grid-cols-3 gap-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl p-3">
                                            <div className="aspect-square bg-green-200 rounded-lg mb-2" />
                                            <div className="h-2 bg-green-200 rounded mb-1" />
                                            <div className="h-1 w-2/3 bg-green-200 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 5 - Generate Leads - YELLOW/ORANGE */}
                    <div className="bg-gradient-to-br from-orange-400 to-yellow-400 rounded-3xl p-8 relative overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-[#1a1f3a] mb-3">
                                    Generate <span className="text-white">leads</span>
                                </h3>
                                <p className="text-[#1a1f3a]/90 text-lg leading-relaxed">
                                    Provide 24-7 availability with an agent that works around the clock to answer questions, share info, and close leads.
                                </p>
                            </div>

                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                                <div className="bg-white rounded-xl p-4 shadow-xl mb-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-200" />
                                        <div className="flex-1">
                                            <div className="h-3 bg-orange-200 rounded w-1/2 mb-2" />
                                            <div className="h-2 bg-orange-100 rounded w-3/4" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-purple-600 rounded-xl p-4 text-white">
                                    <div className="h-3 bg-white/30 rounded mb-2" />
                                    <div className="h-2 bg-white/20 rounded w-2/3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT CREATOR SECTION - Beige Background */}
            <section className="py-20 px-6 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                    <MessageSquare className="text-white" size={28} />
                                </div>
                                <h2 className="text-4xl font-bold text-[#1a1f3a]">Content Creator</h2>
                            </div>

                            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                                Engage fans, share links, and send offers automatically in DMs.
                            </p>

                            <div className="space-y-4">
                                <p className="text-[#1a1f3a] font-bold mb-4">View examples</p>

                                {[
                                    'Share Links',
                                    'Engage with Your Followers',
                                    'Deliver Freebies',
                                    'Grow Your Community'
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`border-2 rounded-2xl px-6 py-4 font-semibold text-[#1a1f3a] transition-all cursor-pointer ${i === 0
                                                ? 'border-yellow-400 bg-yellow-50'
                                                : 'border-gray-200 bg-white hover:border-purple-400 hover:bg-purple-50'
                                            }`}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Phone Mockup */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl">
                                <div className="w-80 mx-auto">
                                    {/* iPhone Frame */}
                                    <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl relative">
                                        {/* Notch */}
                                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10" />

                                        {/* Screen */}
                                        <div className="bg-gray-800 rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                                            <div className="p-6 flex flex-col h-full justify-center">
                                                <div className="bg-gray-700 rounded-2xl p-4 mb-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-600" />
                                                        <p className="text-white text-sm">When's the new vlog coming out?</p>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4">
                                                    <p className="text-white text-sm mb-3">Vlog is out on Sunday at 6PM! 🎬</p>
                                                    <button className="w-full px-4 py-3 bg-purple-700 text-white rounded-xl font-semibold">
                                                        Subscribe Here
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DEMO SECTION */}
            <section id="demo" className="py-20 px-6 bg-[#1a1f3a]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-bold text-white mb-4">
                            <span className="text-yellow-400">Demo</span> Jotform Instagram Agent in action
                        </h2>
                        <p className="text-xl text-gray-300">From auto-replies to smart sales, it's all here.</p>
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {[
                            { id: 'small-business', label: '🛍️ Small Business', bg: 'bg-blue-600' },
                            { id: 'content-creator', label: '🎬 Content Creator', bg: 'bg-purple-600' },
                            { id: 'education', label: '🎓 Education Organizations', bg: 'bg-pink-600' },
                            { id: 'health', label: '🏥 Health Organizations', bg: 'bg-green-600' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveDemo(tab.id)}
                                className={`px-8 py-3 rounded-full font-semibold transition-all ${activeDemo === tab.id
                                        ? `${tab.bg} text-white shadow-lg`
                                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Demo Content */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-6xl">🛍️</div>
                                    <h3 className="text-4xl font-bold text-[#1a1f3a]">Small Business</h3>
                                </div>

                                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                                    Sell smarter on Instagram—automate replies, product links, and purchases.
                                </p>

                                <div className="space-y-4">
                                    <p className="text-[#1a1f3a] font-bold mb-4">View examples</p>

                                    {[
                                        'Answer FAQs',
                                        'Recommend Products',
                                        'Show Location & Store Hours',
                                        'Handle Order Inquiries'
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className={`border-2 rounded-2xl px-6 py-4 font-semibold text-[#1a1f3a] transition-all cursor-pointer ${i === 0
                                                    ? 'border-yellow-400 bg-yellow-50'
                                                    : 'border-gray-200 bg-white hover:border-purple-400'
                                                }`}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Phone Mockup */}
                            <div className="relative">
                                <div className="bg-white rounded-3xl p-6 shadow-2xl">
                                    <div className="w-80 mx-auto">
                                        <div className="bg-gray-900 rounded-[3rem] p-3">
                                            <div className="bg-gray-800 rounded-[2.5rem] aspect-[9/19] flex items-center justify-center p-6">
                                                <div className="w-full space-y-4">
                                                    <div className="bg-gray-700 rounded-2xl p-4">
                                                        <p className="text-white text-sm">Do you ship internationally?</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-4">
                                                        <p className="text-white text-sm">Yes we do! 🌍 We ship to over 30 countries.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS - Light Purple Background */}
            <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-[#1a1f3a] mb-2">
                            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Instagram Agent</span> works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="bg-white rounded-3xl p-8 shadow-lg h-full">
                                <div className="mb-6">
                                    <span className="text-6xl font-bold text-gray-100">1</span>
                                </div>

                                <h3 className="text-2xl font-bold text-[#1a1f3a] mb-4">Connect your Instagram</h3>
                                <p className="text-gray-700 text-lg mb-6">
                                    Start by connecting your account — it's quick and safe.
                                </p>

                                <div className="bg-purple-50 rounded-2xl p-6 flex items-center justify-center gap-8">
                                    <Instagram size={48} className="text-pink-600" />
                                    <div className="text-4xl">+</div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold">J</span>
                                    </div>
                                    <ArrowRight size={32} className="text-purple-600" />
                                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold">
                                        Log in with Instagram
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="bg-white rounded-3xl p-8 shadow-lg h-full">
                                <div className="mb-6">
                                    <span className="text-6xl font-bold text-gray-100">2</span>
                                </div>

                                <h3 className="text-2xl font-bold text-[#1a1f3a] mb-4">Train with your account</h3>
                                <p className="text-gray-700 text-lg mb-6">
                                    Your agent learns from your DMs, bio, and posts.
                                </p>

                                <div className="bg-purple-50 rounded-2xl p-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-200" />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-[#1a1f3a]">Learning from your Instagram</p>
                                                <div className="w-full bg-purple-200 rounded-full h-2 mt-1">
                                                    <div className="bg-purple-600 h-2 rounded-full w-2/3" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pl-11 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                <span className="text-sm text-gray-700">Reading your bio</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                <span className="text-sm text-gray-700">Analyzing content from your posts: 10/10</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin" />
                                                <span className="text-sm text-gray-500">Learning from your DMs: 35/50</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="bg-white rounded-3xl p-8 shadow-lg h-full">
                                <div className="mb-6">
                                    <span className="text-6xl font-bold text-gray-100">3</span>
                                </div>

                                <h3 className="text-2xl font-bold text-[#1a1f3a] mb-4">Reply Automatically</h3>
                                <p className="text-gray-700 text-lg mb-6">
                                    Your agent replies to DMs, comments, and inquiries — just like you would.
                                </p>

                                <div className="bg-purple-50 rounded-2xl p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-pink-600 font-semibold">
                                            <MessageSquare size={20} />
                                            <span className="text-sm">DMs</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-pink-600 font-semibold">
                                            <MessageSquare size={20} />
                                            <span className="text-sm">Comments</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-pink-600 font-semibold">
                                            <Sparkles size={20} />
                                            <span className="text-sm">Stories</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-orange-600 font-semibold">
                                            <span className="text-sm">@</span>
                                            <span className="text-sm">Mentions</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 bg-gray-900 rounded-2xl p-4">
                                        <div className="bg-purple-600 rounded-xl p-3">
                                            <p className="text-white text-xs">Hi! I'd be better to buy tickets here 🎫</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-20 px-6 bg-gradient-to-br from-purple-600 to-pink-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        Ready to automate your Instagram?
                    </h2>
                    <p className="text-xl text-white/90 mb-10">
                        Start capturing DMs, engaging followers, and growing your business on autopilot.
                    </p>
                    <Link href="/dashboard">
                        <button className="px-12 py-5 bg-white text-purple-600 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl inline-flex items-center gap-3">
                            Get Started Now — It's Free
                            <ArrowRight size={24} />
                        </button>
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 px-6 bg-[#1a1f3a]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center transform rotate-45">
                                <div className="transform -rotate-45 text-white font-bold">J</div>
                            </div>
                            <span className="text-2xl font-bold text-white">Jotform</span>
                        </div>
                        <p className="text-gray-400">© 2024 InstaAuto. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
