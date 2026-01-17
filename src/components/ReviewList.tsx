import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import type { Review } from '@/types';

interface ReviewListProps {
    reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No reviews yet</p>
                <p className="text-sm mt-1">Be the first to leave a review!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="card p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                {review.reviewerName[0]}
                            </div>

                            {/* Name and Date */}
                            <div>
                                <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    className={`${i < review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                            <span className="ml-1 text-sm font-medium text-gray-700">
                                {review.rating}.0
                            </span>
                        </div>
                    </div>

                    {/* Tags */}
                    {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {review.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Comment */}
                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    {/* Helpful Button */}
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                        <ThumbsUp size={16} />
                        <span>Helpful ({review.helpful})</span>
                    </button>
                </div>
            ))}
        </div>
    );
}
