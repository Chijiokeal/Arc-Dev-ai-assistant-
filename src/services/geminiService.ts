import { CHAT_SYSTEM_PROMPT } from "../constants";

export async function sendMessage(
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[] = [],
  retries = 2
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: CHAT_SYSTEM_PROMPT }]
          },
          contents: [
            ...history.map(item => ({ role: item.role, parts: item.parts })),
            { role: "user", parts: [{ text: message }] }
          ],
          generationConfig: { temperature: 0.7 }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data.error));
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
  } catch (error: any) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sendMessage(message, history, retries - 1);
    }
    throw error;
  }
}
