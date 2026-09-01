/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Leaf } from 'lucide-react';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

const Home = lazy(() => import('./pages/Home'));
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
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

    return () => subscription.unsubscribe();
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
        {/* Farm Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 fixed">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-orange-300/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-green-400/15 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[70%] h-[60%] bg-amber-400/15 rounded-full blur-[140px]"></div>
        </div>

        {/* Diagonal Crop Rows Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none fixed" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 12L12 24H0L24 0v12zM0 0h12L0 12V0z' fill='%23654321' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
        </div>
        
        <div className="relative z-10 flex flex-col min-h-screen backdrop-blur-[2px]">
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/doctor" element={<CropDoctor />} />
                <Route path="/agent" element={<Agent />} />
                <Route path="/knowledge" element={<Knowledge />} />
                <Route path="/schemes" element={<Schemes />} />
                <Route path="/market" element={<Market />} />
                <Route path="/consult" element={<Consultant />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </Router>
  );
}
