import React from 'react';
import { Coins } from 'lucide-react';

interface CoinBadgeProps {
    balance: number;
    size?: 'sm' | 'md' | 'lg';
    showShimmer?: boolean;
}

export default function CoinBadge({ balance, size = 'md', showShimmer = true }: CoinBadgeProps) {
    const sizeClasses = {
        sm: 'text-sm px-2 py-1',
        md: 'text-base px-3 py-1.5',
        lg: 'text-lg px-4 py-2',
    };

    const iconSizes = {
        sm: 14,
        md: 18,
        lg: 22,
    };

    return (
        <div
            className={`
        inline-flex items-center gap-2 gradient-gold rounded-full font-bold text-gray-900 shadow-lg
        ${sizeClasses[size]}
        ${showShimmer ? 'shimmer' : ''}
      `}
        >
            <Coins size={iconSizes[size]} className="animate-pulse text-gray-900" />
            <span className="text-gray-900">{(balance || 0).toLocaleString()}</span>
        </div>
    );
}
