const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /let text = response\.text \|\| "\{\}";\s*\n\s*text = text\.replace\(\/```json\/gi, ""\)\.replace\(\/```\/g, ""\)\.trim\(\);\s*\n\s*res\.json\(JSON\.parse\(text\)\);/g,
  `let text = response.text || "{}";
      text = text.replace(/\\s*\`\`\`json\\s*/gi, "").replace(/\\s*\`\`\`\\s*/g, "").trim();
      
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
      res.json(parsed);`
);

fs.writeFileSync('server.ts', code);
console.log('Patched json parsing successfully.');
