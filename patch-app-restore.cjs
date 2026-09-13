const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("import { auth } from './lib/firebase';", "import { auth } from './lib/firebase';\nimport { AnimatePresence, motion } from 'motion/react';");
code = code.replace(/<Routes location=\{location\} key=\{location.pathname\}>/, '<AnimatePresence mode="wait">\n      <Routes location={location} key={location.pathname}>');
code = code.replace(/<\/Routes>/, '</Routes>\n    </AnimatePresence>');
code = code.replace(/<div>/g, '<motion.div\n    initial={{ opacity: 0, y: 10 }}\n    animate={{ opacity: 1, y: 0 }}\n    exit={{ opacity: 0, y: -10 }}\n    transition={{ duration: 0.3 }}\n  >');
code = code.replace(/<\/div>/g, '</motion.div>');
// Wait, I messed up the replacement. Let me just rewrite App.tsx.
