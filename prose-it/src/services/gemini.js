import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateProse = async (emotions) => {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  // Filter out low probability emotions to reduce noise
  const significantEmotions = Object.entries(emotions)
    .filter(([_, score]) => score > 0.1) // Only keep if > 10%
    .map(([emotion, score]) => `${emotion} (${(score * 100).toFixed(0)}%)`)
    .join(", ");

  const prompt = `
    You are a helpful creative writing assistant.
    I am acting out a scene. My facial expression analysis shows: ${significantEmotions}.
    
    Write a short, intense paragraph describing a character with this expression. 
    Focus on physical descriptions (eyes, mouth, tension) and the internal feeling. 
    Show, don't tell. Do not use the names of the emotions directly.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error talking to Gemini:", error);
    return "Error generating prose. Please try again.";
  }
};