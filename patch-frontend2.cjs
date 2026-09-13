const fs = require('fs');
let code = fs.readFileSync('src/pages/CropDoctor.tsx', 'utf8');

const oldSuccessHandling = `      const data = await res.json();`;

const newSuccessHandling = `      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Server returned an invalid format. Please try again.");
      }
      const data = await res.json();`;

code = code.replace(oldSuccessHandling, newSuccessHandling);
fs.writeFileSync('src/pages/CropDoctor.tsx', code);
console.log('Patched frontend success JSON handling successfully.');
