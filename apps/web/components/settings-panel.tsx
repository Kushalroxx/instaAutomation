'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Instagram,
    User,
    Bot,
    CreditCard,
    Settings as SettingsIcon,
    Plus,
    CheckCircle,
    XCircle,
    Loader,
} from 'lucide-react';

interface InstagramAccount {
    id: string;
    username: string;
    profilePictureUrl: string;
    isActive: boolean;
    webhookSubscribed: boolean;
    lastSyncAt: string;
}

export function SettingsPanel() {
    const [activeSection, setActiveSection] = useState('instagram');
    const [igAccounts, setIgAccounts] = useState<InstagramAccount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInstagramAccounts();
    }, []);

    const fetchInstagramAccounts = async () => {
        try {
            const res = await fetch('/api/instagram/connect');
            const data = await res.json();
            if (data.accounts) {
                setIgAccounts(data.accounts);
            }
        } catch (error) {
            console.error('Error fetching Instagram accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        { id: 'instagram', label: 'Instagram', icon: Instagram },
        { id: 'ai', label: 'AI Configuration', icon: Bot },
        { id: 'account', label: 'Account', icon: User },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    return (
        <div className="space-y-6">
            {/* Section Tabs */}
            <div className="flex gap-2 overflow-x-auto">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${activeSection === section.id
                                ? 'bg-primary-600 text-white shadow-glow'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <section.icon size={18} />
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {activeSection === 'instagram' && (
                    <InstagramSettings
                        accounts={igAccounts}
                        loading={loading}
                        onRefresh={fetchInstagramAccounts}
                    />
                )}
                {activeSection === 'ai' && <AISettings />}
                {activeSection === 'account' && <AccountSettings />}
                {activeSection === 'billing' && <BillingSettings />}
            </motion.div>
        </div>
    );
}

function InstagramSettings({
    accounts,
    loading,
    onRefresh,
}: {
    accounts: InstagramAccount[];
    loading: boolean;
    onRefresh: () => void;
}) {
    const [connecting, setConnecting] = useState(false);

    const handleConnectInstagram = () => {
        alert(
            'To connect your Instagram account, you need to:\n\n1. Create a Facebook Page\n2. Convert your Instagram to a Business Account\n3. Link it to your Facebook Page\n4. Get a Meta App ID and Secret\n5. Complete OAuth flow\n\nFor now, you can test the UI with demo data.'
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-primary-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Connected Instagram Accounts</h3>
                        <p className="text-sm text-gray-400">
                            Manage your Instagram Business accounts
                        </p>
                    </div>
                    <button
                        onClick={handleConnectInstagram}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Connect Account
                    </button>
                </div>

                {accounts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                            <Instagram className="text-primary-500" size={32} />
                        </div>
                        <h4 className="text-lg font-semibold mb-2">No Instagram Accounts Connected</h4>
                        <p className="text-gray-400 mb-6">
                            Connect your Instagram Business account to start automating
                        </p>
                        <button
                            onClick={handleConnectInstagram}
                            className="btn-primary flex items-center gap-2 mx-auto"
                        >
                            <Instagram size={18} />
                            Connect Instagram
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={account.profilePictureUrl || '/placeholder-avatar.png'}
                                        alt={account.username}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-semibold">@{account.username}</h4>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                {account.isActive ? (
                                                    <>
                                                        <CheckCircle size={14} className="text-green-500" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={14} className="text-red-500" />
                                                        Inactive
                                                    </>
                                                )}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                {account.webhookSubscribed ? (
                                                    <>
                                                        <CheckCircle size={14} className="text-green-500" />
                                                        Webhooks Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={14} className="text-yellow-500" />
                                                        Webhooks Inactive
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                                    Disconnect
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Setup Instructions</h3>
                <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex gap-3">
                        <span className="font-bold text-primary-500">1.</span>
                        <p>Create a Facebook Page (if you don't have one)</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="font-bold text-primary-500">2.</span>
                        <p>Convert your Instagram to a Business Account</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="font-bold text-primary-500">3.</span>
                        <p>Link your Instagram to your Facebook Page</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="font-bold text-primary-500">4.</span>
                        <p>
                            Create a Meta/Facebook App at{' '}
                            <a
                                href="https://developers.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-500 hover:underline"
                            >
                                developers.facebook.com
                            </a>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <span className="font-bold text-primary-500">5.</span>
                        <p>Get your App ID and App Secret from Meta</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="font-bold text-primary-500">6.</span>
                        <p>Add them to your .env file and complete the OAuth flow</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AISettings() {
    const [settings, setSettings] = useState({
        apiKey: '',
        model: 'gemini-2.0-flash-exp',
        defaultTone: 'friendly',
        defaultContext: '',
    });

    return (
        <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">AI Configuration</h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Gemini API Key</label>
                    <input
                        type="password"
                        value={settings.apiKey}
                        onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                        placeholder="Enter your Gemini API key"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        Get your API key from{' '}
                        <a
                            href="https://aistudio.google.com/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:underline"
                        >
                            Google AI Studio
                        </a>
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">AI Model</label>
                    <select
                        value={settings.model}
                        onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                    >
                        <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Fastest)</option>
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro (Best Quality)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Default Response Tone</label>
                    <select
                        value={settings.defaultTone}
                        onChange={(e) => setSettings({ ...settings, defaultTone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                    >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="casual">Casual</option>
                        <option value="enthusiastic">Enthusiastic</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Default Business Context</label>
                    <textarea
                        value={settings.defaultContext}
                        onChange={(e) => setSettings({ ...settings, defaultContext: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                        rows={4}
                        placeholder="Describe your business, products, services, pricing, etc. This will be used as default context for all AI replies."
                    />
                </div>

                <button className="btn-primary w-full">Save AI Settings</button>
            </div>
        </div>
    );
}

function AccountSettings() {
    return (
        <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Account Settings</h3>
            <p className="text-gray-400">Account settings panel coming soon...</p>
        </div>
    );
}

function BillingSettings() {
    return (
        <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Billing & Subscription</h3>
            <p className="text-gray-400">Billing panel coming soon...</p>
        </div>
    );
}
