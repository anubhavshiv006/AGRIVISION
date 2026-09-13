const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldImport = "import { supabase } from './lib/supabase';";
const newImport = "import { auth } from './lib/firebase';\nimport { onAuthStateChanged } from 'firebase/auth';";
code = code.replace(oldImport, newImport);

const oldEffect = `  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.full_name || null,
          photoURL: session.user.user_metadata?.avatar_url || null,
        });
      } else {
        setUser(null);
      }
    }).catch((err) => {
      console.warn("Supabase not configured or network error:", err);
    });

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.full_name || null,
          photoURL: session.user.user_metadata?.avatar_url || null,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      if (authListener && authListener.data && authListener.data.subscription) {
         authListener.data.subscription.unsubscribe();
      }
    };
  }, [setUser]);`;

const newEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email || null,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);`;

code = code.replace(oldEffect, newEffect);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched successfully.');
