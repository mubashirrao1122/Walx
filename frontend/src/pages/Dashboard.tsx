// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Wallet, ArrowUpRight, Clock, Box, Copy, RefreshCw, TrendingUp, Eye, EyeOff, Send, History } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [balance, setBalance] = useState<number>(0);
    const [walletId, setWalletId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [showBalance, setShowBalance] = useState(true);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    useEffect(() => {
        const storedWalletId = localStorage.getItem('wallet_id');
        if (storedWalletId) {
            setWalletId(storedWalletId);
            fetchBalance(storedWalletId);
            fetchRecentTransactions(storedWalletId);
        }
    }, []);

    const fetchBalance = async (id: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/wallet/${id}/balance`);
            setBalance(res.data.balance);
        } catch (err) {
            console.error('Failed to fetch balance', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentTransactions = async (id: string) => {
        try {
            const res = await axios.get(`/api/wallet/${id}/history`);
            if (res.data && res.data.length > 0) {
                // Get last 5 transactions
                setRecentTransactions(res.data.slice(0, 5));
            }
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(walletId);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Network Status Badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                    <div className="relative flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <div className="absolute w-2 h-2 rounded-full bg-green-400 animate-ping" />
                    </div>
                    <span className="text-green-300 font-semibold">Network Active</span>
                    <span className="text-green-400/60">•</span>
                    <span className="text-gray-400">Mainnet Beta</span>
                </div>
            </div>
            {/* Balance Card - Hero Section */}
            <div className="relative overflow-hidden rounded-3xl transition-all duration-500 group hover:scale-[1.01]">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-900" />
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />

                {/* Mesh Gradient Overlay */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(171,159,242,0.3) 0%, transparent 50%)' }} />

                {/* Animated Orbs */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/20 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 p-8 md:p-10">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-2">
                            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Total Balance</p>
                            {loading ? (
                                <div className="h-14 w-56 bg-white/20 animate-pulse rounded-xl" />
                            ) : (
                                <div className="flex items-baseline gap-3">
                                    {showBalance ? (
                                        <>
                                            <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight">
                                                {balance.toLocaleString()}
                                            </h1>
                                            <span className="text-2xl text-white/80 font-semibold">COINS</span>
                                        </>
                                    ) : (
                                        <div className="text-6xl md:text-7xl font-bold text-white tracking-tight">••••••</div>
                                    )}
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                                <div className="bg-green-400/20 backdrop-blur-sm text-green-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-green-400/30">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    +2.5% this week
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 text-white/90 hover:text-white border border-white/10 hover:border-white/20"
                            >
                                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => fetchBalance(walletId)}
                                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 text-white/90 hover:text-white border border-white/10 hover:border-white/20"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Wallet Address */}
                    <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 border border-white/10 max-w-2xl">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                                <div className="bg-white/10 p-2 rounded-lg shrink-0">
                                    <Wallet className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Your Wallet</span>
                                    <code className="text-sm text-white font-mono truncate">
                                        {walletId}
                                    </code>
                                </div>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="p-2.5 hover:bg-white/10 rounded-lg transition-all duration-300 shrink-0 group/copy"
                            >
                                {copySuccess ? (
                                    <span className="text-green-300 text-xs font-bold px-2 whitespace-nowrap">Copied!</span>
                                ) : (
                                    <Copy className="w-4 h-4 text-white/60 group-hover/copy:text-white transition-colors" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/send" className="group relative overflow-hidden">
                    <div className="glass-panel p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 border-l-4 border-blue-500">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <Send className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">Send</h3>
                                <p className="text-sm text-gray-400">Transfer COINS</p>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                        </div>
                    </div>
                </Link>

                <Link to="/history" className="group relative overflow-hidden">
                    <div className="glass-panel p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 border-l-4 border-purple-500">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <History className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">History</h3>
                                <p className="text-sm text-gray-400">View transactions</p>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                        </div>
                    </div>
                </Link>

                <Link to="/explorer" className="group relative overflow-hidden">
                    <div className="glass-panel p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/10 border-l-4 border-pink-500">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-2xl shadow-lg shadow-pink-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <Box className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">Explorer</h3>
                                <p className="text-sm text-gray-400">Browse blockchain</p>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-400" />
                        Recent Activity
                    </h3>
                    <Link
                        to="/history"
                        className="text-sm text-primary-400 hover:text-primary-300 font-semibold transition-colors flex items-center gap-1 group"
                    >
                        View All
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
                {recentTransactions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                            <Clock className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-sm">No recent transactions</p>
                        <p className="text-gray-600 text-xs mt-1">Your activity will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentTransactions.map((tx, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${tx.sender_wallet_id === walletId ? 'bg-white/5' : 'bg-primary-500/10'}`}>
                                        {tx.sender_wallet_id === walletId ? (
                                            <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <TrendingUp className="w-4 h-4 text-primary-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {tx.sender_wallet_id === walletId ? 'Sent' : 'Received'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(tx.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-semibold ${tx.sender_wallet_id === walletId ? 'text-white' : 'text-primary-400'
                                        }`}>
                                        {tx.sender_wallet_id === walletId ? '-' : '+'}{tx.amount} COINS
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
