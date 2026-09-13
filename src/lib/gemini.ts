import { GoogleGenAI, Type } from '@google/genai';

// Netlify ke liye Frontend Gemini Setup
const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is missing!");
    throw new Error("API Key missing! Please add VITE_GEMINI_API_KEY in your Secrets/Environment Variables.");
  }
  return new GoogleGenAI({ apiKey });
};

async function safeGenerateContent(ai: any, params: any, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      if (i === retries - 1) throw error;
      if (error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED")) {
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; 
      } else {
        throw error;
      }
    }
  }
}

export async function analyzeCropImage(file: File, cropType: string, symptoms: string, language: string) {
  const ai = getAIClient();
  
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const imagePart = {
    inlineData: { data: base64Data, mimeType: file.type }
  };

  const langContext = language === "hi" ? "Please respond in Hindi." : "Please respond in English.";
  const prompt = `Analyze this crop image. 
  Crop Type: ${cropType || "Unknown"}
  Symptoms: ${symptoms || "None provided"}
  Task: Identify any diseases, pests, or nutrient deficiencies.
  ${langContext}`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      isImageValid: { type: Type.BOOLEAN },
      detectedObject: { type: Type.STRING },
      invalidMessage: { type: Type.STRING },
      possibleProblem: { type: Type.STRING },
      diseaseStage: { type: Type.STRING },
      severity: { type: Type.STRING },
      confidence: { type: Type.STRING },
      visibleSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
      possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
      organicTreatments: { type: Type.ARRAY, items: { type: Type.STRING } },
      chemicalTreatments: { type: Type.ARRAY, items: { type: Type.STRING } },
      nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
      preventionTips: { type: Type.ARRAY, items: { type: Type.STRING } },
      expertRecommendation: { type: Type.STRING }
    },
    required: ["isImageValid", "detectedObject", "invalidMessage", "possibleProblem", "diseaseStage", "severity", "confidence", "visibleSymptoms", "possibleCauses", "organicTreatments", "chemicalTreatments", "nextSteps", "preventionTips", "expertRecommendation"]
  };

  const response = await safeGenerateContent(ai, {
    model: "gemini-3.5-flash",
    contents: [imagePart, { text: prompt }],
    config: { responseMimeType: "application/json", responseSchema }
  });

  let text = response.text || "{}";
  text = text.replace(/\s*```json\s*/gi, "").replace(/\s*```\s*/g, "").trim();
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) text = text.substring(jsonStart, jsonEnd + 1);
  return JSON.parse(text);
}

export async function chatWithAgent(messages: any[], language: string) {
  const ai = getAIClient();
  const langContext = language === "hi" ? 
    "Please respond in Hindi (हिंदी). You are KisanMitra, an AI Farming Agent." : 
    "Please respond in English. You are KisanMitra, an AI Farming Agent.";
  
  const systemInstruction = `${langContext}
You are KisanMitra, an advanced agricultural consultant. Use emojis and clear structure.`;

  const contents = messages.map((m: any) => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const response = await safeGenerateContent(ai, {
    model: "gemini-3.5-flash",
    contents: contents,
    config: { systemInstruction }
  });

  return { text: response.text };
}

export async function generateFarmPlan(crop: string, problem: string, language: string) {
  const ai = getAIClient();
  const langContext = language === "hi" ? "Respond in Hindi." : "Respond in English.";
  const prompt = `Create a 7-day action plan for a farmer dealing with ${problem} on their ${crop} crop. Keep recommendations safe. Output format: JSON array of objects with { day: number, title: string, description: string }.
${langContext}`;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        day: { type: Type.INTEGER },
        title: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ["day", "title", "description"]
    }
  };

  const response = await safeGenerateContent(ai, {
    model: "gemini-3.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema }
  });

  let text = response.text || "[]";
  text = text.replace(/\s*```json\s*/gi, "").replace(/\s*```\s*/g, "").trim();
  const jsonStart = text.indexOf('[');
  const jsonEnd = text.lastIndexOf(']');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) text = text.substring(jsonStart, jsonEnd + 1);
  return JSON.parse(text);
}
