'use client'

import { useState, useEffect } from 'react'
import {
    LayoutDashboard,
    Zap,
    MessageSquare,
    BarChart3,
    Settings,
    Instagram,
    TrendingUp,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    Activity,
    Sparkles,
    Menu,
    X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    return (
        <div className="min-h-screen gradient-bg">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 glass-card"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <AnimatePresence>
                {(sidebarOpen || isDesktop) && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-white/10 p-6 z-40 lg:translate-x-0"
                    >
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl instagram-gradient flex items-center justify-center">
                                <Instagram className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">InstaAuto</h1>
                                <p className="text-xs text-gray-400">AI Automation</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            {[
                                { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                                { id: 'automations', icon: Zap, label: 'Automations' },
                                { id: 'conversations', icon: MessageSquare, label: 'Conversations' },
                                { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                                { id: 'settings', icon: Settings, label: 'Settings' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id)
                                        setSidebarOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                        ? 'bg-primary-600 text-white shadow-glow'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* User Profile */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="glass-card p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                    <span className="text-sm font-bold">JD</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">John Doe</p>
                                    <p className="text-xs text-gray-400">Pro Plan</p>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="lg:ml-64 p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'automations' && 'Automation Rules'}
                        {activeTab === 'conversations' && 'Conversations'}
                        {activeTab === 'analytics' && 'Analytics & Insights'}
                        {activeTab === 'settings' && 'Settings'}
                    </h2>
                    <p className="text-gray-400">
                        {activeTab === 'overview' && 'Monitor your Instagram automation performance'}
                        {activeTab === 'automations' && 'Manage your AI-powered automation rules'}
                        {activeTab === 'conversations' && 'View and manage all conversations'}
                        {activeTab === 'analytics' && 'Deep dive into your automation metrics'}
                        {activeTab === 'settings' && 'Configure your account and preferences'}
                    </p>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'overview' && <OverviewContent />}
                {activeTab === 'automations' && <AutomationsContent />}
                {activeTab === 'conversations' && <ConversationsContent />}
                {activeTab === 'analytics' && <AnalyticsContent />}
                {activeTab === 'settings' && <SettingsContent />}
            </main>
        </div>
    )
}

// Overview Content Component
function OverviewContent() {
    const stats = [
        {
            label: 'Messages Processed',
            value: '1,234',
            change: '+12%',
            icon: MessageSquare,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            label: 'Active Automations',
            value: '8',
            change: '+2',
            icon: Zap,
            color: 'from-purple-500 to-pink-500'
        },
        {
            label: 'Response Rate',
            value: '98.5%',
            change: '+5%',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500'
        },
        {
            label: 'Active Users',
            value: '456',
            change: '+23',
            icon: Users,
            color: 'from-orange-500 to-red-500'
        },
    ]

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card stat-card p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                            <span className="badge badge-success">{stat.change}</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-primary-500" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {[
                            { action: 'New message received', user: '@sarah_designs', time: '2 min ago', status: 'success' },
                            { action: 'AI response sent', user: '@mike_photos', time: '5 min ago', status: 'success' },
                            { action: 'Automation triggered', user: '@emma_art', time: '12 min ago', status: 'success' },
                            { action: 'Failed to send', user: '@john_dev', time: '15 min ago', status: 'error' },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                {activity.status === 'success' ? (
                                    <CheckCircle2 size={20} className="text-green-500" />
                                ) : (
                                    <XCircle size={20} className="text-red-500" />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{activity.action}</p>
                                    <p className="text-xs text-gray-400">{activity.user}</p>
                                </div>
                                <span className="text-xs text-gray-500">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-primary-500" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full btn-primary flex items-center justify-center gap-2">
                            <Zap size={18} />
                            Create New Automation
                        </button>
                        <button className="w-full glass-card p-3 hover:bg-white/10 transition-colors rounded-xl flex items-center justify-center gap-2">
                            <Instagram size={18} />
                            Connect Instagram Account
                        </button>
                        <button className="w-full glass-card p-3 hover:bg-white/10 transition-colors rounded-xl flex items-center justify-center gap-2">
                            <BarChart3 size={18} />
                            View Full Analytics
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

// Automations Content Component
function AutomationsContent() {
    const automations = [
        { id: 1, name: 'Welcome New Followers', trigger: 'First Message', status: 'active', triggers: 234 },
        { id: 2, name: 'Product Inquiry Response', trigger: 'Keyword: "price"', status: 'active', triggers: 156 },
        { id: 3, name: 'Lead Qualification', trigger: 'Keyword: "interested"', status: 'active', triggers: 89 },
        { id: 4, name: 'Support Ticket Creation', trigger: 'Keyword: "help"', status: 'paused', triggers: 45 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-400">{automations.length} active automations</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Zap size={18} />
                    New Automation
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {automations.map((auto, index) => (
                    <motion.div
                        key={auto.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 hover:border-primary-500/30"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h4 className="text-lg font-semibold mb-1">{auto.name}</h4>
                                <p className="text-sm text-gray-400">{auto.trigger}</p>
                            </div>
                            <span className={`badge ${auto.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                {auto.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                                <Activity size={16} />
                                {auto.triggers} triggers
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={16} />
                                Last triggered 2h ago
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// Conversations Content Component
function ConversationsContent() {
    const conversations = [
        { id: 1, user: 'Sarah Johnson', username: '@sarah_designs', lastMessage: 'Thanks for the quick response!', time: '2m ago', unread: 0 },
        { id: 2, user: 'Mike Chen', username: '@mike_photos', lastMessage: 'What are your pricing options?', time: '15m ago', unread: 2 },
        { id: 3, user: 'Emma Wilson', username: '@emma_art', lastMessage: 'I\'m interested in your services', time: '1h ago', unread: 1 },
        { id: 4, user: 'John Davis', username: '@john_dev', lastMessage: 'Can you help me with...', time: '3h ago', unread: 0 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-gray-400">{conversations.length} conversations</p>
                <button className="glass-card px-4 py-2 rounded-xl hover:bg-white/10">
                    Filter
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {conversations.map((conv, index) => (
                    <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 hover:border-primary-500/30 cursor-pointer"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold">{conv.user.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <div>
                                        <h4 className="font-semibold">{conv.user}</h4>
                                        <p className="text-sm text-gray-400">{conv.username}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500">{conv.time}</span>
                                        {conv.unread > 0 && (
                                            <div className="mt-1 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold">
                                                {conv.unread}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// Analytics Content Component
function AnalyticsContent() {
    return (
        <div className="space-y-6">
            <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4">Coming Soon</h3>
                <p className="text-gray-400">Advanced analytics and charts will be available here.</p>
            </div>
        </div>
    )
}

// Settings Content Component
function SettingsContent() {
    return (
        <div className="space-y-6">
            <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4">Account Settings</h3>
                <p className="text-gray-400">Settings panel will be available here.</p>
            </div>
        </div>
    )
}
