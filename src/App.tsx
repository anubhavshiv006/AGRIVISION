/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Leaf } from 'lucide-react';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { AnimatePresence, motion } from 'motion/react';

import Home from './pages/Home';
const CropDoctor = lazy(() => import('./pages/CropDoctor'));
const Agent = lazy(() => import('./pages/Agent'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Knowledge = lazy(() => import('./pages/Knowledge'));
const Schemes = lazy(() => import('./pages/Schemes'));
const Market = lazy(() => import('./pages/Market'));
const Consultant = lazy(() => import('./pages/Consultant'));
const Budget = lazy(() => import('./pages/Budget'));
const Profile = lazy(() => import('./pages/Profile'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    <div className="bg-orange-500 text-white p-4 rounded-2xl shadow-lg animate-pulse">
      <Leaf className="w-8 h-8 animate-bounce" />
    </div>
    <div className="text-emerald-700 font-bold text-lg animate-pulse">
      Loading...
    </div>
  </div>
);

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/doctor" element={<PageTransition><CropDoctor /></PageTransition>} />
        <Route path="/agent" element={<PageTransition><Agent /></PageTransition>} />
        <Route path="/knowledge" element={<PageTransition><Knowledge /></PageTransition>} />
        <Route path="/schemes" element={<PageTransition><Schemes /></PageTransition>} />
        <Route path="/market" element={<PageTransition><Market /></PageTransition>} />
        <Route path="/consult" element={<PageTransition><Consultant /></PageTransition>} />
        <Route path="/budget" element={<PageTransition><Budget /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { theme, setUser } = useStore();

  useEffect(() => {
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
  }, [setUser]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans relative transition-colors duration-300 dark:bg-gray-900 bg-[#F9F7F2] overflow-x-hidden">
        {/* Farm Ambient Glows - Optimized with will-change and removing fixed+absolute conflict */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-orange-300/15 rounded-full blur-[100px] will-change-transform transform-gpu"></div>
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-green-400/10 rounded-full blur-[100px] will-change-transform transform-gpu"></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[70%] h-[60%] bg-amber-400/10 rounded-full blur-[120px] will-change-transform transform-gpu"></div>
        </div>

        {/* Diagonal Crop Rows Pattern */}
        <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 12L12 24H0L24 0v12zM0 0h12L0 12V0z' fill='%23654321' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
        </div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
        </div>
      </div>
    </Router>
  );
}
