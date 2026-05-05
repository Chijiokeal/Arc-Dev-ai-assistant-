import { GoogleGenAI } from "@google/genai";
import { CHAT_SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ""
});

export async function sendMessage(
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[] = [],
  retries = 2
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-8b",
      contents: [
        ...history.map(item => ({ role: item.role, parts: item.parts })),
        { role: "user", parts: [{ text: message }] },
      ],
      config: {
        systemInstruction: CHAT_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);

    const isTransient =
      error?.message?.includes("xhr error") ||
      error?.status === "UNKNOWN" ||
      error?.code === 500;

    if (retries > 0 && isTransient) {
      console.log(`Retrying... attempts left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sendMessage(message, history, retries - 1);
    }

    if (error?.message?.includes("xhr error")) {
      throw new Error(
        "Network connection to AI Assistant failed. This might be a temporary service issue. Please try again in a few moments."
      );
    }

    throw error;
  }
}
