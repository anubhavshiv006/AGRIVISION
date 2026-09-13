const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Increase limit
code = code.replace(/app\.use\(express\.json\(\)\);/g, 'app.use(express.json({ limit: "50mb" }));\n  app.use(express.urlencoded({ limit: "50mb", extended: true }));');

// Add global error handler before app.listen
code = code.replace(/app\.listen\(PORT, "0\.0\.0\.0", \(\) => \{/g, `
  // Global error handler to ensure JSON responses for API routes
  app.use((err, req, res, next) => {
    console.error("Unhandled Global Error:", err);
    if (req.path.startsWith('/api/')) {
      res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    } else {
      next(err);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {`);

fs.writeFileSync('server.ts', code);
console.log('Patched express limits and error handler.');
