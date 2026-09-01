const fs = require('fs');
let code = fs.readFileSync('src/pages/Market.tsx', 'utf8');

code = code.replace(
  "useState<'suggestions' | 'online' | 'nearby' | 'prices'>",
  "useState<'suggestions' | 'online' | 'nearby' | 'prices' | 'rentals'>"
);

fs.writeFileSync('src/pages/Market.tsx', code);
