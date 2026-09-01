const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const proMobileLink = `
            <div className="border-t border-gray-100 my-2 pt-2"></div>
            
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
`;

code = code.replace(
  "<div className=\"border-t border-gray-100 my-2 pt-2\"></div>",
  proMobileLink
);

fs.writeFileSync('src/components/Navbar.tsx', code);
