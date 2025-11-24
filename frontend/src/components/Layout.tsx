// src/components/Layout.tsx
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Send, History, Box, FileText, LogOut, User, BarChart, Shield, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.removeItem('wallet_id');
        localStorage.removeItem('private_key');
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/send', icon: Send, label: 'Send Money' },
        { path: '/history', icon: History, label: 'History' },
        { path: '/explorer', icon: Box, label: 'Explorer' },
        { path: '/logs', icon: FileText, label: 'System Logs' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/reports', icon: BarChart, label: 'Reports' },
        { path: '/admin', icon: Shield, label: 'Admin Panel' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg text-white"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Sidebar */}
            <aside className={`w-64 glass-panel m-4 mr-0 flex flex-col fixed h-[calc(100vh-2rem)] z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6 flex items-center gap-3 border-b border-white/10">
                    <img src="/logo.svg" alt="Walx" className="w-10 h-10" />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-300">
                        Walx
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
