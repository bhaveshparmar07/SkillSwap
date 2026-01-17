import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome, LogIn } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { signInWithGoogle, signInWithStudentId } = useAuth();

    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError('');
            await signInWithGoogle();
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    const handleStudentIdLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentId || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await signInWithStudentId({ studentId, password });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-purple flex items-center justify-center p-4">
            <div className="card-glass max-w-md w-full p-8 animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 gradient-blue rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">SS</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-600 mt-2">Sign in to continue to SkillSwitch</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Google Sign-In */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border-2 border-gray-300 transition-all duration-200 mb-6 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    <Chrome size={20} />
                    <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white rounded-full text-gray-600">Or sign in with Student ID</span>
                    </div>
                </div>

                {/* Student ID Login Form */}
                <form onSubmit={handleStudentIdLogin} className="space-y-4">
                    <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                            Student ID
                        </label>
                        <input
                            id="studentId"
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="input"
                            placeholder="e.g., S12345"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
}
