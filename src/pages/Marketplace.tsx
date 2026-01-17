import React, { useState } from 'react';
import { ShoppingBag, Download, Star, Filter } from 'lucide-react';
import type { Resource } from '@/types';

// Mock resources for demonstration
const MOCK_RESOURCES: Resource[] = [
    {
        id: '1',
        tutorId: 'tutor1',
        tutorName: 'Alice Johnson',
        title: 'Complete Python Basics Notes',
        description: 'Comprehensive notes covering variables, functions, loops, and OOP concepts. Perfect for beginners!',
        category: 'notes',
        price: 50,
        previewImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
        fileSize: 2.5,
        downloads: 143,
        rating: 4.8,
        reviews: 28,
        tags: ['Python', 'Beginner', 'Programming'],
        createdAt: new Date('2024-01-15'),
    },
    {
        id: '2',
        tutorId: 'tutor2',
        tutorName: 'Bob Smith',
        title: 'React Component Templates',
        description: '20+ reusable React components with Tailwind styling. Save hours of development time!',
        category: 'code',
        price: 150,
        previewImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        fileSize: 5.2,
        downloads: 89,
        rating: 4.9,
        reviews: 15,
        tags: ['React', 'TypeScript', 'Tailwind'],
        createdAt: new Date('2024-02-01'),
    },
    {
        id: '3',
        tutorId: 'tutor3',
        tutorName: 'Carol Davis',
        title: 'Calculus Formula Sheet',
        description: 'All essential calculus formulas in one handy PDF. Great for quick revision!',
        category: 'notes',
        price: 0,
        previewImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        fileSize: 0.8,
        downloads: 512,
        rating: 4.7,
        reviews: 63,
        tags: ['Calculus', 'Math', 'Free'],
        createdAt: new Date('2023-12-10'),
    },
    {
        id: '4',
        tutorId: 'tutor4',
        tutorName: 'David Lee',
        title: 'UI/UX Design Toolkit',
        description: 'Figma components, icons, and templates for modern web design. Commercial license included!',
        category: 'toolkit',
        price: 200,
        previewImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        fileSize: 12.5,
        downloads: 67,
        rating: 5.0,
        reviews: 12,
        tags: ['Figma', 'Design', 'UI/UX'],
        createdAt: new Date('2024-01-20'),
    },
    {
        id: '5',
        tutorId: 'tutor5',
        tutorName: 'Emma Wilson',
        title: 'Data Structures Cheat Sheet',
        description: 'Visual guide to all major data structures with time/space complexity analysis.',
        category: 'guide',
        price: 75,
        previewImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
        fileSize: 1.8,
        downloads: 201,
        rating: 4.6,
        reviews: 41,
        tags: ['DSA', 'Algorithms', 'CS'],
        createdAt: new Date('2024-02-05'),
    },
    {
        id: '6',
        tutorId: 'tutor6',
        tutorName: 'Frank Chen',
        title: 'Machine Learning Code Samples',
        description: 'Python notebooks with ML algorithms implemented from scratch (Linear Regression, KNN, SVM, etc.)',
        category: 'code',
        price: 100,
        previewImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
        fileSize: 8.3,
        downloads: 95,
        rating: 4.8,
        reviews: 19,
        tags: ['ML', 'Python', 'AI'],
        createdAt: new Date('2024-01-25'),
    },
];

interface ResourceCardProps {
    resource: Resource;
    onDownload: (resource: Resource) => void;
}

function ResourceCard({ resource, onDownload }: ResourceCardProps) {
    return (
        <div className="card overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer">
            {/* Preview Image */}
            <div className="relative h-48 bg-gray-200">
                <img
                    src={resource.previewImage}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                />
                {resource.price === 0 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        FREE
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title and Creator */}
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                    {resource.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">by {resource.tutorName}</p>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {resource.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Rating and Downloads */}
                <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{resource.rating}</span>
                        <span>({resource.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Download size={16} />
                        <span>{resource.downloads} downloads</span>
                    </div>
                </div>

                {/* Price and Download Button */}
                <div className="flex items-center justify-between">
                    {resource.price === 0 ? (
                        <span className="text-green-600 font-bold">Free</span>
                    ) : (
                        <span className="text-2xl font-bold text-gray-900">₹{resource.price}</span>
                    )}
                    <button
                        onClick={() => onDownload(resource)}
                        className="btn-primary"
                    >
                        {resource.price === 0 ? 'Download' : 'Buy Now'}
                    </button>
                </div>

                {/* File Size */}
                <p className="text-xs text-gray-500 mt-2">File size: {resource.fileSize} MB</p>
            </div>
        </div>
    );
}

export default function Marketplace() {
    const [resources] = useState<Resource[]>(MOCK_RESOURCES);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('popular');

    const categories = ['all', 'notes', 'code', 'template', 'toolkit', 'guide'];

    const handleDownload = (resource: Resource) => {
        if (resource.price === 0) {
            alert(`Downloading "${resource.title}"... (Mock implementation)`);
        } else {
            alert(`Purchase flow for "${resource.title}" - ₹${resource.price}\n(Payment integration coming soon!)`);
        }
    };

    // Filter and sort resources
    const filteredResources = resources
        .filter(r => selectedCategory === 'all' || r.category === selectedCategory)
        .sort((a, b) => {
            if (sortBy === 'popular') return b.downloads - a.downloads;
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <ShoppingBag size={40} className="text-primary-600" />
                        Resource Marketplace
                    </h1>
                    <p className="text-gray-600">
                        Discover notes, templates, and toolkits created by top tutors
                    </p>
                </div>

                {/* Filters */}
                <div className="card p-4 mb-6 flex flex-wrap items-center gap-4">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-600" />
                        <span className="font-medium text-gray-700">Category:</span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="ml-auto flex items-center gap-2">
                        <span className="font-medium text-gray-700">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="popular">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <p className="text-sm text-gray-600 mb-4">
                    Showing {filteredResources.length} resources
                </p>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>

                {/* Upload Resource CTA */}
                <div className="mt-12 card-glass p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Share Your Knowledge
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Upload your own resources and earn from every download!
                    </p>
                    <button className="btn-primary">
                        Upload Resource
                    </button>
                </div>
            </div>
        </div>
    );
}
