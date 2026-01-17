import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { logLogin, logSignup } from '@/lib/analytics';
import type { User, LoginCredentials, RegisterData } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithStudentId: (credentials: LoginCredentials) => Promise<void>;
    registerStudent: (data: RegisterData) => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an  AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from Firestore
    const fetchUserProfile = async (firebaseUser: FirebaseUser): Promise<User | null> => {
        try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    uid: firebaseUser.uid,
                    studentId: userData.studentId || '',
                    name: userData.name || firebaseUser.displayName || '',
                    email: firebaseUser.email || undefined,
                    university: userData.university || '',
                    photoURL: userData.photoURL || firebaseUser.photoURL || undefined,
                    skillCoins: userData.skillCoins || 100, // Initial bonus
                    isVerified: userData.isVerified || false,
                    skills: userData.skills || [],
                    createdAt: userData.createdAt?.toDate() || new Date(),
                };
            }

            return null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userProfile = await fetchUserProfile(firebaseUser);
                setUser(userProfile);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // Check if user profile exists
            const userProfile = await fetchUserProfile(firebaseUser);

            if (!userProfile) {
                // Create new user profile
                const newUser: User = {
                    uid: firebaseUser.uid,
                    studentId: '', // Will be set during onboarding
                    name: firebaseUser.displayName || '',
                    email: firebaseUser.email || '',
                    university: '', // Will be set during onboarding
                    photoURL: firebaseUser.photoURL || undefined,
                    skillCoins: 100, // Welcome bonus
                    isVerified: false,
                    skills: [],
                    createdAt: new Date(),
                };

                await setDoc(doc(db, 'users', firebaseUser.uid), {
                    ...newUser,
                    createdAt: new Date(),
                });

                setUser(newUser);
                logSignup('google');
            } else {
                setUser(userProfile);
                logLogin('google');
            }
        } catch (error: any) {
            console.error('Google sign-in error:', error);
            throw new Error(error.message || 'Failed to sign in with Google');
        }
    };

    // Sign in with Student ID (using email/password as fallback)
    const signInWithStudentId = async ({ studentId, password }: LoginCredentials) => {
        try {
            // For now, we'll use studentId@skillswitch.local as email format
            const email = `${studentId}@skillswitch.local`;

            const result = await signInWithEmailAndPassword(auth, email, password);
            const userProfile = await fetchUserProfile(result.user);

            if (userProfile) {
                setUser(userProfile);
                logLogin('student_id');
            }
        } catch (error: any) {
            console.error('Student ID sign-in error:', error);
            throw new Error('Invalid student ID or password');
        }
    };

    // Register new student
    const registerStudent = async (data: RegisterData) => {
        try {
            // Use studentId as email format
            const email = `${data.studentId}@skillswitch.local`;

            const result = await createUserWithEmailAndPassword(auth, email, data.password);
            const firebaseUser = result.user;

            // Create user profile in Firestore
            const newUser: User = {
                uid: firebaseUser.uid,
                studentId: data.studentId,
                name: data.name,
                university: data.university,
                skillCoins: 100, // Welcome bonus
                isVerified: false,
                skills: [],
                createdAt: new Date(),
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...newUser,
                createdAt: new Date(),
            });

            setUser(newUser);
            logSignup('email');
        } catch (error: any) {
            console.error('Registration error:', error);
            if (error.code === 'auth/email-already-in-use') {
                throw new Error('This student ID is already registered');
            }
            throw new Error(error.message || 'Failed to register');
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
        } catch (error: any) {
            console.error('Sign out error:', error);
            throw new Error('Failed to sign out');
        }
    };

    // Refresh user data
    const refreshUser = async () => {
        if (auth.currentUser) {
            const userProfile = await fetchUserProfile(auth.currentUser);
            setUser(userProfile);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        signInWithGoogle,
        signInWithStudentId,
        registerStudent,
        signOut,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
