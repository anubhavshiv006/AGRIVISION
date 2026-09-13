const fs = require('fs');
let code = fs.readFileSync('src/pages/CropDoctor.tsx', 'utf8');

const oldErrorHandling = `      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to analyze image');
      }`;

const newErrorHandling = `      if (!res.ok) {
        let errorMsg = 'Failed to analyze image';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMsg = errorData.error || errorMsg;
          } else {
            const text = await res.text();
            console.error("Non-JSON error response:", text);
            if (res.status === 413) errorMsg = 'Image file is too large. Please upload a smaller image.';
            else errorMsg = \`Server error (\${res.status}). Please try again later.\`;
          }
        } catch (e) {}
        throw new Error(errorMsg);
      }`;

code = code.replace(oldErrorHandling, newErrorHandling);
fs.writeFileSync('src/pages/CropDoctor.tsx', code);
console.log('Patched frontend error handling successfully.');
