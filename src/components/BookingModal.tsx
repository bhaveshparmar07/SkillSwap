import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader } from 'lucide-react';
import { matchTutorsWithAI } from '@/lib/gemini';
import { fetchAllTutors } from '@/lib/tutors';
import { createSessionRequest } from '@/lib/sessions';
import { logTutorSearch, logTutorRequest } from '@/lib/analytics';
import SkillCard from '@/components/SkillCard';
import { useAuth } from '@/contexts/AuthContext';
import type { Tutor } from '@/types';

// Booking Modal
function BookingModal({ tutor, isOpen, onClose }: {
    tutor: Tutor | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { user } = useAuth();
    const [problem, setProblem] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [loading, setLoading] = useState(false);

    // Set default skill when tutor changes
    React.useEffect(() => {
        if (tutor && tutor.skills && tutor.skills.length > 0) {
            setSelectedSkill(tutor.skills[0]);
        } else {
            setSelectedSkill('General Help');
        }
    }, [tutor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tutor || !problem || !user) return;

        setLoading(true);

        try {
            // Use the skill selected by the student
            const skill = selectedSkill || 'General Help';

            // Create session request in Firestore
            await createSessionRequest({
                studentId: user.uid,
                studentName: user.name,
                tutorId: tutor.id,
                tutorName: tutor.name,
                skill: skill,
                problem: problem,
                skillCoinsOffered: tutor.hourlyRate || 50,
            });

            logTutorRequest(tutor.id, skill);
            alert(`Request sent to ${tutor.name}! They will be notified.`);
            setProblem('');
            setSelectedSkill('');
            onClose();
        } catch (error) {
            console.error('Error sending request:', error);
            alert('Failed to send request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !tutor) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="card-glass max-w-md w-full p-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Request Help from {tutor.name}
                </h2>

                <div className="mb-4 p-4 bg-primary-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Rate:</strong> {tutor.hourlyRate} coins/hour
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Skill Selector */}
                    <div>
                        <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
                            Which skill do you need help with?
                        </label>
                        <select
                            id="skill"
                            value={selectedSkill}
                            onChange={(e) => setSelectedSkill(e.target.value)}
                            className="input"
                            required
                        >
                            {tutor && tutor.skills && tutor.skills.length > 0 ? (
                                tutor.skills.map((skill) => (
                                    <option key={skill} value={skill}>
                                        {skill}
                                    </option>
                                ))
                            ) : (
                                <option value="General Help">General Help</option>
                            )}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
                            Describe your problem
                        </label>
                        <textarea
                            id="problem"
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                            className="input min-h-[120px]"
                            placeholder="I need help with..."
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1"
                        >
                            {loading ? 'Sending...' : 'Send Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
