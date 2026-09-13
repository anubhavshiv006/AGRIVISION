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

// Robust wrapper for Gemini API calls to handle rate limits and model deprecations
async function safeGenerateContent(aiClient, params, retries = 2) {
  const fallbackModels = [
    "gemini-3.5-flash", 
    "gemini-3.1-pro-preview", 
    "gemini-3.6-flash", 
    "gemini-3.1-flash-lite", 
    "gemini-2.5-flash"
  ];
  
  const targetModel = params.model || fallbackModels[0];
  const modelsToTry = [targetModel, ...fallbackModels.filter(m => m !== targetModel)];
  
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    for (const model of modelsToTry) {
      try {
        console.log(`Attempting generation with model: ${model} (Attempt ${attempt + 1})`);
        const response = await aiClient.models.generateContent({
          ...params,
          model: model
        });
        return response;
      } catch (error) {
        lastError = error;
        const errMsg = error?.message || "";
        
        if (errMsg.includes("NOT_FOUND") || errMsg.includes("404") || errMsg.includes("is no longer available")) {
          console.warn(`[Fallback] Model ${model} unavailable. Trying next...`);
          continue; 
        }
        
        if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
          console.warn(`[RateLimit] Hit quota on ${model}. Switching models...`);
          continue; 
        }

        if (errMsg.includes("503") || errMsg.includes("overloaded")) {
          console.warn(`[Overload] Service overloaded. Waiting...`);
          break;
        }
        
        throw error;
      }
    }
    
    if (attempt < retries) {
       const delay = 2000 * (attempt + 1);
       console.log(`Waiting ${delay}ms before next retry cycle...`);
       await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
        ? "The user doesn't know the exact crop type. You MUST closely examine the image and identify the EXACT crop/plant species (e.g., 'Tomato Plant', 'Rice Crop', 'Apple Tree'). Include this clearly in 'detectedObject'." 
        : `The user claims this is a ${cropType} crop. Verify it, and analyze the image.`;

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
        required: ["isImageValid", "detectedObject", "invalidMessage", "possibleProblem", "diseaseStage", "severity", "confidence", "visibleSymptoms", "possibleCauses", "organicTreatments", "chemicalTreatments", "nextSteps", "preventionTips", "expertRecommendation"]
      };

      const response = await safeGenerateContent(ai, {
        model: "gemini-3.5-flash",
        contents: [imagePart, { text: prompt }],
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      let text = response.text || "{}";
      text = text.replace(/\s*```json\s*/gi, "").replace(/\s*```\s*/g, "").trim();
      
      // Attempt to extract JSON if there's text before/after
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        text = text.substring(jsonStart, jsonEnd + 1);
      }
      
      let parsed = {};
      try {
        parsed = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON Parse Error. Raw text:", text);
        // Fallback for completely broken JSON
        parsed = {
          isImageValid: false,
          detectedObject: "Unknown due to AI formatting error",
          invalidMessage: "The AI encountered an issue formatting the response. Please try again.",
          possibleProblem: "Error",
          diseaseStage: "None",
          severity: "None",
          confidence: "Low",
          visibleSymptoms: [],
          possibleCauses: [],
          organicTreatments: [],
          chemicalTreatments: [],
          nextSteps: ["Please try submitting the image again."],
          preventionTips: [],
          expertRecommendation: "System error, please retry."
        };
      }
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      let errMsg = error?.message || error?.toString() || "Failed to analyze crop image.";
      if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
        errMsg = "AI is currently very busy (Rate Limit). Please wait 30 seconds and try again.";
      } else if (errMsg.includes("{")) {
         try { errMsg = JSON.parse(errMsg).error.message; } catch (e) {}
      }
      res.status(500).json({ error: errMsg });
    }
  });

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, language } = req.body; // messages array: { role: 'user' | 'model', parts: [{ text: '...' }] }

      const langContext = language === "hi" ? 
        "Please respond in Hindi (हिंदी). Ensure the language is natural, polite, and easy to understand for an Indian farmer. You are KisanMitra, an AI Farming Agent." : 
        "Please respond in English. Ensure the language is simple and easy to understand for a farmer. You are KisanMitra, an AI Farming Agent.";

      const systemInstruction = `${langContext}
You are KisanMitra, an advanced and highly knowledgeable AI Agricultural Consultant.
Rules:
1. Empathy & Tone: Be respectful, encouraging, and highly practical. Avoid being overly robotic.
2. Context Gathering: If the farmer asks a vague question (e.g., "my plant is dying"), DO NOT guess immediately. Ask 2-3 specific, easy-to-answer questions (e.g., "Which crop is it?", "Are the leaves turning yellow or brown?", "How often do you water?").
3. Structured Answers: When providing solutions, use clear headings, bullet points, and simple language.
4. Holistic Approach: Always suggest a mix of organic/natural remedies, cultural practices (watering, spacing), and finally, safe chemical options only if necessary.
5. Safety First: Clearly communicate uncertainty. Do not provide dangerous chemical dosages without recommending they consult a local expert or read the label.
6. Formatting: Use emojis occasionally to make the text friendly and scannable.`;

      // Construct Gemini contents array. Ensure the last one is the new user prompt.
      const contents = messages.map((m: any) => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await safeGenerateContent(ai, {
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      let errMsg = error?.message || error?.toString() || "Failed to chat.";
      if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
        errMsg = "AI is currently very busy (Rate Limit). Please wait 30 seconds and try again.";
      } else if (errMsg.includes("{")) {
         try { errMsg = JSON.parse(errMsg).error.message; } catch (e) {}
      }
      res.status(500).json({ error: errMsg });
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

      const response = await safeGenerateContent(ai, {
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });
      let text = response.text || "[]";
      text = text.replace(/\s*```json\s*/gi, "").replace(/\s*```\s*/g, "").trim();
      
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        text = text.substring(jsonStart, jsonEnd + 1);
      }
      
      let parsed = [];
      try {
        parsed = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON Parse Error. Raw text:", text);
      }
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini Plan Error:", error);
      let errMsg = error?.message || error?.toString() || "Failed to generate plan.";
      if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
        errMsg = "AI is currently very busy (Rate Limit). Please wait 30 seconds and try again.";
      } else if (errMsg.includes("{")) {
         try { errMsg = JSON.parse(errMsg).error.message; } catch (e) {}
      }
      res.status(500).json({ error: errMsg });
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

  
  // Global error handler to ensure JSON responses for API routes
  app.use((err, req, res, next) => {
    console.error("Unhandled Global Error:", err);
    if (req.path.startsWith('/api/')) {
      res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    } else {
      next(err);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
