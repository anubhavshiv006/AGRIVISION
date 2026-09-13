const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const helper = `
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
        console.log(\`Attempting generation with model: \${model} (Attempt \${attempt + 1})\`);
        const response = await aiClient.models.generateContent({
          ...params,
          model: model
        });
        return response;
      } catch (error) {
        lastError = error;
        const errMsg = error?.message || "";
        
        if (errMsg.includes("NOT_FOUND") || errMsg.includes("404") || errMsg.includes("is no longer available")) {
          console.warn(\`[Fallback] Model \${model} unavailable. Trying next...\`);
          continue; 
        }
        
        if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
          console.warn(\`[RateLimit] Hit quota on \${model}. Switching models...\`);
          continue; 
        }

        if (errMsg.includes("503") || errMsg.includes("overloaded")) {
          console.warn(\`[Overload] Service overloaded. Waiting...\`);
          break;
        }
        
        throw error;
      }
    }
    
    if (attempt < retries) {
       const delay = 2000 * (attempt + 1);
       console.log(\`Waiting \${delay}ms before next retry cycle...\`);
       await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
`;

// Insert the helper right after the multer initialization
code = code.replace(/const upload = multer\(\{ storage: multer.memoryStorage\(\) \}\);/g, "const upload = multer({ storage: multer.memoryStorage() });\n" + helper);

// Replace ai.models.generateContent with safeGenerateContent(ai, ...)
code = code.replace(/await ai\.models\.generateContent\(\{/g, "await safeGenerateContent(ai, {");

fs.writeFileSync('server.ts', code);
console.log('Patched server.ts successfully.');
