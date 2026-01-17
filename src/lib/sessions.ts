import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export interface SessionRequest {
    id?: string;
    studentId: string;
    studentName: string;
    tutorId: string;
    tutorName: string;
    skill: string;
    problem: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    skillCoinsOffered: number;
    createdAt: Date;
    updatedAt: Date;
}

// Create a tutoring session request
export async function createSessionRequest(data: Omit<SessionRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    try {
        const sessionData = {
            ...data,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const docRef = await addDoc(collection(db, 'sessions'), sessionData);
        return docRef.id;
    } catch (error) {
        console.error('Error creating session request:', error);
        throw error;
    }
}

// Get pending requests for a tutor
export async function getPendingRequests(tutorId: string): Promise<SessionRequest[]> {
    try {
        const q = query(
            collection(db, 'sessions'),
            where('tutorId', '==', tutorId),
            where('status', '==', 'pending')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        })) as SessionRequest[];
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        return [];
    }
}

// Get all requests (sent and received) for a user
export async function getAllUserSessions(userId: string): Promise<SessionRequest[]> {
    try {
        // Get sessions where user is student
        const studentQuery = query(
            collection(db, 'sessions'),
            where('studentId', '==', userId)
        );

        // Get sessions where user is tutor
        const tutorQuery = query(
            collection(db, 'sessions'),
            where('tutorId', '==', userId)
        );

        const [studentSnapshot, tutorSnapshot] = await Promise.all([
            getDocs(studentQuery),
            getDocs(tutorQuery),
        ]);

        const studentSessions = studentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        })) as SessionRequest[];

        const tutorSessions = tutorSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        })) as SessionRequest[];

        return [...studentSessions, ...tutorSessions];
    } catch (error) {
        console.error('Error fetching user sessions:', error);
        return [];
    }
}

// Update session status (accept/reject/complete)
export async function updateSessionStatus(
    sessionId: string,
    status: SessionRequest['status']
): Promise<void> {
    try {
        const sessionRef = doc(db, 'sessions', sessionId);
        await updateDoc(sessionRef, {
            status,
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error('Error updating session status:', error);
        throw error;
    }
}

// Complete session and transfer SkillCoins
export async function completeSession(
    sessionId: string,
    studentId: string,
    tutorId: string,
    skillCoinsAmount: number
): Promise<void> {
    try {
        // Import increment for atomic operations
        const { increment } = await import('firebase/firestore');

        // Update session status
        await updateSessionStatus(sessionId, 'completed');

        // Deduct coins from student (atomic operation)
        const studentRef = doc(db, 'users', studentId);
        await updateDoc(studentRef, {
            skillCoins: increment(-skillCoinsAmount),
        });

        // Add coins to tutor (atomic operation)
        const tutorRef = doc(db, 'users', tutorId);
        await updateDoc(tutorRef, {
            skillCoins: increment(skillCoinsAmount),
        });
    } catch (error) {
        console.error('Error completing session:', error);
        throw error;
    }
}
