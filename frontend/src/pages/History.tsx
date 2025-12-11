// src/pages/History.tsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

interface Transaction {
    id: string;
    sender_wallet_id: string;
    receiver_wallet_id: string;
    amount: number;
    timestamp: number;
    note?: string;
}

const History: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const walletId = localStorage.getItem('wallet_id');

    useEffect(() => {
        if (walletId) {
            fetchHistory(walletId);
        }
    }, [walletId]);

    const fetchHistory = async (id: string) => {
        try {
            const res = await api.get(`/wallet/${id}/history`);
            setTransactions(res.data.reverse()); // Show newest first
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
                <p className="text-gray-400">View your past transactions</p>
            </header>

            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading history...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 opacity-50" />
                        </div>
                        <p>No transactions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="p-4 font-medium">Type</th>
                                    <th className="p-4 font-medium">Amount</th>
                                    <th className="p-4 font-medium">Counterparty</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.map((tx) => {
                                    const isReceived = tx.receiver_wallet_id === walletId;
                                    return (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className={`flex items-center gap-2 font-medium ${isReceived ? 'text-green-400' : 'text-red-400'}`}>
                                                    {isReceived ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                    {isReceived ? 'Received' : 'Sent'}
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold text-white">
                                                {isReceived ? '+' : '-'}{tx.amount}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 mb-1">
                                                        {isReceived ? 'From' : 'To'}
                                                    </span>
                                                    <code className="text-xs text-primary-300 font-mono bg-black/20 px-2 py-1 rounded w-fit max-w-[200px] truncate">
                                                        {isReceived ? tx.sender_wallet_id : tx.receiver_wallet_id}
                                                    </code>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm">
                                                {new Date(tx.timestamp * 1000).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm italic">
                                                {tx.note || '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
