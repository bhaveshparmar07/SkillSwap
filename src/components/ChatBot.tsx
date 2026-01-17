import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const SYSTEM_CONTEXT = `You are SkillSwap Support Bot, a helpful AI assistant for the SkillSwap platform - a peer-to-peer tutoring marketplace for students.

Key Features of SkillSwap:
1. **Find Help**: Students can search for tutors by subject/skill using AI-powered matching
2. **SkillCoins**: Platform currency for booking sessions (1 coin = 1 hour of tutoring)
3. **Safe Zones**: Map showing verified safe locations (colleges in Ahmedabad) for in-person tutoring
4. **Marketplace**: Buy/sell digital resources (notes, templates, code) created by tutors
5. **Tools**: Get discounts on student tools (Canva, Grammarly, GitHub Copilot) + earn SkillCoins
6. **Reviews**: Rate tutors and students after sessions
7. **Profile**: Customize your profile, add skills, manage your student info

How it Works:
- Students earn SkillCoins by teaching others
- Spend coins to get help from expert tutors
- Platform takes 12.5% transaction fee on paid sessions
- All sessions must be at verified Safe Zones for safety

Be helpful, concise, and friendly. Answer questions about how to use the platform, features, safety, and coins.`;

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hi! 👋 I\'m your SkillSwap Support Bot. How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);

    // Initialize Gemini AI
    useEffect(() => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (apiKey && apiKey !== 'your_gemini_api_key_here') {
            setGenAI(new GoogleGenerativeAI(apiKey));
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!genAI) {
                // Fallback response if API key not configured
                const fallbackMessage: Message = {
                    role: 'assistant',
                    content: 'I\'m currently not connected to the AI service. Please make sure the Gemini API key is configured in your .env file.',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, fallbackMessage]);
                setIsLoading(false);
                return;
            }

            // Get Gemini response
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            // Build conversation history for context
            const conversationHistory = messages
                .slice(-5) // Last 5 messages for context
                .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
                .join('\n');

            const prompt = `${SYSTEM_CONTEXT}

Recent Conversation:
${conversationHistory}

User: ${input}

Assistant:`; // The AI will complete this

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const assistantMessage: Message = {
                role: 'assistant',
                content: text,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Oops! Something went wrong. Please try again later.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chatbot Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
                        <div className="flex items-center">
                            <Bot size={20} className="mr-2" />
                            <h3 className="text-lg font-semibold">SkillSwap Support</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200" aria-label="Close Chatbot">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] p-3 rounded-lg shadow-sm text-sm ${msg.role === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                    <span className="block text-xs mt-1 opacity-75">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="max-w-[75%] p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 rounded-bl-none text-sm">
                                    <Loader size={20} className="animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 bg-white flex items-center">
                        <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!input.trim() || isLoading}
                            aria-label="Send message"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
