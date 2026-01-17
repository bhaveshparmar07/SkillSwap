import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CoinBadge from '@/components/CoinBadge';
import { CheckCircle, AlertCircle, Upload, Wallet, FileCheck, ListTodo } from 'lucide-react';

// Verify ID Modal Component
function VerifyIDModal({ isOpen, onClose, onVerify }: {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (file: File) => Promise<void>;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);
            await onVerify(file);
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-glass max-w-md w-full p-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Student ID</h2>

                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {file ? (
                        <div>
                            <FileCheck size={48} className="mx-auto text-green-500 mb-2" />
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <button
                                onClick={() => setFile(null)}
                                className="mt-2 text-sm text-red-600 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <>
                            <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600 mb-2">Drag & drop your ID card here</p>
                            <p className="text-sm text-gray-500 mb-4">or</p>
                            <label className="btn-secondary cursor-pointer inline-block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                                    className="hidden"
                                />
                                Browse Files
                            </label>
                        </>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="btn-primary flex-1"
                    >
                        {uploading ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user, refreshUser } = useAuth();
    const [showVerifyModal, setShowVerifyModal] = useState(false);

    const handleVerifyID = async (file: File) => {
        // TODO: Integrate with Google Cloud Vision API or backend
        console.log('Verifying ID:', file);

        // Mock verification for now
        await new Promise(resolve => setTimeout(resolve, 2000));

        alert('ID verification submitted! (Mock implementation)');
        await refreshUser();
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-gray-600 mt-1">Here's your dashboard overview</p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* My Wallet Card */}
                <div className="card p-6 md:col-span-2 lg:col-span-1 gradient-gold text-white">
                    <div className="flex items-center gap-2 mb-4">
                        <Wallet size={24} />
                        <h2 className="text-xl font-bold">My Wallet</h2>
                    </div>

                    <div className="mb-4">
                        <p className="text-white/80 text-sm mb-2">Total Balance</p>
                        <div className="text-5xl font-bold animate-pulse">
                            {user.skillCoins.toLocaleString()}
                        </div>
                        <p className="text-white/90 mt-1">SkillCoins</p>
                    </div>

                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs text-white/80 mb-1">Recent Activity</p>
                        <p className="text-sm">+100 coins - Welcome Bonus</p>
                    </div>
                </div>

                {/* Verification Status Card */}
                <div className="card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        {user.isVerified ? (
                            <CheckCircle size={24} className="text-green-500" />
                        ) : (
                            <AlertCircle size={24} className="text-yellow-500" />
                        )}
                        <h2 className="text-xl font-bold text-gray-900">Verification Status</h2>
                    </div>

                    {user.isVerified ? (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                <span className="font-semibold text-green-700">Verified Student</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Your identity has been verified. You can now access all features!
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                                <span className="font-semibold text-yellow-700">Pending Verification</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Verify your student ID to unlock all features and earn bonus coins!
                            </p>
                            <button
                                onClick={() => setShowVerifyModal(true)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Upload size={16} />
                                Verify ID
                            </button>
                        </div>
                    )}
                </div>

                {/* Active Requests Card */}
                <div className="card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <ListTodo size={24} className="text-primary-600" />
                        <h2 className="text-xl font-bold text-gray-900">Active Requests</h2>
                    </div>

                    <div className="space-y-3">
                        {/* Mock data - replace with real data */}
                        <div className="text-center text-gray-500 py-8">
                            <p>No active requests</p>
                            <p className="text-sm mt-2">Start by finding a tutor!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="card p-4 text-center">
                    <div className="text-3xl font-bold text-primary-600">0</div>
                    <div className="text-sm text-gray-600 mt-1">Sessions Completed</div>
                </div>

                <div className="card p-4 text-center">
                    <div className="text-3xl font-bold text-secondary-600">0</div>
                    <div className="text-sm text-gray-600 mt-1">Hours Tutored</div>
                </div>

                <div className="card p-4 text-center">
                    <div className="text-3xl font-bold text-gold-600">{user.skills?.length || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Skills Listed</div>
                </div>

                <div className="card p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600 mt-1">Coins Earned</div>
                </div>
            </div>

            {/* Verify ID Modal */}
            <VerifyIDModal
                isOpen={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
                onVerify={handleVerifyID}
            />
        </div>
    );
}
