const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Add to navLinks
code = code.replace(
  "{ name: language === 'en' ? 'Schemes' : 'योजनाएं', path: '/schemes', icon: Landmark },",
  "{ name: language === 'en' ? 'Schemes' : 'योजनाएं', path: '/schemes', icon: Landmark },\n    { name: language === 'en' ? 'Experts' : 'विशेषज्ञ', path: '/consult', icon: PhoneCall },"
);

// We also need to make sure PhoneCall is imported from lucide-react in Navbar.tsx
if (!code.includes('PhoneCall')) {
  code = code.replace(
    "import { Leaf, Menu, X, Globe, User, Home, Stethoscope, MessageSquare, BookOpen, LayoutDashboard, Landmark, Store, Wallet, Bell, ArrowLeft, Sun, Moon, LogIn, LogOut, Crown } from 'lucide-react';",
    "import { Leaf, Menu, X, Globe, User, Home, Stethoscope, MessageSquare, BookOpen, LayoutDashboard, Landmark, Store, Wallet, Bell, ArrowLeft, Sun, Moon, LogIn, LogOut, Crown, PhoneCall } from 'lucide-react';"
  );
}

fs.writeFileSync('src/components/Navbar.tsx', code);
