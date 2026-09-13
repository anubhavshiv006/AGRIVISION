const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

const regexPhoneSend = /const handlePhoneSendOtp = async[\s\S]*?setMode\('phone-verify'\);[\s\S]*?finally {\s*setLoading\(false\);\s*}\s*};/m;
const regexVerify = /const handleVerifyOtp = async[\s\S]*?onClose\(\);[\s\S]*?finally {\s*setLoading\(false\);\s*}\s*};/m;

const newPhoneSend = `const handlePhoneSendOtp = async (e: React.FormEvent) => {
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
  };`;

const newVerify = `const handleVerifyOtp = async (e: React.FormEvent) => {
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

code = code.replace(regexPhoneSend, newPhoneSend);
code = code.replace(regexVerify, newVerify);

fs.writeFileSync('src/components/AuthModal.tsx', code);
console.log('AuthModal phone patched successfully.');
