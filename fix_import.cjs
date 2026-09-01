const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  "import { Leaf, Menu, X, Globe, User, Home, Stethoscope, MessageSquare, BookOpen, LayoutDashboard, Landmark, Store, Wallet, Bell, ArrowLeft, Sun, Moon, LogIn, LogOut, Crown } from 'lucide-react';",
  "import { Leaf, Menu, X, Globe, User, Home, Stethoscope, MessageSquare, BookOpen, LayoutDashboard, Landmark, Store, Wallet, Bell, ArrowLeft, Sun, Moon, LogIn, LogOut, Crown, PhoneCall } from 'lucide-react';"
);

fs.writeFileSync('src/components/Navbar.tsx', code);
