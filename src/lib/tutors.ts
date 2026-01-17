import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Tutor } from '@/types';

// Fetch all tutors (users with skills)
export async function fetchAllTutors(): Promise<Tutor[]> {
    try {
        // Fetch ALL users from Firestore
        const usersSnapshot = await getDocs(collection(db, 'users'));

        const tutors: Tutor[] = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || 'Unknown',
                university: data.university || 'Unknown University',
                skills: data.skills || [], // Show even if no skills
                rating: data.rating || 4.5,
                photoURL: data.photoURL,
                bio: data.bio,
                hourlyRate: data.hourlyRate || 50,
            };
        });

        return tutors;
    } catch (error) {
        console.error('Error fetching tutors:', error);
        return [];
    }
}

// Fetch specific tutor by ID
export async function fetchTutorById(tutorId: string): Promise<Tutor | null> {
    try {
        const tutors = await fetchAllTutors();
        return tutors.find(t => t.id === tutorId) || null;
    } catch (error) {
        console.error('Error fetching tutor:', error);
        return null;
    }
}
