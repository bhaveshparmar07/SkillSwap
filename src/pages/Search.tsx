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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-glass max-w-md w-full p-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Request Help from {tutor.name}
                </h2>

                <div className="mb-4 p-4 bg-primary-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Skills:</strong> {tutor.skills.join(', ')}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
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

export default function Search() {
    const [query, setQuery] = useState('');
    const [allTutors, setAllTutors] = useState<Tutor[]>([]);
    const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Fetch all tutors from Firestore on mount
    useEffect(() => {
        async function loadTutors() {
            setLoading(true);
            const tutors = await fetchAllTutors();
            setAllTutors(tutors);
            setFilteredTutors(tutors);
            setLoading(false);
        }
        loadTutors();
    }, []);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setFilteredTutors(allTutors); // Show all tutors when no query
            return;
        }

        const timeoutId = setTimeout(async () => {
            setSearching(true);
            try {
                // Use Gemini AI for intelligent matching
                const result = await matchTutorsWithAI(query, allTutors);
                setFilteredTutors(result.tutors);
                logTutorSearch(query, result.tutors.length);
            } catch (error) {
                console.error('Search error:', error);
                // Fallback to simple filtering
                const filtered = allTutors.filter(tutor =>
                    tutor.skills.some(skill =>
                        skill.toLowerCase().includes(query.toLowerCase())
                    ) || tutor.name.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredTutors(filtered);
            } finally {
                setSearching(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [query, allTutors]);

    const handleRequestTutor = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        setShowBookingModal(true);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] gradient-purple py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Find Your Perfect Tutor
                    </h1>
                    <p className="text-white/90 text-lg">
                        Powered by Google Gemini AI for intelligent matching
                    </p>
                </div>

                {/* Search Bar */}
                <div className="card-glass p-4 mb-8">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            placeholder="What do you need help with? (e.g., calculus, React, Spanish...)"
                        />
                    </div>
                </div>

                {/* Initial Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader size={48} className="text-white animate-spin" />
                            <p className="text-white text-lg">Loading tutors from SkillSwap...</p>
                        </div>
                    </div>
                )}

                {/* Search Loading State */}
                {!loading && searching && (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader size={48} className="text-white animate-spin" />
                            <p className="text-white text-lg">Finding the best tutors for you...</p>
                        </div>
                    </div>
                )}

                {/* Results */}
                {!loading && !searching && filteredTutors.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {query ? `${filteredTutors.length} Tutor${filteredTutors.length !== 1 ? 's' : ''} Found` : `Browse All Tutors (${filteredTutors.length} available)`}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredTutors.map(tutor => (
                                <SkillCard
                                    key={tutor.id}
                                    tutor={tutor}
                                    onRequest={handleRequestTutor}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!loading && !searching && query && filteredTutors.length === 0 && (
                    <div className="card-glass p-12 text-center">
                        <p className="text-gray-600 text-lg mb-2">No tutors found for "{query}"</p>
                        <p className="text-gray-500">Try a different search term or browse all tutors</p>
                    </div>
                )}

                {/* Empty State - No users with skills */}
                {!loading && !searching && !query && filteredTutors.length === 0 && (
                    <div className="card-glass p-12 text-center">
                        <SearchIcon size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Tutors Available Yet
                        </h3>
                        <p className="text-gray-600">
                            Be the first! Add skills to your profile to become a tutor.
                        </p>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <BookingModal
                tutor={selectedTutor}
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
            />
        </div>
    );
}
