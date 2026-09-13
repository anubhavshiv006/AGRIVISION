const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/required: \["isImageValid", "detectedObject"\]/g, 'required: ["isImageValid", "detectedObject", "invalidMessage", "possibleProblem", "diseaseStage", "severity", "confidence", "visibleSymptoms", "possibleCauses", "organicTreatments", "chemicalTreatments", "nextSteps", "preventionTips", "expertRecommendation"]');

code = code.replace(
  /const cropContextPrompt = isAutoDetect \s*\n\s*\? "The user doesn't know the exact crop type\. You MUST auto-detect the specific crop species from the image\." \s*\n\s*: `Analyze the provided image of a \$\{cropType\} crop\.`;/g,
  `const cropContextPrompt = isAutoDetect \n        ? "The user doesn't know the exact crop type. You MUST closely examine the image and identify the EXACT crop/plant species (e.g., 'Tomato Plant', 'Rice Crop', 'Apple Tree'). Include this clearly in 'detectedObject'." \n        : \`The user claims this is a \${cropType} crop. Verify it, and analyze the image.\`;`
);

fs.writeFileSync('server.ts', code);
console.log('Patched schema successfully.');
