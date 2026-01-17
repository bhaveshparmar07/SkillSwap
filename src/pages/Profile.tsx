import React, { useState } from 'react';
import { User, Edit2, Save, X, Plus, Trash2, Camera, Shield, Award, Mail, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Editable fields
    const [name, setName] = useState(user?.name || '');
    const [university, setUniversity] = useState(user?.university || '');
    const [bio, setBio] = useState(user?.bio || 'Passionate learner and tutor');
    const [skills, setSkills] = useState<string[]>(user?.skills || []);
    const [newSkill, setNewSkill] = useState('');

    const handleSave = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Update Firestore
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                name,
                university,
                bio,
                skills,
            });

            // Refresh user data in context
            await refreshUser();

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset to original values
        setName(user?.name || '');
        setUniversity(user?.university || '');
        setBio(user?.bio || 'Passionate learner and tutor');
        setSkills(user?.skills || []);
        setIsEditing(false);
    };

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleAvatarUpload = () => {
        alert('Avatar upload coming soon! (Mock implementation)');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Customize your SkillSwap profile</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Picture */}
                    <div className="lg:col-span-1">
                        <div className="card p-6">
                            <div className="flex flex-col items-center">
                                {/* Avatar */}
                                <div className="relative mb-4">
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.name}
                                            className="w-32 h-32 rounded-full border-4 border-primary-300"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full gradient-purple flex items-center justify-center text-white text-5xl font-bold border-4 border-primary-300">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}

                                    {/* Camera Button */}
                                    <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors">
                                        <Camera size={20} />
                                    </button>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-sm text-gray-600 mb-4">{user.university}</p>

                                {/* Stats */}
                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">SkillCoins</span>
                                        <span className="font-bold text-gold-600">{user.skillCoins || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">Verified</span>
                                        <span className={`font-bold ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {user.isVerified ? '✓ Yes' : '⏳ Pending'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">Student ID</span>
                                        <span className="font-mono text-sm text-gray-900">{user.studentId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Details */}
                    <div className="lg:col-span-2">
                        <div className="card p-6">
                            {/* Edit Toggle */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn-primary"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <Save size={18} />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <User size={18} />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing}
                                        className="input"
                                    />
                                </div>

                                {/* Email (read-only) */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Mail size={18} />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={user.email || 'Not provided'}
                                        disabled
                                        className="input bg-gray-100 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                {/* University */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <GraduationCap size={18} />
                                        University
                                    </label>
                                    <input
                                        type="text"
                                        value={university}
                                        onChange={(e) => setUniversity(e.target.value)}
                                        disabled={!isEditing}
                                        className="input"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <User size={18} />
                                        Bio
                                    </label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        disabled={!isEditing}
                                        className="input min-h-[100px]"
                                        placeholder="Tell others about yourself..."
                                    />
                                </div>

                                {/* Skills */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Award size={18} />
                                        Skills
                                    </label>

                                    {/* Add Skill Input */}
                                    {isEditing && (
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                                className="input flex-1"
                                                placeholder="Add a skill (e.g., Python, Calculus)"
                                            />
                                            <button
                                                onClick={addSkill}
                                                className="btn-primary"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    )}

                                    {/* Skills List */}
                                    <div className="flex flex-wrap gap-2">
                                        {skills.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No skills added yet</p>
                                        ) : (
                                            skills.map((skill: string, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                                                >
                                                    <span>{skill}</span>
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => removeSkill(skill)}
                                                            className="text-primary-900 hover:text-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
