import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative caption for an image using Gemini Vision.
 */
export const generateImageCaption = async (base64Image: string, promptContext: string = ""): Promise<string> => {
  try {
    const prompt = `You are a social media expert. Write a catchy, engaging Instagram caption for this image. 
    Include 3-5 relevant hashtags. Keep it under 2 sentences + hashtags. 
    ${promptContext ? `Context provided by user: "${promptContext}"` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', 
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "Could not generate caption.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating caption. Please try again.";
  }
};

/**
 * Chatbot functionality for DMs (simulating an AI assistant user).
 */
export const getAIChatResponse = async (history: {role: 'user' | 'model', parts: [{text: string}]}[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: "You are Gemini, a helpful and witty AI assistant inside a social media app. Keep responses concise and friendly, like a text message.",
      }
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "I'm speechless!";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I'm having trouble connecting right now.";
  }
};

/**
 * Moderate text content.
 */
export const moderateContent = async (text: string): Promise<boolean> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Is the following text offensive, hate speech, or highly inappropriate? Answer only "YES" or "NO". Text: "${text}"`
        });
        return response.text?.trim().toUpperCase().includes("YES") ?? false;
    } catch (e) {
        return false; // Fail open if API fails
    }
}
