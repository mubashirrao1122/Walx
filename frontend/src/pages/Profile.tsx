import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Plus, Trash2, Shield, CreditCard, Mail } from 'lucide-react';

interface UserProfile {
    full_name: string;
    email: string;
    cnic: string;
    wallet_id: string;
    beneficiaries: string[];
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [newBeneficiary, setNewBeneficiary] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const walletId = localStorage.getItem('wallet_id');
        if (!walletId) return;

        try {
            const res = await axios.get(`/api/user/${walletId}/profile`);
            setProfile(res.data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBeneficiary = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setAdding(true);
        setError('');

        try {
            await axios.post('/api/user/beneficiary', {
                wallet_id: profile.wallet_id,
                beneficiary_wallet_id: newBeneficiary
            });
            setNewBeneficiary('');
            fetchProfile(); // Refresh list
        } catch (err) {
            setError('Failed to add beneficiary');
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (!profile) return <div className="text-white">Profile not found</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Wallet Profile</h1>
                <p className="text-gray-400">Manage your account and beneficiaries</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="glass-panel p-6 md:col-span-1 space-y-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
                            <User className="w-12 h-12 text-primary-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{profile.full_name}</h2>
                        <p className="text-sm text-gray-400">Verified User</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm truncate">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{profile.cnic}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Shield className="w-4 h-4 text-gray-500" />
                            <span className="text-sm truncate" title={profile.wallet_id}>
                                {profile.wallet_id.substring(0, 10)}...
                            </span>
                        </div>
                    </div>
                </div>

                {/* Beneficiaries Section */}
                <div className="glass-panel p-6 md:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-6">Beneficiaries</h3>

                    <form onSubmit={handleAddBeneficiary} className="flex gap-2 mb-8">
                        <input
                            type="text"
                            value={newBeneficiary}
                            onChange={(e) => setNewBeneficiary(e.target.value)}
                            placeholder="Enter Wallet ID to add"
                            className="glass-input flex-1"
                            required
                        />
                        <button
                            type="submit"
                            disabled={adding}
                            className="glass-button flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </form>

                    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                    <div className="space-y-3">
                        {profile.beneficiaries.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No beneficiaries added yet</p>
                        ) : (
                            profile.beneficiaries.map((b, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-lg flex items-center justify-between group hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                            {b.substring(0, 2)}
                                        </div>
                                        <span className="text-gray-300 font-mono text-sm">{b}</span>
                                    </div>
                                    <button className="text-gray-500 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
