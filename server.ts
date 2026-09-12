import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/gemini/analyze-crop", upload.single("image"), async (req, res) => {
    try {
      const { cropType, symptoms, language } = req.body;
      const file = (req as any).file;

      if (!file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const imagePart = {
        inlineData: {
          mimeType: file.mimetype,
          data: file.buffer.toString("base64"),
        },
      };

      const langContext = language === "hi" ? 
        "Please respond in Hindi (हिंदी). Ensure the language is natural and easy to understand for an Indian farmer." : 
        "Please respond in English. Ensure the language is simple and easy to understand for a farmer.";

      const isAutoDetect = cropType === 'Auto Detect (AI)' || cropType === 'स्वत: पहचान (AI)';
      const cropContextPrompt = isAutoDetect 
        ? "The user doesn't know the exact crop type. You MUST auto-detect the specific crop species from the image." 
        : `Analyze the provided image of a ${cropType} crop.`;

      const prompt = `You are an expert AI Crop Doctor (KisanMitra). ${cropContextPrompt}
The user has reported the following symptoms (if any): ${symptoms || "None reported"}.

First, strictly detect what is actually in the image. 
- Is it a crop, a leaf, a stem, a fruit, or a field?
- Or is it something completely unrelated (like a human face/selfie, an animal, a car, furniture, a random object), or too dark/blurry?

If the image is NOT of a plant/crop, you MUST set "isImageValid" to false, identify what it is in "detectedObject", and set "invalidMessage" explaining that you detected a [detectedObject] and the user needs to upload a clear photo of a crop, leaf, or fruit.

If it IS a valid crop image, set "isImageValid" to true and analyze it deeply for diseases, pests, or nutrient deficiencies.
Identify the "detectedObject" (e.g., "Tomato Leaf", "Wheat Field", "Mango Fruit").
Provide an assessment of the "severity" (Low, Medium, High).
Respond with structured data.

IMPORTANT SAFETY BEHAVIOR:
- Do NOT make the AI claim that a disease diagnosis is certain. Use words like "Possible", "Likely", "Suspected".
- If you are not confident, set confidence to "Low" and explicitly state that the image is not clear enough.
- Do not provide unsafe or blindly confident pesticide/chemical dosage instructions. Recommend general safe practices and consulting a local expert.

${langContext}`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          isImageValid: { type: Type.BOOLEAN, description: "True if the image is a valid, analyzable crop/plant image. False if unrelated (e.g., selfie, car, animal), too dark, or too blurry." },
          detectedObject: { type: Type.STRING, description: "What exactly did the AI detect in the image? e.g., 'Human face', 'Car', 'Tomato Leaf', 'Wheat Field', 'Mango Fruit'." },
          invalidMessage: { type: Type.STRING, description: "Helpful message if the image is invalid, explaining what was detected and how to take a better picture of a crop." },
          possibleProblem: { type: Type.STRING, description: "The suspected disease, pest, or condition. If healthy, state 'Appears Healthy'." },
          diseaseStage: { type: Type.STRING, description: "Estimated stage of the disease/pest attack. One of: 'Early Stage', 'Mid Stage', 'Advanced Stage', 'None' (if healthy)." },
          severity: { type: Type.STRING, description: "The severity of the problem. One of: 'None', 'Low', 'Medium', 'High'" },
          confidence: { type: Type.STRING, description: "One of: 'High', 'Moderate', 'Low'" },
          visibleSymptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of symptoms observed in the image." },
          possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of possible causes for these symptoms." },
          organicTreatments: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of organic, natural, and cultural treatments or immediate actions to stop the spread." },
          chemicalTreatments: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of safe chemical treatments or fertilizers (generic names, not brands), with a warning to consult experts." },
          nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "General safe next steps for the farmer." },
          preventionTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tips to prevent this in the future." },
          expertRecommendation: { type: Type.STRING, description: "When and why to consult an agricultural expert." }
        },
        required: ["isImageValid", "detectedObject"]
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [imagePart, { text: prompt }],
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      let text = response.text || "{}";
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || error?.toString() || "Failed to analyze crop image." });
    }
  });

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, language } = req.body; // messages array: { role: 'user' | 'model', parts: [{ text: '...' }] }

      const langContext = language === "hi" ? 
        "Please respond in Hindi (हिंदी). Ensure the language is natural, polite, and easy to understand for an Indian farmer. You are KisanMitra, an AI Farming Agent." : 
        "Please respond in English. Ensure the language is simple and easy to understand for a farmer. You are KisanMitra, an AI Farming Agent.";

      const systemInstruction = `${langContext}
You are a helpful conversational AI assistant for farmers. You should ask useful follow-up questions instead of immediately guessing a problem if you don't have enough context.
For example, ask about crop type, age, symptoms, when it started, extent of damage, location, or recent weather.
When you have enough info, generate a structured response with: What I Understand, Possible Causes, What You Can Check, Recommended Next Steps, What to Monitor, When to Contact an Expert.
Clearly communicate uncertainty. Do not provide dangerous chemical dosages without expert consultation.`;

      // Construct Gemini contents array. Ensure the last one is the new user prompt.
      const contents = messages.map((m: any) => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || error?.toString() || "Failed to chat." });
    }
  });

  app.post("/api/gemini/generate-plan", async (req, res) => {
    try {
      const { crop, problem, language } = req.body;
      const langContext = language === "hi" ? "Respond in Hindi." : "Respond in English.";
      const prompt = `Create a 7-day action plan for a farmer dealing with ${problem} on their ${crop} crop. Keep recommendations general and safe. 
Output format: JSON array of objects with { day: number, title: string, description: string }.
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

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });
      let text = response.text || "[]";
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Gemini Plan Error:", error);
      res.status(500).json({ error: error?.message || error?.toString() || "Failed to generate plan." });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
