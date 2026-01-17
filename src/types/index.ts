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
    skills?: string[];
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
