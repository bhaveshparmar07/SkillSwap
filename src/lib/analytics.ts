import { logEvent as firebaseLogEvent } from 'firebase/analytics';
import { analytics } from './firebase';

/**
 * Track custom events with Google Analytics
 */
export function logEvent(eventName: string, params?: Record<string, any>) {
    if (!analytics) {
        console.log('[Analytics]', eventName, params);
        return;
    }

    firebaseLogEvent(analytics, eventName, params);
}

/**
 * Track page views
 */
export function logPageView(pageName: string, pagePath: string) {
    logEvent('page_view', {
        page_path: pagePath,
        page_title: pageName,
    });
}

/**
 * Track tutor search events
 */
export function logTutorSearch(searchQuery: string, resultsCount: number) {
    logEvent('search', {
        search_term: searchQuery,
        results_count: resultsCount,
    });
}

/**
 * Track session start events
 */
export function logSessionStart(sessionId: string, location: string) {
    logEvent('session_start', {
        session_id: sessionId,
        location,
    });
}

/**
 * Track session completion
 */
export function logSessionComplete(
    sessionId: string,
    duration: number,
    skillCoinsPaid: number
) {
    logEvent('session_complete', {
        session_id: sessionId,
        duration_minutes: Math.round(duration / 60),
        coins_paid: skillCoinsPaid,
    });
}

/**
 * Track verification attempts
 */
export function logVerificationAttempt(success: boolean) {
    logEvent('verification_attempt', {
        success,
    });
}

/**
 * Track coin transactions
 */
export function logCoinTransaction(
    type: 'earned' | 'spent' | 'bonus',
    amount: number
) {
    logEvent('coin_transaction', {
        transaction_type: type,
        amount,
    });
}

/**
 * Track login events
 */
export function logLogin(method: 'google' | 'email' | 'student_id') {
    logEvent('login', {
        method,
    });
}

/**
 * Track signup events
 */
export function logSignup(method: 'google' | 'email') {
    logEvent('sign_up', {
        method,
    });
}

/**
 * Track tutor request events
 */
export function logTutorRequest(tutorId: string, subject: string) {
    logEvent('tutor_request', {
        tutor_id: tutorId,
        subject,
    });
}
