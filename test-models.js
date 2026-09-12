import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello"
    });
    console.log("2.5-flash works");
  } catch(e) { console.log("2.5-flash error", e.message); }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Hello"
    });
    console.log("2.0-flash works");
  } catch(e) { console.log("2.0-flash error", e.message); }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hello"
    });
    console.log("1.5-flash works");
  } catch(e) { console.log("1.5-flash error", e.message); }
}
run();
