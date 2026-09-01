const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// 1. Add isPro to useStore
code = code.replace(
  "const { language, setLanguage, notifications, markNotificationsRead, profile, theme, toggleTheme, user, setProModalOpen } = useStore();",
  "const { language, setLanguage, notifications, markNotificationsRead, profile, theme, toggleTheme, user, setProModalOpen, isPro } = useStore();"
);

// 2. Add Sparkles import if not present, but Crown is already there so maybe we use ShieldCheck or Crown. Let's use Crown with golden gradient text.
// We can just conditionally render the button.

const desktopProButtonOld = `              {/* PRO Upgrade Button */}
              <button onClick={() => setProModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold hover:shadow-md transition-all">
                <Crown className="w-4 h-4" />
                {language === 'en' ? 'Go PRO' : 'प्रो अपग्रेड'}
              </button>`;

const desktopProButtonNew = `              {/* PRO Status / Upgrade Button */}
              {isPro ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 text-sm font-bold shadow-sm cursor-default">
                  <Crown className="w-4 h-4 text-amber-600" />
                  {language === 'en' ? 'PRO Member' : 'प्रो सदस्य'}
                </div>
              ) : (
                <button onClick={() => setProModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold hover:shadow-md transition-all">
                  <Crown className="w-4 h-4" />
                  {language === 'en' ? 'Go PRO' : 'प्रो अपग्रेड'}
                </button>
              )}`;

code = code.replace(desktopProButtonOld, desktopProButtonNew);

const mobileProButtonOld = `            <button
              onClick={() => {
                setIsOpen(false);
                setProModalOpen(true);
              }}
              className="w-full text-left block px-3 py-3 rounded-md text-base font-bold flex items-center gap-3 text-amber-600 hover:bg-amber-50"
            >
              <Crown className="w-5 h-5" />
              {language === 'en' ? 'Go PRO / Upgrade' : 'प्रो अपग्रेड करें'}
            </button>`;

const mobileProButtonNew = `            {isPro ? (
              <div className="w-full text-left block px-3 py-3 rounded-md text-base font-bold flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-l-4 border-amber-500">
                <Crown className="w-5 h-5 text-amber-500" />
                {language === 'en' ? 'PRO Member' : 'प्रो सदस्य'}
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setProModalOpen(true);
                }}
                className="w-full text-left block px-3 py-3 rounded-md text-base font-bold flex items-center gap-3 text-amber-600 hover:bg-amber-50"
              >
                <Crown className="w-5 h-5" />
                {language === 'en' ? 'Go PRO / Upgrade' : 'प्रो अपग्रेड करें'}
              </button>
            )}`;

code = code.replace(mobileProButtonOld, mobileProButtonNew);

fs.writeFileSync('src/components/Navbar.tsx', code);
