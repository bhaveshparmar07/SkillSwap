import React from 'react';
import { ExternalLink, Gift, Zap } from 'lucide-react';
import type { AffiliateTool } from '@/types';

// Mock affiliate tools
const AFFILIATE_TOOLS: AffiliateTool[] = [
    {
        id: '1',
        name: 'Canva Pro',
        description: 'Create stunning designs with drag-and-drop simplicity. Perfect for presentations, social media, and marketing materials.',
        logoURL: 'https://logo.clearbit.com/canva.com',
        category: 'design',
        affiliateLink: 'https://canva.com?ref=skillswitch',
        bonus: 50,
    },
    {
        id: '2',
        name: 'Grammarly Premium',
        description: 'AI-powered writing assistant that helps you write flawlessly. Check grammar, spelling, and enhance clarity.',
        logoURL: 'https://logo.clearbit.com/grammarly.com',
        category: 'writing',
        affiliateLink: 'https://grammarly.com?ref=skillswitch',
        bonus: 40,
    },
    {
        id: '3',
        name: 'GitHub Copilot',
        description: 'Your AI pair programmer. Code faster with intelligent suggestions powered by OpenAI.',
        logoURL: 'https://logo.clearbit.com/github.com',
        category: 'coding',
        affiliateLink: 'https://github.com/features/copilot?ref=skillswitch',
        bonus: 60,
    },
    {
        id: '4',
        name: 'Figma Professional',
        description: 'Collaborative interface design tool. Create prototypes, design systems, and beautiful UIs.',
        logoURL: 'https://logo.clearbit.com/figma.com',
        category: 'design',
        affiliateLink: 'https://figma.com?via=skillswitch',
        bonus: 45,
    },
    {
        id: '5',
        name: 'Notion Team',
        description: 'All-in-one workspace for notes, tasks, wikis, and databases. Organize your life and studies.',
        logoURL: 'https://logo.clearbit.com/notion.so',
        category: 'productivity',
        affiliateLink: 'https://notion.so?ref=skillswitch',
        bonus: 35,
    },
    {
        id: '6',
        name: 'Replit',
        description: 'Code collaboratively in the browser. Perfect for pair programming and learning.',
        logoURL: 'https://logo.clearbit.com/replit.com',
        category: 'coding',
        affiliateLink: 'https://replit.com?ref=skillswitch',
        bonus: 30,
    },
];

interface ToolCardProps {
    tool: AffiliateTool;
    onClickAffiliate: (tool: AffiliateTool) => void;
}

function ToolCard({ tool, onClickAffiliate }: ToolCardProps) {
    const categoryColors = {
        design: 'from-pink-500 to-purple-500',
        writing: 'from-blue-500 to-cyan-500',
        coding: 'from-green-500 to-teal-500',
        productivity: 'from-orange-500 to-red-500',
    };

    return (
        <div className="card overflow-hidden hover:shadow-xl transition-shadow">
            {/* Header with gradient */}
            <div className={`h-24 bg-gradient-to-r ${categoryColors[tool.category]} flex items-center justify-center`}>
                <img
                    src={tool.logoURL}
                    alt={`${tool.name} logo`}
                    className="w-16 h-16 bg-white rounded-lg p-2"
                    onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/64?text=' + tool.name[0];
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-700 mb-4">{tool.description}</p>

                {/* Bonus Badge */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-gold-50 rounded-lg">
                    <Gift size={20} className="text-gold-600" />
                    <span className="text-sm font-semibold text-gold-700">
                        Earn {tool.bonus} SkillCoins bonus on sign-up!
                    </span>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => onClickAffiliate(tool)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <span>Get Discount</span>
                    <ExternalLink size={16} />
                </button>
            </div>
        </div>
    );
}

export default function Tools() {
    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

    const categories = [
        { value: 'all', label: 'All Tools' },
        { value: 'design', label: 'Design' },
        { value: 'writing', label: 'Writing' },
        { value: 'coding', label: 'Coding' },
        { value: 'productivity', label: 'Productivity' },
    ];

    const handleAffiliateClick = (tool: AffiliateTool) => {
        // Track the click (this would go to Firestore in production)
        console.log('Affiliate click:', tool.name);

        // Award bonus coins (mock)
        alert(`🎉 Opening ${tool.name}!\n\nYou'll earn ${tool.bonus} SkillCoins when you sign up!\n(Redirecting to ${tool.affiliateLink})`);

        // Open affiliate link in new tab
        // window.open(tool.affiliateLink, '_blank');
    };

    const filteredTools = selectedCategory === 'all'
        ? AFFILIATE_TOOLS
        : AFFILIATE_TOOLS.filter(t => t.category === selectedCategory);

    return (
        <div className="min-h-screen gradient-purple py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Zap size={48} className="text-yellow-400" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Student Tools & Resources
                        </h1>
                    </div>
                    <p className="text-white/90 text-lg">
                        Get exclusive discounts on the best tools for students + earn SkillCoins!
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex justify-center gap-3 mb-8 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className={`px-5 py-2 rounded-full font-medium transition-all ${selectedCategory === cat.value
                                    ? 'bg-white text-primary-600 shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Info Banner */}
                <div className="card-glass p-6 mb-8 text-center">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                        How It Works
                    </h3>
                    <p className="text-gray-700">
                        Click any tool → Get your exclusive discount → Sign up → Earn <strong>SkillCoins</strong> as a bonus!
                        You can use these coins for free tutoring sessions.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map((tool) => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                            onClickAffiliate={handleAffiliateClick}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 card-glass p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        More Tools Coming Soon!
                    </h3>
                    <p className="text-gray-600">
                        We're partnering with more educational tools. Check back regularly for new offers.
                    </p>
                </div>
            </div>
        </div>
    );
}
