import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { X, Mail, Phone, Lock, User as UserIcon } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'phone' | 'phone-verify';

export function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { language } = useStore();
  const isEn = language === 'en';
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setError('');
      setEmail('');
      setPassword('');
      setPhone('');
      setOtp('');
      
      // Clear any recaptcha on open
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      if (error) throw error;
      setMode('phone-verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please ensure phone auth is configured in Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0" aria-hidden="true"></div>
      
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex flex-col max-h-[90vh] z-10 overflow-hidden my-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full bg-gray-50 dark:bg-gray-700 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-12 sm:p-8 sm:pt-12 overflow-y-auto w-full">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {mode === 'login' ? (isEn ? 'Welcome Back' : 'वापसी पर स्वागत है') : 
             mode === 'signup' ? (isEn ? 'Create Account' : 'खाता बनाएं') :
             mode === 'phone' ? (isEn ? 'Login with Phone' : 'फ़ोन से लॉगिन करें') :
             (isEn ? 'Verify OTP' : 'OTP सत्यापित करें')}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      placeholder={isEn ? "Full Name" : "पूरा नाम"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    placeholder={isEn ? "Email Address" : "ईमेल पता"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    required
                    placeholder={isEn ? "Password" : "पासवर्ड"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? '...' : (mode === 'login' ? (isEn ? 'Login' : 'लॉग इन करें') : (isEn ? 'Sign Up' : 'साइन अप करें'))}
              </button>
            </form>
          )}

          {mode === 'phone' && (
            <form onSubmit={handlePhoneSendOtp} className="space-y-4">
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel" 
                    required
                    placeholder={isEn ? "Phone Number (e.g. 9876543210)" : "फ़ोन नंबर"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? '...' : (isEn ? 'Send OTP' : 'OTP भेजें')}
              </button>
            </form>
          )}

          {mode === 'phone-verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  required
                  placeholder={isEn ? "Enter 6-digit OTP" : "6 अंकों का OTP दर्ज करें"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-center tracking-widest text-lg focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? '...' : (isEn ? 'Verify' : 'सत्यापित करें')}
              </button>
            </form>
          )}

          <div id="recaptcha-container"></div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">{isEn ? 'Or continue with' : 'या इसके साथ जारी रखें'}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {mode !== 'phone' && mode !== 'phone-verify' && (
                <button 
                  onClick={() => setMode('phone')}
                  type="button" 
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-3"
                >
                  <Phone className="w-5 h-5 text-emerald-600" />
                  {isEn ? 'Phone Number' : 'फ़ोन नंबर'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>
                {isEn ? "Don't have an account? " : "खाता नहीं है? "}
                <button onClick={() => setMode('signup')} className="text-emerald-600 font-bold hover:underline">
                  {isEn ? "Sign up" : "साइन अप करें"}
                </button>
              </>
            ) : (
              <>
                {isEn ? "Already have an account? " : "पहले से खाता है? "}
                <button onClick={() => setMode('login')} className="text-emerald-600 font-bold hover:underline">
                  {isEn ? "Login" : "लॉग इन करें"}
                </button>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button 
              onClick={onClose}
              type="button" 
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {isEn ? 'Go Back (Skip Login)' : 'वापस जाएं (लॉगिन छोड़ें)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
