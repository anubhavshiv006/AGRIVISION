import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Leaf, Menu, X, Globe, User, Home, Stethoscope, MessageSquare, BookOpen, LayoutDashboard, Landmark, Store, Wallet, Bell, ArrowLeft, Sun, Moon, LogIn, LogOut, Crown, PhoneCall } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { AuthModal } from './AuthModal';
import { ProModal } from './ProModal';

export function Navbar() {
  const { language, setLanguage, notifications, markNotificationsRead, profile, theme, toggleTheme, user, setProModalOpen, isPro } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  const navLinks = [
    { name: language === 'en' ? 'Home' : 'मुख्य पृष्ठ', path: '/', icon: Home },
    { name: language === 'en' ? 'Dashboard' : 'डैशबोर्ड', path: '/dashboard', icon: LayoutDashboard },
    { name: language === 'en' ? 'Crop Doctor' : 'फसल डॉक्टर', path: '/doctor', icon: Stethoscope },
    { name: language === 'en' ? 'AI Agent' : 'एआई एजेंट', path: '/agent', icon: MessageSquare },
    { name: language === 'en' ? 'Market' : 'बाज़ार', path: '/market', icon: Store },
    { name: language === 'en' ? 'Budget' : 'बजट', path: '/budget', icon: Wallet },
    { name: language === 'en' ? 'Schemes' : 'योजनाएं', path: '/schemes', icon: Landmark },
    { name: language === 'en' ? 'Experts' : 'विशेषज्ञ', path: '/consult', icon: PhoneCall },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100 border-t-4 border-t-orange-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-1 sm:gap-3">
            <button 
              onClick={handleBack}
              className="p-1 sm:p-2 -ml-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors flex items-center justify-center shrink-0"
              title="Go Back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-orange-500 text-white p-1.5 sm:p-2 rounded-lg shadow-sm">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight hidden sm:block">KisanMitra</span>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-2 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-1.5",
                  location.pathname === link.path 
                    ? "bg-green-50 text-green-700" 
                    : "text-gray-600 hover:bg-green-50/50 hover:text-green-700"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            
            <div className="ml-2 flex items-center gap-3 border-l pl-4 border-gray-200">
              
              {/* PRO Status / Upgrade Button */}
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
              )}

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={handleNotifClick}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900">{language === 'en' ? 'Notifications' : 'सूचनाएं'}</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          {language === 'en' ? 'No notifications.' : 'कोई सूचना नहीं।'}
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={cn("p-4 border-b border-gray-50", !n.read && "bg-blue-50/30")}>
                            <h4 className="font-bold text-gray-900 text-sm">{language === 'en' ? n.titleEn : n.titleHi}</h4>
                            <p className="text-sm text-gray-600 mt-1">{language === 'en' ? n.messageEn : n.messageHi}</p>
                            <span className="text-xs text-gray-400 mt-2 block">{new Date(n.date).toLocaleDateString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile/Auth Link */}
              <div className="flex items-center gap-2">
                <Link to="/profile" className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors overflow-hidden border border-transparent hover:border-gray-200">
                  {user?.photoURL || profile?.photoUrl ? (
                    <img src={user?.photoURL || profile?.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Link>
                {user ? (
                  <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors shadow-sm">
                    <LogOut className="w-4 h-4" />
                    {language === 'en' ? 'Logout' : 'लॉग आउट'}
                  </button>
                ) : (
                  <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm">
                    <LogIn className="w-4 h-4" />
                    {language === 'en' ? 'Sign In' : 'साइन इन'}
                  </button>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 border border-orange-200 text-sm font-bold text-orange-800 hover:bg-orange-200 transition-colors shadow-sm"
              >
                <Globe className="w-4 h-4 text-orange-600" />
                {language === 'en' ? 'हिंदी' : 'EN'}
              </button>
            </div>
          </div>

          <div className="flex items-center lg:hidden gap-1 sm:gap-3">
            {/* Mobile Profile/Auth Link */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/profile" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors overflow-hidden border border-transparent hover:border-gray-200 shrink-0">
                {user?.photoURL || profile?.photoUrl ? (
                  <img src={user?.photoURL || profile?.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Link>
              {!user && (
                <button onClick={() => setIsAuthModalOpen(true)} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors overflow-hidden shrink-0">
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
            <div className="relative">
              <button onClick={handleNotifClick} className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative shrink-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-gray-50">
                        <h4 className="font-bold text-gray-900 text-sm">{language === 'en' ? n.titleEn : n.titleHi}</h4>
                        <p className="text-sm text-gray-600 mt-1">{language === 'en' ? n.messageEn : n.messageHi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-orange-100 border border-orange-200 text-xs sm:text-sm font-bold text-orange-800 shadow-sm shrink-0"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
              <span className="hidden min-[360px]:block">{language === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-green-600 p-1.5 sm:p-2 shrink-0 ml-0.5"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg absolute w-full left-0">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-md text-base font-bold flex items-center gap-3",
                  location.pathname === link.path 
                    ? "bg-green-50 text-green-700" 
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
            
            
            <div className="border-t border-gray-100 my-2 pt-2"></div>
            
            {isPro ? (
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
            )}


            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-3 rounded-md text-base font-bold flex items-center gap-3",
                location.pathname === '/profile'
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              )}
            >
              <User className="w-5 h-5" />
              {language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}
            </Link>
            
            {user && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  supabase.auth.signOut();
                }}
                className="w-full text-left block px-3 py-3 rounded-md text-base font-bold flex items-center gap-3 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                {language === 'en' ? 'Logout' : 'लॉग आउट'}
              </button>
            )}
          </div>
        </div>
      )}

      {createPortal(<AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />, document.body)}
      {createPortal(<ProModal />, document.body)}
    </nav>
  );
}
