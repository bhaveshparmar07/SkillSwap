// User & Authentication Types
export interface User {
    uid: string;
    studentId: string;
    name: string;
    email?: string;
    university: string;
    photoURL?: string;
    skillCoins: number;
    isVerified: boolean;
    skills: string[];
    bio?: string; // User biography/description
    createdAt: Date;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    studentId: string;
    password: string;
}

export interface RegisterData {
    name: string;
    studentId: string;
    university: string;
    password: string;
    skills?: string[];
}

// Tutor & Matching Types
export interface Tutor {
    id: string;
    name: string;
    university: string;
    skills: string[];
    rating?: number;
    photoURL?: string;
    bio?: string;
    hourlyRate?: number; // in SkillCoins
}

export interface MatchRequest {
    problem: string;
    subject?: string;
}

export interface MatchResponse {
    tutors: Tutor[];
    confidence: number;
}

// Help Request & Session Types
export interface HelpRequest {
    id: string;
    studentId: string;
    tutorId: string;
    problem: string;
    status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
    skillCoinsOffered: number;
    createdAt: Date;
    updatedAt: Date;
    location?: SafeZone;
}

export interface Session {
    id: string;
    requestId: string;
    studentId: string;
    tutorId: string;
    startTime: Date;
    endTime?: Date;
    location: SafeZone;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    skillCoinsPaid?: number;
}

// Safe Zone & Location Types
export interface SafeZone {
    id: string;
    name: string;
    description: string;
    location: {
        lat: number;
        lng: number;
    };
    radius: number; // in meters (default 100m)
    type: 'library' | 'cafe' | 'study_hall' | 'campus' | 'other';
    openHours?: {
        open: string;  // "09:00"
        close: string; // "22:00"
    };
}

export interface UserLocation {
    lat: number;
    lng: number;
    accuracy?: number;
}

// Verification Types
export interface VerificationStatus {
    isVerified: boolean;
    verifiedAt?: Date;
    studentIdImageURL?: string;
    extractedData?: {
        name?: string;
        studentId?: string;
        university?: string;
    };
}

export interface VerifyIDRequest {
    image: File;
}

export interface VerifyIDResponse {
    success: boolean;
    verified: boolean;
    extractedData?: {
        name: string;
        studentId: string;
        university?: string;
    };
    message?: string;
}

// Transaction Types
export interface Transaction {
    id: string;
    userId: string;
    type: 'earned' | 'spent' | 'bonus';
    amount: number;
    description: string;
    sessionId?: string;
    createdAt: Date;
}

// Notification Types
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: Date;
    actionUrl?: string;
}

// Review & Rating Types
export interface Review {
    id: string;
    reviewerId: string;
    reviewerName: string;
    reviewerPhoto?: string;
    revieweeId: string;
    sessionId: string;
    type: 'tutor' | 'student';
    rating: number; // 1-5 stars
    comment: string;
    tags: string[]; // ['patient', 'clear', 'helpful']
    createdAt: Date;
    helpful: number; // count of helpful votes
}

// Resource Marketplace Types
export interface Resource {
    id: string;
    tutorId: string;
    tutorName: string;
    title: string;
    description: string;
    category: 'notes' | 'template' | 'toolkit' | 'guide' | 'code';
    price: number; // in INR or 0 for free
    previewImage: string;
    fileSize: number;
    downloads: number;
    rating: number;
    reviews: number;
    tags: string[];
    createdAt: Date;
}

// Pricing & Transaction Types
export interface PricingBreakdown {
    hourlyRate: number;
    estimatedHours: number;
    subtotal: number;
    platformFee: number;
    platformFeePercentage: number;
    total: number;
    tutorReceives: number;
}

// Affiliate Tool Types
export interface AffiliateTool {
    id: string;
    name: string;
    description: string;
    logoURL: string;
    category: 'design' | 'writing' | 'coding' | 'productivity';
    affiliateLink: string;
    bonus: number; // SkillCoins bonus
}

