const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Destructure from store
code = code.replace(
  "const { language, history, plans, addPlan, toggleTask } = useStore();",
  "const { language, history, plans, addPlan, toggleTask, setProModalOpen } = useStore();"
);

// Add onClick to Upgrade Now button
code = code.replace(
  "<button className=\"bg-white text-orange-600 px-6 py-2 rounded-xl font-bold shrink-0 hover:bg-gray-50 transition-colors shadow-sm\">",
  "<button onClick={() => setProModalOpen(true)} className=\"bg-white text-orange-600 px-6 py-2 rounded-xl font-bold shrink-0 hover:bg-gray-50 transition-colors shadow-sm\">"
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
