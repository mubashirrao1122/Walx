// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Copy, CheckCircle, ArrowRight, Mail, User, CreditCard } from 'lucide-react';

const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [cnic, setCnic] = useState('');
    const [walletId, setWalletId] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [copiedWallet, setCopiedWallet] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                full_name: fullName,
                email: email,
                cnic: cnic
            });

            // Backend now returns wallet_id and private_key
            setWalletId(response.data.wallet_id);
            setPrivateKey(response.data.private_key);
            setSuccess(true);
        } catch (err: any) {
            console.error('Registration failed', err);
            setError(err.response?.data || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, type: 'wallet' | 'key') => {
        navigator.clipboard.writeText(text);
        if (type === 'wallet') {
            setCopiedWallet(true);
            setTimeout(() => setCopiedWallet(false), 2000);
        } else {
            setCopiedKey(true);
            setTimeout(() => setCopiedKey(false), 2000);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-panel w-full max-w-2xl p-8 space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                        <p className="text-gray-400 mb-6">Save your credentials securely</p>
                    </div>

                    <div className="space-y-4">
                        {/* Wallet ID */}
                        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                            <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Wallet ID</label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-sm text-white font-mono break-all">{walletId}</code>
                                <button
                                    onClick={() => copyToClipboard(walletId, 'wallet')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                                >
                                    {copiedWallet ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Private Key */}
                        <div className="bg-black/30 border border-red-500/20 rounded-xl p-4">
                            <label className="text-xs text-red-400 uppercase tracking-wider mb-2 block">Private Key (Keep Secret!)</label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-sm text-white font-mono break-all">{privateKey}</code>
                                <button
                                    onClick={() => copyToClipboard(privateKey, 'key')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                                >
                                    {copiedKey ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-sm text-red-300">
                            ⚠️ <strong>Important:</strong> Save your private key securely. You'll need it to access your wallet. We cannot recover it if lost!
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        Go to Login
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-lg p-8 space-y-8">
                <div className="text-center space-y-2">
                    <img src="/logo.svg" alt="Walx" className="w-20 h-20 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-gray-400">Register for your Walx wallet</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary-400" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary-400" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            placeholder="your.email@example.com"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">OTP will be sent to this email during login</p>
                    </div>

                    {/* CNIC */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-primary-400" />
                            CNIC Number
                        </label>
                        <input
                            type="text"
                            value={cnic}
                            onChange={(e) => setCnic(e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            placeholder="1234567890123"
                            maxLength={13}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">13-digit CNIC without dashes</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Create Wallet
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-400">
                    Already have a wallet?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
