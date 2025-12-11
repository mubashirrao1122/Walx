import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, Database, HardDrive, Cpu, ShieldAlert } from 'lucide-react';

const Admin: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-gray-400">System monitoring and user management</p>
                </div>
                <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-red-500/20">
                    <ShieldAlert className="w-4 h-4" />
                    Admin Access Only
                </div>
            </header>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-panel p-6 space-y-2">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <Users className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase">Total Users</span>
                        </div>
                        <span className="text-3xl font-bold text-white">{stats.total_users}</span>
                    </div>
                    <div className="glass-panel p-6 space-y-2">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <Database className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase">Blocks</span>
                        </div>
                        <span className="text-3xl font-bold text-white">{stats.total_blocks}</span>
                    </div>
                    <div className="glass-panel p-6 space-y-2">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <HardDrive className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase">Transactions</span>
                        </div>
                        <span className="text-3xl font-bold text-white">{stats.total_transactions}</span>
                    </div>
                    <div className="glass-panel p-6 space-y-2">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <Cpu className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase">Coins Mined</span>
                        </div>
                        <span className="text-3xl font-bold text-white">{stats.total_coins_mined}</span>
                    </div>
                </div>
            )}

            <div className="glass-panel overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Registered Users</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-black/20 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4 text-left">Full Name</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-left">Wallet ID</th>
                                <th className="px-6 py-4 text-left">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{user.full_name}</td>
                                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <code className="bg-black/30 px-2 py-1 rounded text-xs text-primary-300 font-mono">
                                            {user.wallet_id.substring(0, 16)}...
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(user.created_at * 1000).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
