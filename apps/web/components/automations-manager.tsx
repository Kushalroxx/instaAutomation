'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Plus,
    Edit,
    Trash2,
    Power,
    PowerOff,
    Activity,
    Clock,
    MessageSquare,
    Sparkles,
    X,
    Check,
} from 'lucide-react';

interface Automation {
    id: string;
    name: string;
    description?: string;
    trigger: string;
    status: string;
    triggers: number;
    triggerType: string;
    actionType: string;
    isActive: boolean;
}

export function AutomationsManager() {
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);

    useEffect(() => {
        fetchAutomations();
    }, []);

    const fetchAutomations = async () => {
        try {
            const res = await fetch('/api/automations');
            const data = await res.json();
            if (data.automations) {
                setAutomations(data.automations);
            }
        } catch (error) {
            console.error('Error fetching automations:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAutomation = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/automations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            fetchAutomations();
        } catch (error) {
            console.error('Error toggling automation:', error);
        }
    };

    const deleteAutomation = async (id: string) => {
        if (!confirm('Are you sure you want to delete this automation?')) return;

        try {
            await fetch(`/api/automations/${id}`, { method: 'DELETE' });
            fetchAutomations();
        } catch (error) {
            console.error('Error deleting automation:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-400">{automations.length} active automations</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Automation
                </button>
            </div>

            {/* Automations Grid */}
            {automations.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 text-center"
                >
                    <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                        <Zap className="text-primary-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Automations Yet</h3>
                    <p className="text-gray-400 mb-6">
                        Create your first automation to start auto-replying to Instagram messages
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2 mx-auto"
                    >
                        <Sparkles size={18} />
                        Create First Automation
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {automations.map((auto, index) => (
                        <motion.div
                            key={auto.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-6 hover:border-primary-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-semibold">{auto.name}</h4>
                                        <span
                                            className={`badge ${auto.isActive ? 'badge-success' : 'badge-warning'
                                                }`}
                                        >
                                            {auto.isActive ? 'Active' : 'Paused'}
                                        </span>
                                    </div>
                                    {auto.description && (
                                        <p className="text-sm text-gray-400 mb-3">{auto.description}</p>
                                    )}
                                    <p className="text-sm text-gray-400">{auto.trigger}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleAutomation(auto.id, auto.isActive)}
                                        className={`p-2 rounded-lg transition-all ${auto.isActive
                                            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                            : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                                            }`}
                                        title={auto.isActive ? 'Pause' : 'Activate'}
                                    >
                                        {auto.isActive ? <Power size={18} /> : <PowerOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => setSelectedAutomation(auto)}
                                        className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteAutomation(auto.id)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                <span className="flex items-center gap-2">
                                    <Activity size={16} />
                                    {auto.triggers} triggers
                                </span>
                                <span className="flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    {auto.triggerType}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Sparkles size={16} />
                                    {auto.actionType.replace('_', ' ')}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(showCreateModal || selectedAutomation) && (
                    <AutomationModal
                        automation={selectedAutomation}
                        onClose={() => {
                            setShowCreateModal(false);
                            setSelectedAutomation(null);
                        }}
                        onSave={() => {
                            fetchAutomations();
                            setShowCreateModal(false);
                            setSelectedAutomation(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Automation Creation/Edit Modal Component
function AutomationModal({
    automation,
    onClose,
    onSave,
}: {
    automation?: Automation | null;
    onClose: () => void;
    onSave: () => void;
}) {
    const [formData, setFormData] = useState({
        name: automation?.name || '',
        description: automation?.description || '',
        triggerType: automation?.triggerType || 'keyword',
        keyword: '',
        actionType: automation?.actionType || 'ai_reply',
        businessContext: '',
        tone: 'friendly',
    });
    const [saving, setSaving] = useState(false);
    const [igAccounts, setIgAccounts] = useState<any[]>([]);
    const [selectedAccount, setSelectedAccount] = useState('');

    useEffect(() => {
        fetchInstagramAccounts();
    }, []);

    const fetchInstagramAccounts = async () => {
        try {
            const res = await fetch('/api/instagram/connect');
            const data = await res.json();
            if (data.accounts) {
                setIgAccounts(data.accounts);
                if (data.accounts.length > 0) {
                    setSelectedAccount(data.accounts[0].id);
                }
            }
        } catch (error) {
            console.error('Error fetching Instagram accounts:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                igAccountId: selectedAccount,
                triggerType: formData.triggerType,
                conditions: { keyword: formData.keyword },
                actionType: formData.actionType,
                actionConfig: {
                    businessContext: formData.businessContext,
                    tone: formData.tone,
                },
            };

            if (automation) {
                await fetch(`/api/automations/${automation.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                await fetch('/api/automations/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            onSave();
        } catch (error) {
            console.error('Error saving automation:', error);
            alert('Failed to save automation');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        {automation ? 'Edit Automation' : 'Create New Automation'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Automation Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                            placeholder="e.g., Welcome Message"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                            placeholder="What does this automation do?"
                            rows={2}
                        />
                    </div>

                    {/* Instagram Account */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Instagram Account</label>
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                            required
                        >
                            {igAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    @{account.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Trigger Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Trigger Type</label>
                        <select
                            value={formData.triggerType}
                            onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                        >
                            <option value="keyword">Keyword Match</option>
                            <option value="first_message">First Message from User</option>
                            <option value="all_messages">All Messages</option>
                            <option value="story_reply">Story Reply</option>
                        </select>
                    </div>

                    {/* Keyword (conditional) */}
                    {formData.triggerType === 'keyword' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Keyword</label>
                            <input
                                type="text"
                                value={formData.keyword}
                                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                                placeholder="e.g., price, info, hello"
                                required
                            />
                        </div>
                    )}

                    {/* Action Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Action</label>
                        <select
                            value={formData.actionType}
                            onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                        >
                            <option value="ai_reply">AI-Generated Reply</option>
                            <option value="save_lead">Save as Lead (No Reply)</option>
                        </select>
                    </div>

                    {/* AI Configuration (conditional) */}
                    {formData.actionType === 'ai_reply' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Business Context</label>
                                <textarea
                                    value={formData.businessContext}
                                    onChange={(e) =>
                                        setFormData({ ...formData, businessContext: e.target.value })
                                    }
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                                    placeholder="Tell the AI about your business, products, pricing, etc."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Response Tone</label>
                                <select
                                    value={formData.tone}
                                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                                >
                                    <option value="professional">Professional</option>
                                    <option value="friendly">Friendly</option>
                                    <option value="casual">Casual</option>
                                    <option value="enthusiastic">Enthusiastic</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 btn-primary flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={18} />
                                    {automation ? 'Update' : 'Create'} Automation
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
