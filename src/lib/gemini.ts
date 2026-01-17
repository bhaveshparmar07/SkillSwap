import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Tutor, MatchRequest, MatchResponse } from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

/**
 * Use Gemini AI to match tutors based on problem description
 */
export async function matchTutorsWithAI(
    problem: string,
    availableTutors: Tutor[]
): Promise<MatchResponse> {
    try {
        const prompt = `
You are an intelligent tutor matching system for a student peer-learning platform.

Given the following problem description:
"${problem}"

And these available tutors with their skills:
${availableTutors.map((t, idx) => `${idx + 1}. ${t.name} - Skills: ${t.skills.join(', ')}`).join('\n')}

Task:
1. Analyze the problem and identify the subject/skill area needed
2. Rank the tutors from most to least suitable (1 being best match)
3. Provide a confidence score (0-100) for the overall matching

Respond ONLY in this JSON format:
{
  "rankedTutorIds": ["tutor1_id", "tutor2_id", ...],
  "confidence": 85,
  "reasoning": "Brief explanation of why top tutor is best match"
}
`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Parse the AI response
        const parsedResponse = JSON.parse(response);

        // Reorder tutors based on AI ranking
        const rankedTutors = parsedResponse.rankedTutorIds
            .map((id: string) => availableTutors.find(t => t.id === id))
            .filter(Boolean) as Tutor[];

        return {
            tutors: rankedTutors,
            confidence: parsedResponse.confidence / 100,
        };
    } catch (error) {
        console.error('Gemini AI matching error:', error);

        // Fallback to simple keyword matching
        return fallbackMatching(problem, availableTutors);
    }
}

/**
 * Fallback matching using simple keyword search
 */
function fallbackMatching(problem: string, tutors: Tutor[]): MatchResponse {
    const keywords = problem.toLowerCase().split(' ');

    const scoredTutors = tutors.map(tutor => {
        const skillsText = tutor.skills.join(' ').toLowerCase();
        const score = keywords.reduce((acc, keyword) => {
            return acc + (skillsText.includes(keyword) ? 1 : 0);
        }, 0);

        return { tutor, score };
    });

    // Sort by score descending
    scoredTutors.sort((a, b) => b.score - a.score);

    return {
        tutors: scoredTutors.map(st => st.tutor),
        confidence: scoredTutors[0]?.score > 0 ? 0.6 : 0.3,
    };
}

/**
 * Generate conversational AI response for help requests
 */
export async function generateChatResponse(
    userMessage: string,
    context?: string
): Promise<string> {
    try {
        const prompt = context
            ? `Context: ${context}\n\nUser: ${userMessage}\n\nAssistant:`
            : userMessage;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Gemini chat error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

/**
 * Generate smart suggestions for improving skills or finding help
 */
export async function generateSmartSuggestions(
    userSkills: string[],
    recentProblems: string[]
): Promise<string[]> {
    try {
        const prompt = `
Based on a student's profile:
- Current skills: ${userSkills.join(', ')}
- Recent help requests: ${recentProblems.join(',) ')}

Suggest 3-5 skill areas they should learn next or tutors they might need.
Respond with a JSON array of strings: ["suggestion1", "suggestion2", ...]
`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        return JSON.parse(response);
    } catch (error) {
        console.error('Gemini suggestions error:', error);
        return [];
    }
}

export { genAI, model };
