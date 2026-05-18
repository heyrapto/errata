import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY environment variable is missing.');
}

// Initialise the Gemini AI SDK
export const genAI = new GoogleGenerativeAI(apiKey);

// Default model is Gemini 1.5 Flash as per specs (Fast & Free tier)
export const getGeminiModel = (modelName: string = 'gemini-1.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};
