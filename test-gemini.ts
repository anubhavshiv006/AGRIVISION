import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "hello"
    });
    console.log("Success:", response.text);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}
run();
