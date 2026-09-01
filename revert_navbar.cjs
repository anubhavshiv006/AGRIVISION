const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace("import { logout } from '../lib/firebase';", "import { supabase } from '../lib/supabase';");
code = code.replace("onClick={logout}", "onClick={() => supabase.auth.signOut()}");

fs.writeFileSync('src/components/Navbar.tsx', code);
