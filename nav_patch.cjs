const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Add import
code = code.replace(
  "import { AuthModal } from './AuthModal';",
  "import { AuthModal } from './AuthModal';\nimport { ProModal } from './ProModal';"
);

// Destructure from store
code = code.replace(
  "const { language, setLanguage, notifications, markNotificationsRead, profile, theme, toggleTheme, user } = useStore();",
  "const { language, setLanguage, notifications, markNotificationsRead, profile, theme, toggleTheme, user, setProModalOpen } = useStore();"
);

// Add onClick to Go PRO button
code = code.replace(
  "<button className=\"flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold hover:shadow-md transition-all\">",
  "<button onClick={() => setProModalOpen(true)} className=\"flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold hover:shadow-md transition-all\">"
);

// Add ProModal near the AuthModal
code = code.replace(
  "{createPortal(<AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />, document.body)}",
  "{createPortal(<AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />, document.body)}\n      {createPortal(<ProModal />, document.body)}"
);

fs.writeFileSync('src/components/Navbar.tsx', code);
