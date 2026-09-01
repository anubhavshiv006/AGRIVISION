const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// The first patch might not have worked properly, so we will use regex to find and replace the exact string to be safe.
const searchImport = "import { Leaf, Menu, X, Globe, User, Home, Stethoscope, MessageSquare, BookOpen, LayoutDashboard, Landmark, Store, Wallet, Bell, ArrowLeft, Sun, Moon, LogIn, LogOut, Crown } from 'lucide-react';";
const targetImport = "import { Leaf, Menu, X, Globe, User, Home, Stethoscope, MessageSquare, BookOpen, LayoutDashboard, Landmark, Store, Wallet, Bell, ArrowLeft, Sun, Moon, LogIn, LogOut, Crown, PhoneCall } from 'lucide-react';";

code = code.replace(searchImport, targetImport);

fs.writeFileSync('src/components/Navbar.tsx', code);
