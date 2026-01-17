import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CoinBadge from './CoinBadge';
import { Menu, X, Home, Search, MapPin, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    if (!user) return null;

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 gradient-blue rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">SS</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900 hidden sm:block">
                            SkillSwitch
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            to="/search"
                            className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            <Search size={18} />
                            <span>Find Help</span>
                        </Link>

                        <Link
                            to="/map"
                            className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            <MapPin size={18} />
                            <span>Safe Zones</span>
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center gap-4">
                        <CoinBadge balance={user.skillCoins} />

                        {/* User Avatar & Menu */}
                        <div className="flex items-center gap-3">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full border-2 border-primary-300"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0)}
                                </div>
                            )}

                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-700"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/20 animate-slide-up">
                        <div className="flex flex-col gap-3">
                            <CoinBadge balance={user.skillCoins} size="sm" />

                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                to="/search"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Search size={18} />
                                <span>Find Help</span>
                            </Link>

                            <Link
                                to="/map"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <MapPin size={18} />
                                <span>Safe Zones</span>
                            </Link>

                            <button
                                onClick={() => {
                                    handleSignOut();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
