import React from 'react';

interface PricingBreakdownProps {
    hourlyRate: number;
    estimatedHours: number;
    platformFeePercentage?: number;
}

export default function PricingBreakdown({
    hourlyRate,
    estimatedHours,
    platformFeePercentage = 12.5,
}: PricingBreakdownProps) {
    const subtotal = hourlyRate * estimatedHours;
    const platformFee = subtotal * (platformFeePercentage / 100);
    const tutorReceives = subtotal - platformFee;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl space-y-3 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3">Pricing Breakdown</h3>

            <div className="flex justify-between text-sm">
                <span className="text-gray-600">{hourlyRate} coins/hour × {estimatedHours} hours</span>
                <span className="font-medium text-gray-900">{subtotal.toLocaleString()} coins</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
                <span>Platform Fee ({platformFeePercentage}%)</span>
                <span className="text-red-600">-{platformFee.toFixed(0)} coins</span>
            </div>

            <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900">You Pay</span>
                <span className="text-2xl font-bold text-primary-600">{subtotal.toLocaleString()} coins</span>
            </div>

            <div className="text-xs text-gray-500 bg-white/60 p-2 rounded">
                💡 Tutor receives <strong>{tutorReceives.toFixed(0)} coins</strong> · Platform keeps {platformFee.toFixed(0)} coins
            </div>
        </div>
    );
}
