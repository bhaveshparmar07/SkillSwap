import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    tutorName: string;
    onSubmit: (rating: number, comment: string, tags: string[]) => void;
}

const QUICK_TAGS = [
    'Patient',
    'Clear',
    'Helpful',
    'Knowledgeable',
    'Punctual',
    'Encouraging',
    'Well-prepared',
    'Responsive'
];

export default function ReviewModal({ isOpen, onClose, tutorName, onSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        onSubmit(rating, comment, selectedTags);
        // Reset form
        setRating(0);
        setComment('');
        setSelectedTags([]);
        onClose();
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-glass max-w-lg w-full p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Rate Your Experience</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tutor Name */}
                    <div className="text-center">
                        <p className="text-gray-600">How was your session with</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{tutorName}</p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={40}
                                    className={`${star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="text-center text-sm text-gray-600">
                            {rating === 5 && '⭐ Excellent!'}
                            {rating === 4 && '😊 Great!'}
                            {rating === 3 && '👍 Good'}
                            {rating === 2 && '😕 Okay'}
                            {rating === 1 && '😞 Needs Improvement'}
                        </p>
                    )}

                    {/* Quick Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quick Tags (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Review
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="input min-h-[100px]"
                            placeholder="Share your experience... (What did you learn? What was helpful?)"
                            required
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
