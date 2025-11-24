// src/pages/Explorer.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Layers, Hash } from 'lucide-react';

interface Block {
    index: number;
    timestamp: number;
    transactions: any[];
    previous_hash: string;
    hash: string;
    nonce: number;
}

const Explorer: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlocks();
    }, []);

    const fetchBlocks = async () => {
        try {
            const res = await axios.get('/api/blockchain/blocks');
            setBlocks(res.data.reverse());
        } catch (err) {
            console.error('Failed to fetch blocks', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Block Explorer</h1>
                <p className="text-gray-400">Inspect the blockchain ledger</p>
            </header>

            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading blockchain...</div>
                ) : (
                    blocks.map((block) => (
                        <div key={block.hash} className="glass-panel p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Box className="w-24 h-24 text-white" />
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-primary-500/20 p-3 rounded-lg">
                                    <Layers className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Block #{block.index}</h2>
                                    <p className="text-sm text-gray-400">
                                        {new Date(block.timestamp * 1000).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-black/20 p-4 rounded-lg space-y-1">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Hash</span>
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-500" />
                                        <code className="text-xs text-primary-300 font-mono break-all">{block.hash}</code>
                                    </div>
                                </div>
                                <div className="bg-black/20 p-4 rounded-lg space-y-1">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Previous Hash</span>
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-500" />
                                        <code className="text-xs text-gray-400 font-mono break-all">{block.previous_hash}</code>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                                    Transactions ({block.transactions.length})
                                </h3>
                                <div className="space-y-2">
                                    {block.transactions.map((tx: any) => (
                                        <div key={tx.id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-400">ID:</span>
                                                        <code className="text-xs text-white font-mono">{tx.id.substring(0, 16)}...</code>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <span>From: {tx.sender_wallet_id.substring(0, 8)}...</span>
                                                        <span>→</span>
                                                        <span>To: {tx.receiver_wallet_id.substring(0, 8)}...</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-white">{tx.amount} COINS</span>
                                                    {tx.note && <p className="text-xs text-gray-400 italic">{tx.note}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {block.transactions.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">No transactions in this block</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Explorer;
