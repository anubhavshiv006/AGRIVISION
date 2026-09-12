import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const base64EncodeString = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
async function run() {
  const imagePart = { inlineData: { mimeType: "image/png", data: base64EncodeString } };
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [imagePart, { text: "What is this?" }],
    });
    console.log("SUCCESS");
  } catch (err) {
    console.error("error:", err.message);
  }
}
run();
