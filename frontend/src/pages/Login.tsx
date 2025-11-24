// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [walletId, setWalletId] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (step === 'credentials') {
                // Step 1: Send credentials to get OTP
                await axios.post('/api/auth/login', { wallet_id: walletId, private_key: privateKey });
                setStep('otp');
            } else {
                // Step 2: Verify OTP
                await axios.post('/api/auth/verify-otp', { wallet_id: walletId, otp });

                // If success
                localStorage.setItem('wallet_id', walletId);
                localStorage.setItem('private_key', privateKey);
                navigate('/');
            }
        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.response?.data || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-8 space-y-8">
                <div className="text-center space-y-2">
                    <img src="/logo.svg" alt="Walx" className="w-20 h-20 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-400">Login to your Walx wallet</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {step === 'credentials' ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Wallet ID</label>
                                <input
                                    type="text"
                                    value={walletId}
                                    onChange={(e) => setWalletId(e.target.value)}
                                    className="glass-input w-full"
                                    placeholder="Enter your wallet ID"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Private Key</label>
                                <input
                                    type="password"
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    className="glass-input w-full"
                                    placeholder="Enter your private key"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <label className="text-sm font-medium text-gray-300">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="glass-input w-full text-center tracking-widest text-2xl"
                                placeholder="000000"
                                maxLength={6}
                                required
                                autoFocus
                            />
                            <p className="text-xs text-gray-400 text-center">
                                Check your server console for the OTP code (Mock Mode)
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="glass-button w-full flex items-center justify-center gap-2 py-3"
                    >
                        {loading ? 'Processing...' : (step === 'credentials' ? 'Continue' : 'Verify & Login')}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        Don't have a wallet?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
