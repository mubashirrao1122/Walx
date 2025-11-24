// src/pages/SystemLogs.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Terminal } from 'lucide-react';

interface LogEntry {
    action: string;
    timestamp: number;
    details: string;
    status: string;
    ip_address?: string;
    block_hash?: string;
}

const SystemLogs: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('/api/logs');
            setLogs(res.data);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
                <p className="text-gray-400">Audit trail of all system activities</p>
            </header>

            <div className="glass-panel p-6">
                {loading ? (
                    <div className="text-white">Loading logs...</div>
                ) : (
                    <div className="max-h-[600px] overflow-y-auto font-mono text-sm">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-400 text-xs uppercase font-bold sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 text-left">Timestamp</th>
                                    <th className="px-6 py-4 text-left">Action</th>
                                    <th className="px-6 py-4 text-left">Details</th>
                                    <th className="px-6 py-4 text-left">IP Address</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                                            {new Date(log.timestamp * 1000).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">
                                            {log.action}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">
                                            {log.details}
                                            {log.block_hash && (
                                                <div className="mt-1 text-xs text-gray-500 font-mono">
                                                    Block: {log.block_hash.substring(0, 10)}...
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm font-mono">
                                            {log.ip_address || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'success'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {log.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemLogs;
