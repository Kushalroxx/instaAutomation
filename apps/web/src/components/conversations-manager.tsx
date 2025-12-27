'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Send,
    Sparkles,
    User,
    Loader,
    RefreshCw,
    X,
    Bot,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
    id: string;
    user: string;
    username: string;
    lastMessage: string;
    time: string;
    unread: number;
    messageCount: number;
}

interface Message {
    from: 'user' | 'assistant';
    content: string;
    timestamp: string;
    automationId?: string;
}

export function ConversationsManager() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations');
            const data = await res.json();
            if (data.conversations) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId: string) => {
        setMessagesLoading(true);
        try {
            const res = await fetch(`/api/conversations/${conversationId}`);
            const data = await res.json();
            if (data.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setMessagesLoading(false);
        }
    };

    const generateAIReply = async () => {
        if (messages.length === 0) return;

        setGeneratingAI(true);
        try {
            const lastUserMessage = messages
                .filter((m) => m.from === 'user')
                .slice(-1)[0]?.content || '';

            const res = await fetch('/api/ai/generate-reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    incomingMessage: lastUserMessage,
                    conversationId: selectedConversation,
                }),
            });

            const data = await res.json();
            if (data.reply) {
                setReplyText(data.reply);
            }
        } catch (error) {
            console.error('Error generating AI reply:', error);
            alert('Failed to generate AI reply');
        } finally {
            setGeneratingAI(false);
        }
    };

    const sendReply = async () => {
        if (!replyText.trim() || !selectedConversation || sendingReply) return;

        setSendingReply(true);
        try {
            // Here you would call your API to send the message
            // For now, we'll just add it to the local state
            const newMessage: Message = {
                from: 'assistant',
                content: replyText,
                timestamp: new Date().toISOString(),
            };

            setMessages([...messages, newMessage]);
            setReplyText('');

            // TODO: Actually send via Instagram API
            // await fetch('/api/conversations/send', {
            //   method: 'POST',
            //   body: JSON.stringify({
            //     conversationId: selectedConversation,
            //     message: replyText
            //   })
            // });
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-primary-500" size={32} />
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-primary-500" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">No Conversations Yet</h3>
                <p className="text-gray-400">
                    Conversations will appear here when people message your Instagram account
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="lg:col-span-1 glass-card p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Messages ({conversations.length})</h3>
                    <button
                        onClick={fetchConversations}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="space-y-2">
                    {conversations.map((conv) => (
                        <motion.div
                            key={conv.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setSelectedConversation(conv.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all ${selectedConversation === conv.id
                                    ? 'bg-primary-600/20 border border-primary-500/30'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold">
                                        {conv.user
                                            .split(' ')
                                            .filter((n: string) => n.length > 0)
                                            .map((n: string) => n[0]!)
                                            .join('')}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold truncate">{conv.user}</h4>
                                        <span className="text-xs text-gray-500">{conv.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                                    {conv.unread > 0 && (
                                        <div className="mt-1 inline-block px-2 py-0.5 rounded-full bg-primary-600 text-xs font-bold">
                                            {conv.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Messages View */}
            <div className="lg:col-span-2 glass-card flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <User className="text-primary-500" size={20} />
                                <div>
                                    <h3 className="font-semibold">
                                        {conversations.find((c) => c.id === selectedConversation)?.user}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {conversations.find((c) => c.id === selectedConversation)?.username}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedConversation(null)}
                                className="lg:hidden p-2 rounded-lg hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {messagesLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader className="animate-spin text-primary-500" size={32} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.from === 'user'
                                                        ? 'bg-white/10'
                                                        : 'bg-primary-600 text-white'
                                                    }`}
                                            >
                                                {msg.automationId && (
                                                    <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                                                        <Bot size={12} />
                                                        <span>AI Reply</span>
                                                    </div>
                                                )}
                                                <p className="text-sm">{msg.content}</p>
                                                <p className="text-xs opacity-70 mt-1">
                                                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Reply Input */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={generateAIReply}
                                    disabled={generatingAI || messages.length === 0}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600/20 text-primary-500 hover:bg-primary-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generatingAI ? (
                                        <>
                                            <Loader className="animate-spin" size={16} />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            Generate AI Reply
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendReply()}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                                />
                                <button
                                    onClick={sendReply}
                                    disabled={!replyText.trim() || sendingReply}
                                    className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sendingReply ? (
                                        <Loader className="animate-spin" size={18} />
                                    ) : (
                                        <Send size={18} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Select a conversation to view messages</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
