'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    TrendingUp,
    MessageSquare,
    Zap,
    Clock,
    DollarSign,
    Activity,
    Target,
} from 'lucide-react';

interface AnalyticsData {
    overview: {
        totalMessages: number;
        successfulMessages: number;
        failedMessages: number;
        successRate: number;
        avgResponseTime: number;
        totalTokens: number;
        totalCost: string;
    };
    dailyStats: Array<{
        date: string;
        messages: number;
        successful: number;
        failed: number;
        avgResponseTime: number;
    }>;
    automationPerformance: Array<{
        name: string;
        triggerType: string;
        triggers: number;
        successRate: number;
    }>;
    hourlyPerformance: Array<{
        hour: number;
        count: number;
    }>;
    triggerTypePerformance: Array<{
        type: string;
        total: number;
        successRate: number;
    }>;
}

export function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(7); // days

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`/api/analytics?days=${timeRange}`);
            const data = await res.json();
            if (data.analytics) {
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="glass-card p-12 text-center">
                <p className="text-gray-400">No analytics data available yet</p>
            </div>
        );
    }

    const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-end gap-2">
                {[7, 14, 30, 90].map((days) => (
                    <button
                        key={days}
                        onClick={() => setTimeRange(days)}
                        className={`px-4 py-2 rounded-xl transition-all ${timeRange === days
                                ? 'bg-primary-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {days}D
                    </button>
                ))}
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Total Messages"
                    value={analytics.overview.totalMessages.toLocaleString()}
                    icon={MessageSquare}
                    color="from-blue-500 to-cyan-500"
                    trend={`${analytics.overview.successRate}% success`}
                />
                <StatsCard
                    label="Success Rate"
                    value={`${analytics.overview.successRate}%`}
                    icon={TrendingUp}
                    color="from-green-500 to-emerald-500"
                    trend={`${analytics.overview.successfulMessages} successful`}
                />
                <StatsCard
                    label="Avg Response Time"
                    value={`${analytics.overview.avgResponseTime}ms`}
                    icon={Clock}
                    color="from-purple-500 to-pink-500"
                    trend="Real-time"
                />
                <StatsCard
                    label="AI Cost"
                    value={`$${analytics.overview.totalCost}`}
                    icon={DollarSign}
                    color="from-orange-500 to-red-500"
                    trend={`${analytics.overview.totalTokens.toLocaleString()} tokens`}
                />
            </div>

            {/* Daily Messages Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-primary-500" />
                    Daily Message Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.dailyStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '12px',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="messages"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Total Messages"
                        />
                        <Line
                            type="monotone"
                            dataKey="successful"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Successful"
                        />
                        <Line
                            type="monotone"
                            dataKey="failed"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Failed"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Automation Performance & Hourly Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Automation Performance */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Zap size={20} className="text-primary-500" />
                        Automation Performance
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.automationPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="triggers" fill="#8b5cf6" name="Trigger Count" />
                            <Bar dataKey="successRate" fill="#10b981" name="Success Rate (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Hourly Performance */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-primary-500" />
                        Peak Activity Hours
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.hourlyPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis
                                dataKey="hour"
                                stroke="#9ca3af"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(hour) => `${hour}:00`}
                            />
                            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                }}
                                labelFormatter={(hour) => `${hour}:00`}
                            />
                            <Bar dataKey="count" fill="#06b6d4" name="Messages" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Trigger Type Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Target size={20} className="text-primary-500" />
                    Trigger Type Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={analytics.triggerTypePerformance}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => entry.type}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="total"
                            >
                                {analytics.triggerTypePerformance.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-3">
                        {analytics.triggerTypePerformance.map((type, index) => (
                            <div
                                key={type.type}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="font-medium capitalize">{type.type.replace('_', ' ')}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">{type.total}</div>
                                    <div className="text-xs text-gray-400">{type.successRate}% success</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function StatsCard({
    label,
    value,
    icon: Icon,
    color,
    trend,
}: {
    label: string;
    value: string;
    icon: any;
    color: string;
    trend: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card stat-card p-6"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                </div>
                <span className="badge badge-success">{trend}</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{value}</h3>
            <p className="text-sm text-gray-400">{label}</p>
        </motion.div>
    );
}
