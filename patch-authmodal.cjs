const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

// Replace import
code = code.replace("import { supabase } from '../lib/supabase';", "import { auth, loginWithGoogle, createUserWithEmailAndPassword, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber, ensureUserProfile } from '../lib/firebase';\nimport { updateProfile } from 'firebase/auth';");

const oldGoogleLogin = `  const handleGoogleLogin = async () => {
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
  };`;

const newGoogleLogin = `  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };`;

code = code.replace(oldGoogleLogin, newGoogleLogin);

const oldEmailAuth = `  const handleEmailAuth = async (e: React.FormEvent) => {
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
  };`;

const newEmailAuth = `  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await ensureUserProfile(result.user);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };`;

code = code.replace(oldEmailAuth, newEmailAuth);

const oldPhoneAuth = `  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : \`+91\${phone}\`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      if (error) throw error;
      
      setMode('phone-verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : \`+91\${phone}\`;
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
  };`;

const newPhoneAuth = `  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : \`+91\${phone}\`;
      
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, (window as any).recaptchaVerifier);
      setConfirmationResult(confirmation);
      setMode('phone-verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!confirmationResult) throw new Error('No OTP request found');
      const result = await confirmationResult.confirm(otp);
      await ensureUserProfile(result.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };`;

code = code.replace(oldPhoneAuth, newPhoneAuth);

fs.writeFileSync('src/components/AuthModal.tsx', code);
console.log('AuthModal patched successfully.');
