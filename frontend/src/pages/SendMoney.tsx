// src/pages/SendMoney.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, Wallet, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const SendMoney: React.FC = () => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [recipientValid, setRecipientValid] = useState<boolean | null>(null);
    const navigate = useNavigate();

    // Validate recipient format
    const validateRecipient = (value: string) => {
        if (value.length === 0) {
            setRecipientValid(null);
            return;
        }
        // Simple validation: check if it's a hex string of reasonable length
        const isValid = value.length >= 32 && /^[a-fA-F0-9]+$/.test(value);
        setRecipientValid(isValid);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const walletId = localStorage.getItem('wallet_id');
        if (!walletId) {
            setError('No wallet found. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/wallet/send', {
                sender_id: walletId,
                receiver_id: recipient,
                amount: parseFloat(amount),
                private_key: privateKey,
                note: note || undefined
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/history');
            }, 2000);
        } catch (err: any) {
            console.error('Transaction failed', err);
            setError(err.response?.data || 'Transaction failed. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="glass-panel p-12 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-4">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Transaction Sent!</h2>
                    <p className="text-gray-400">Your transaction is being processed on the blockchain.</p>
                    <div className="pt-4">
                        <div className="inline-flex items-center gap-2 text-sm text-primary-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirecting to history...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/30">
                    <Send className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Send Money</h1>
                    <p className="text-gray-400 mt-1">Transfer COINS to another wallet</p>
                </div>
            </div>

            {/* Main Form */}
            <div className="glass-panel p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Recipient Wallet */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-primary-400" />
                            Recipient Wallet ID
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e) => {
                                    setRecipient(e.target.value);
                                    validateRecipient(e.target.value);
                                }}
                                placeholder="Enter recipient's wallet address"
                                required
                                className={`w-full px-4 py-4 pr-12 bg-black/30 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-300 ${recipientValid === true
                                        ? 'border-green-500/50 focus:ring-green-500'
                                        : recipientValid === false
                                            ? 'border-red-500/50 focus:ring-red-500'
                                            : 'border-white/10 focus:ring-primary-500 hover:border-white/20'
                                    }`}
                            />
                            {recipientValid !== null && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {recipientValid ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                    )}
                                </div>
                            )}
                        </div>
                        <p className={`text-xs transition-colors ${recipientValid === false
                                ? 'text-red-400'
                                : 'text-gray-500'
                            }`}>
                            {recipientValid === false
                                ? 'Invalid wallet address format'
                                : 'Paste the wallet address of the recipient'
                            }
                        </p>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-primary-400" />
                            Amount
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                                className="w-full px-4 py-4 bg-black/30 border border-white/10 rounded-xl text-white text-2xl font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-white/20"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                COINS
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Enter the amount you want to send</p>
                    </div>

                    {/* Note (Optional) */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                            Note <span className="text-gray-600 font-normal lowercase">(Optional)</span>
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add a message with your transaction..."
                            rows={3}
                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-white/20 resize-none"
                        />
                    </div>

                    {/* Private Key */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            Your Private Key
                        </label>
                        <input
                            type="password"
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                            placeholder="Enter your private key to authorize this transaction"
                            required
                            className="w-full px-4 py-4 bg-black/30 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-red-500/40"
                        />
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <p className="text-xs text-red-300 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>Your private key is required to sign this transaction. Never share it with anyone.</span>
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-red-300 font-semibold mb-1">Transaction Failed</h4>
                                    <p className="text-sm text-red-200">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Transaction...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                Send Money
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-4 border-l-4 border-blue-500">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        Instant Transfer
                    </h4>
                    <p className="text-sm text-gray-400">Transactions are processed immediately on the blockchain</p>
                </div>
                <div className="glass-panel p-4 border-l-4 border-purple-500">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-purple-400" />
                        Secure & Private
                    </h4>
                    <p className="text-sm text-gray-400">All transactions are cryptographically signed and verified</p>
                </div>
            </div>
        </div>
    );
};

export default SendMoney;
