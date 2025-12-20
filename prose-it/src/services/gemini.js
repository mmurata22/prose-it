import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateProse = async (emotions, pronouns, style) => {
  // Use "gemini-flash-latest" or "gemini-1.5-flash"
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const significantEmotions = Object.entries(emotions)
    .filter(([_, score]) => score > 0.05) 
    .map(([emotion, score]) => `${emotion} (${(score * 100).toFixed(0)}%)`)
    .join(", ");

  const prompt = `
    You are a fiction writer for a best-selling modern novel.
    
    CONTEXT:
    The character uses pronouns: "${pronouns}".
    The genre is: "${style}".
    The detected expression is: ${significantEmotions}.
    
    TASK:
    Write a short, punchy paragraph describing this moment.
    
    RULES FOR WRITING:
    1. **Keep it simple.** Use 8th-grade reading level. No complex, "academic" words.
    2. **Be direct.** Focus on what is happening right now.
    3. **Show, don't tell.** Describe the face and the vibe, but keep it grounded.
    4. If the style is "Screenplay", use standard script format.
    5. Avoid flowery adjectives. Make it sound real and raw.
    6. Don't assume a pre-existing scenario. Simply use the expression given and write around that.
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