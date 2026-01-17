import React from 'react';
import { type Tutor } from '@/types';
import { GraduationCap, Star, MapPin } from 'lucide-react';

interface SkillCardProps {
    tutor: Tutor;
    onRequest: (tutor: Tutor) => void;
}

export default function SkillCard({ tutor, onRequest }: SkillCardProps) {
    return (
        <div className="card-glass p-6 hover:scale-105 transition-transform duration-300 group">
            {/* Header with Avatar */}
            <div className="flex items-center gap-4 mb-4">
                {tutor.photoURL ? (
                    <img
                        src={tutor.photoURL}
                        alt={tutor.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-primary-200"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-blue flex items-center justify-center text-white font-bold text-2xl">
                        {tutor.name.charAt(0)}
                    </div>
                )}

                <div>
                    <h3 className="font-bold text-lg text-gray-900">{tutor.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <GraduationCap size={14} />
                        <span>{tutor.university}</span>
                    </div>
                </div>
            </div>

            {/* Bio */}
            {tutor.bio && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tutor.bio}</p>
            )}

            {/* Skills */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    {tutor.skills.slice(0, 5).map((skill, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                    {tutor.skills.length > 5 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{tutor.skills.length - 5} more
                        </span>
                    )}
                </div>
            </div>

            {/* Rating & Hourly Rate */}
            <div className="flex items-center justify-between mb-4">
                {tutor.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="font-semibold text-gray-900">{tutor.rating.toFixed(1)}</span>
                    </div>
                )}

                {tutor.hourlyRate && (
                    <div className="text-sm text-gray-600">
                        <span className="font-bold text-gold-600">{tutor.hourlyRate}</span>
                        <span className="ml-1">coins/hr</span>
                    </div>
                )}
            </div>

            {/* Request Button */}
            <button
                onClick={() => onRequest(tutor)}
                className="btn-primary w-full group-hover:shadow-xl"
            >
                Request Help
            </button>
        </div>
    );
}
