const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/import \{ AnimatePresence, motion \} from 'motion\/react';/g, '');
code = code.replace(/<AnimatePresence mode="wait">/g, '');
code = code.replace(/<\/AnimatePresence>/g, '');
code = code.replace(/<motion\.div[^>]*>/g, '<div>');
code = code.replace(/<\/motion\.div>/g, '</div>');
fs.writeFileSync('src/App.tsx', code);
