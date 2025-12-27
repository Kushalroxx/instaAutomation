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
    X,
    LogOut
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AutomationsManager } from '@/components/automations-manager'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { SettingsPanel } from '@/components/settings-panel'
import { ConversationsManager } from '@/components/conversations-manager'

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

            {/* Modern Stylish Sidebar/Navbar */}
            <AnimatePresence>
                {(sidebarOpen || isDesktop) && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed left-0 top-0 h-screen w-72 glass-card border-r border-white/10 z-40 lg:translate-x-0 flex flex-col"
                    >
                        {/* Logo Section - Enhanced */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br instagram-gradient flex items-center justify-center shadow-lg">
                                    <Instagram className="text-white" size={26} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">InstaAuto</h1>
                                    <p className="text-xs text-gray-400 font-medium">✨ AI Automation</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation - Modern Design */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {[
                                { id: 'overview', icon: LayoutDashboard, label: 'Overview', color: 'from-blue-500 to-cyan-500' },
                                { id: 'automations', icon: Zap, label: 'Automations', color: 'from-purple-500 to-pink-500' },
                                { id: 'conversations', icon: MessageSquare, label: 'Conversations', color: 'from-green-500 to-emerald-500' },
                                { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'from-orange-500 to-red-500' },
                                { id: 'settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
                            ].map((item) => (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setActiveTab(item.id)
                                        setSidebarOpen(false)
                                    }}
                                    className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${activeTab === item.id
                                            ? 'bg-gradient-to-r ' + item.color + ' shadow-lg'
                                            : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTab === item.id
                                                ? 'bg-white/20'
                                                : 'bg-white/10 group-hover:bg-white/20'
                                            } transition-colors`}>
                                            <item.icon
                                                size={20}
                                                className={activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                                            />
                                        </div>
                                        <span className={`font-semibold ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </motion.button>
                            ))}
                        </nav>

                        {/* User Profile Card - Stylish */}
                        <div className="p-4 border-t border-white/10">
                            <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-300 to-purple-300 flex items-center justify-center shadow-lg">
                                            <span className="text-gray-900 font-bold text-lg">D</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold">Demo User</p>
                                            <p className="text-xs text-gray-400">demo@instaauto.com</p>
                                        </div>
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-medium text-gray-400 hover:text-white">
                                        <LogOut size={14} />
                                        <span>Logout</span>
                                    </button>
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
                {activeTab === 'automations' && <AutomationsManager />}
                {activeTab === 'conversations' && <ConversationsManager />}
                {activeTab === 'analytics' && <AnalyticsDashboard />}
                {activeTab === 'settings' && <SettingsPanel />}
            </main>
        </div>
    )
}

// Helper function to get time-based greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
    if (hour < 21) return { text: 'Good Evening', emoji: '🌆' };
    return { text: 'Good Night', emoji: '🌙' };
}

// Overview Content Component
function OverviewContent() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState(getGreeting());
    const [isMounted, setIsMounted] = useState(false);
    const [todayStats, setTodayStats] = useState({
        messagesProcessed: 0,
        automationsRun: 0,
        conversationsHandled: 0,
    });
    const [recentActivities, setRecentActivities] = useState([
        { action: 'New message received', user: '@sarah_designs', time: '2 min ago', status: 'success', icon: MessageSquare },
        { action: 'AI response sent', user: '@mike_photos', time: '5 min ago', status: 'success', icon: Sparkles },
        { action: 'Automation triggered', user: '@emma_art', time: '12 min ago', status: 'success', icon: Zap },
        { action: 'Message processed', user: '@john_dev', time: '15 min ago', status: 'success', icon: CheckCircle2 },
        { action: 'New conversation started', user: '@lisa_creative', time: '23 min ago', status: 'success', icon: MessageSquare },
        { action: 'AI reply generated', user: '@david_brand', time: '34 min ago', status: 'success', icon: Sparkles },
    ]);

    // Dynamic theme colors based on time of day
    const [themeColor, setThemeColor] = useState({
        primary: 'text-primary-400',
        gradient: 'from-purple-200/20 to-pink-200/20',
        statusColor: 'bg-green-500',
    });

    // Mount detection to prevent hydration errors
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Dynamic color changes based on time of day
    useEffect(() => {
        const updateThemeColors = () => {
            const hour = new Date().getHours();

            if (hour >= 6 && hour < 12) {
                // Morning - Cool blues
                setThemeColor({
                    primary: 'text-sky-400',
                    gradient: 'from-sky-200/20 to-blue-200/20',
                    statusColor: 'bg-sky-500',
                });
            } else if (hour >= 12 && hour < 18) {
                // Afternoon - Warm oranges/yellows
                setThemeColor({
                    primary: 'text-amber-400',
                    gradient: 'from-amber-200/20 to-orange-200/20',
                    statusColor: 'bg-amber-500',
                });
            } else if (hour >= 18 && hour < 22) {
                // Evening - Purple/Pink
                setThemeColor({
                    primary: 'text-purple-400',
                    gradient: 'from-purple-200/20 to-pink-200/20',
                    statusColor: 'bg-purple-500',
                });
            } else {
                // Night - Deep blues
                setThemeColor({
                    primary: 'text-indigo-400',
                    gradient: 'from-indigo-200/20 to-blue-200/20',
                    statusColor: 'bg-indigo-500',
                });
            }
        };

        updateThemeColors();
        const interval = setInterval(updateThemeColors, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // Real-time clock update
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            setGreeting(getGreeting());
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, []);

    // Auto-refresh data every 30 seconds
    useEffect(() => {
        const refreshData = async () => {
            // TODO: Fetch real data from API
            // For now, simulate increasing numbers
            setTodayStats(prev => ({
                messagesProcessed: prev.messagesProcessed + Math.floor(Math.random() * 3),
                automationsRun: prev.automationsRun + Math.floor(Math.random() * 2),
                conversationsHandled: prev.conversationsHandled + Math.floor(Math.random() * 2),
            }));
        };

        const interval = setInterval(refreshData, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, []);

    // Real-time activity updates every 5 seconds
    useEffect(() => {
        const updateActivities = () => {
            // TODO: Fetch real activities from API
            // For now, simulate new activity
            const newActivity = {
                action: 'New activity detected',
                user: `@user_${Math.floor(Math.random() * 1000)}`,
                time: 'just now',
                status: 'success' as const,
                icon: Activity,
            };

            setRecentActivities(prev => [newActivity, ...prev.slice(0, 5)]);
        };

        const interval = setInterval(updateActivities, 5000); // 5 seconds for instant updates
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="space-y-6">
            {/* Welcome Banner - Dynamic Greeting */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden"
            >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${themeColor.gradient} rounded-full blur-3xl -mr-32 -mt-32`} />
                <div className="relative z-10">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                {greeting.text}, Demo User! {greeting.emoji}
                            </h2>
                            <p className="text-gray-400 text-lg mb-3">Here's what's happening with your Instagram automation today</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                {isMounted && (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                                <div className={`w-2 h-2 rounded-full ${themeColor.statusColor} animate-pulse`} />
                                <span className="text-green-400 font-medium">All Systems Active</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Activity size={16} className="text-blue-400" />
                                <span className="text-blue-400 font-medium">Real-time Monitoring</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Today's Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-2xl border-l-4 border-primary-400"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles size={20} className={themeColor.primary} />
                        Today's Activity Summary
                    </h3>
                    <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                        Live • Auto-refreshes every 30s
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <MessageSquare className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-400">{todayStats.messagesProcessed}</p>
                            <p className="text-xs text-gray-400">Messages Today</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Zap className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-400">{todayStats.automationsRun}</p>
                            <p className="text-xs text-gray-400">Automations Run</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Users className="text-green-400" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-400">{todayStats.conversationsHandled}</p>
                            <p className="text-xs text-gray-400">Conversations</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions - Featured */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1"
                >
                    <div className="glass-card p-6 rounded-2xl h-full">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles size={24} className={themeColor.primary} />
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-purple-200 to-pink-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-900/20 flex items-center justify-center">
                                            <Zap className="text-gray-900" size={20} />
                                        </div>
                                        <span className="font-bold text-gray-900">New Automation</span>
                                    </div>
                                    <span className="text-gray-900/60">→</span>
                                </div>
                            </button>

                            <button className="w-full glass-card p-4 hover:bg-white/10 transition-all rounded-xl flex items-center justify-between group hover:scale-105 duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                        <Instagram className="text-primary-400" size={20} />
                                    </div>
                                    <span className="font-semibold">Connect Account</span>
                                </div>
                                <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
                            </button>

                            <button className="w-full glass-card p-4 hover:bg-white/10 transition-all rounded-xl flex items-center justify-between group hover:scale-105 duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                        <BarChart3 className="text-primary-400" size={20} />
                                    </div>
                                    <span className="font-semibold">View Analytics</span>
                                </div>
                                <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
                            </button>

                            <button className="w-full glass-card p-4 hover:bg-white/10 transition-all rounded-xl flex items-center justify-between group hover:scale-105 duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                        <MessageSquare className="text-primary-400" size={20} />
                                    </div>
                                    <span className="font-semibold">Conversations</span>
                                </div>
                                <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
                            </button>
                        </div>

                        {/* Help Section */}
                        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <Sparkles size={16} className="text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Getting Started</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Create your first automation to start engaging with your audience automatically!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Activity - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2"
                >
                    <div className="glass-card p-6 rounded-2xl h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Activity size={24} className={themeColor.primary} />
                                Recent Activity
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs text-gray-400 px-3 py-1 rounded-full bg-white/5">
                                    Live Updates Every 5s
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {recentActivities.map((activity, i) => (
                                <motion.div
                                    key={`${activity.user}-${i}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 group"
                                >
                                    <div className={`w-10 h-10 rounded-xl ${activity.status === 'success'
                                        ? 'bg-green-500/10 border border-green-500/20'
                                        : 'bg-red-500/10 border border-red-500/20'
                                        } flex items-center justify-center flex-shrink-0`}>
                                        {activity.status === 'success' ? (
                                            <CheckCircle2 size={18} className="text-green-400" />
                                        ) : (
                                            <XCircle size={18} className="text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold mb-0.5 group-hover:text-white transition-colors">{activity.action}</p>
                                        <p className="text-xs text-gray-400">{activity.user}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">{activity.time}</span>
                                        <Clock size={14} className="text-gray-600" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
    )
}
