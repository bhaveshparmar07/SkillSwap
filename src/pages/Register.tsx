import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome, UserPlus, Plus, X } from 'lucide-react';

const COMMON_SKILLS = [
    'Python', 'JavaScript', 'Java', 'C++', 'Calculus',
    'Linear Algebra', 'Data Structures', 'Machine Learning',
    'Web Development', 'Mobile Development', 'Physics', 'Chemistry'
];

export default function Register() {
    const navigate = useNavigate();
    const { signInWithGoogle, registerStudent } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        university: '',
        password: '',
        confirmPassword: '',
    });
    const [skills, setSkills] = useState<string[]>([]);
    const [customSkill, setCustomSkill] = useState('');
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

    const toggleSkill = (skill: string) => {
        setSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const addCustomSkill = () => {
        if (customSkill.trim() && !skills.includes(customSkill.trim())) {
            setSkills([...skills, customSkill.trim()]);
            setCustomSkill('');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.studentId || !formData.university || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await registerStudent({
                name: formData.name,
                studentId: formData.studentId,
                university: formData.university,
                password: formData.password,
                skills: skills, // Include skills
            });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen gradient-purple flex items-center justify-center p-4">
            <div className="card-glass max-w-md w-full p-8 animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 gradient-blue rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">SS</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Join SkillSwap</h1>
                    <p className="text-gray-600 mt-2">Create your account and start learning</p>
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
                        <span className="px-4 bg-white rounded-full text-gray-600">Or register with Student ID</span>
                    </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            placeholder="John Doe"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                            Student ID
                        </label>
                        <input
                            id="studentId"
                            name="studentId"
                            type="text"
                            value={formData.studentId}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g., S12345"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                            University
                        </label>
                        <input
                            id="university"
                            name="university"
                            type="text"
                            value={formData.university}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g., MIT"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    {/* Skills Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skills (Optional - helps others find you)
                        </label>

                        {/* Common Skills */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {COMMON_SKILLS.map(skill => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${skills.includes(skill)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>

                        {/* Custom Skill Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customSkill}
                                onChange={(e) => setCustomSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                                className="input flex-1 text-sm"
                                placeholder="Add custom skill..."
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={addCustomSkill}
                                className="btn-secondary px-3"
                                disabled={loading}
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        {/* Selected Custom Skills */}
                        {skills.filter(s => !COMMON_SKILLS.includes(s)).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skills.filter(s => !COMMON_SKILLS.includes(s)).map(skill => (
                                    <div
                                        key={skill}
                                        className="flex items-center gap-1 px-3 py-1 bg-primary-600 text-white rounded-full text-sm"
                                    >
                                        <span>{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleSkill(skill)}
                                            className="hover:bg-primary-700 rounded-full p-0.5"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Creating account...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                <span>Create Account</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}
