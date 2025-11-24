// src/pages/Reports.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface Transaction {
    id: string;
    type: 'sent' | 'received';
    amount: number;
    timestamp: number;
}

const Reports: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            const walletId = localStorage.getItem('wallet_id');
            if (!walletId) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`/api/wallet/${walletId}/history`);
                if (res.data && res.data.length > 0) {
                    setTransactions(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch transactions', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const totalReceived = transactions
        .filter((t) => t.type === 'received')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalSent = transactions
        .filter((t) => t.type === 'sent')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalVolume = totalReceived + totalSent;

    // Monthly aggregation for chart
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = i;
        const monthTransactions = transactions.filter((t) => {
            const txDate = new Date(t.timestamp);
            return txDate.getMonth() === monthIndex;
        });

        const volume = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return {
            month: monthNames[monthIndex],
            value: volume,
        };
    });

    const maxValue = Math.max(...monthlyData.map((d) => d.value), 1);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                    <p className="text-gray-400">Transaction insights and financial overview</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Volume */}
                <div className="glass-panel p-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/5 rounded-lg">
                                <Wallet className="w-5 h-5 text-primary-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-400">Total Volume</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-4xl font-bold text-white tracking-tight">
                            {totalVolume.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-500">COINS</p>
                    </div>
                </div>

                {/* Total Received */}
                <div className="glass-panel p-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/5 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-primary-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-400">Received</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-4xl font-bold text-white tracking-tight">
                            {totalReceived.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-500">COINS</p>
                    </div>
                </div>

                {/* Total Sent */}
                <div className="glass-panel p-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/5 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-primary-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-400">Sent</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-4xl font-bold text-white tracking-tight">
                            {totalSent.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-500">COINS</p>
                    </div>
                </div>
            </div>

            {/* Transaction Volume Chart */}
            <div className="glass-panel p-8">
                <div className="flex items-center gap-2 mb-8">
                    <BarChart3 className="w-5 h-5 text-primary-400" />
                    <h3 className="text-lg font-semibold text-white">Monthly Volume</h3>
                </div>

                {transactions.length === 0 ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-white/5 rounded-lg mx-auto flex items-center justify-center mb-3">
                                <BarChart3 className="w-6 h-6 text-gray-600" />
                            </div>
                            <p className="text-gray-500 text-sm">No transaction data yet</p>
                            <p className="text-gray-600 text-xs">Start using your wallet to see analytics</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Bar Chart */}
                        <div className="h-64 flex items-end justify-between gap-3">
                            {monthlyData.map((data) => {
                                const heightPercent = maxValue > 0 ? (data.value / maxValue) * 100 : 0;
                                const hasData = data.value > 0;

                                return (
                                    <div key={data.month} className="flex-1 flex flex-col items-center gap-3 group">
                                        <div className="relative w-full h-full flex items-end">
                                            {/* Tooltip */}
                                            {hasData && (
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur-sm border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {data.value.toLocaleString()} COINS
                                                </div>
                                            )}
                                            {/* Bar */}
                                            <div
                                                className={`w-full rounded-t transition-all duration-500 ${hasData
                                                        ? 'bg-primary-500/80 hover:bg-primary-500 cursor-pointer'
                                                        : 'bg-white/5'
                                                    }`}
                                                style={{ height: hasData ? `${Math.max(heightPercent, 4)}%` : '8px' }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">
                                            {data.month}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Net Flow Summary */}
            {transactions.length > 0 && (
                <div className="glass-panel p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-gray-400">Net Flow</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className={`text-3xl font-bold ${totalReceived - totalSent >= 0 ? 'text-primary-400' : 'text-white'
                                    }`}>
                                    {totalReceived - totalSent >= 0 ? '+' : ''}
                                    {(totalReceived - totalSent).toLocaleString()}
                                </h3>
                                <span className="text-sm text-gray-500">COINS</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-gray-400">Total Transactions</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-white">
                                    {transactions.length}
                                </h3>
                                <span className="text-sm text-gray-500">Operations</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
