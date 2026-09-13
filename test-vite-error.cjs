const express = require('express');
const { createServer } = require('vite');

async function run() {
  const app = express();
  
  app.post('/api/error', (req, res, next) => {
    next(new Error("Test Error")); // Unhandled error
  });
  
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
  
  app.listen(3001, async () => {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch('http://localhost:3001/api/error', { method: 'POST' });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Text starts with:", text.substring(0, 50));
    process.exit(0);
  });
}
run();
