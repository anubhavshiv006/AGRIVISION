const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
code = code.replace(
  "const Market = lazy(() => import('./pages/Market'));",
  "const Market = lazy(() => import('./pages/Market'));\nconst Consultant = lazy(() => import('./pages/Consultant'));"
);

// Add Route
code = code.replace(
  "<Route path=\"/market\" element={<Market />} />",
  "<Route path=\"/market\" element={<Market />} />\n                <Route path=\"/consult\" element={<Consultant />} />"
);

fs.writeFileSync('src/App.tsx', code);
