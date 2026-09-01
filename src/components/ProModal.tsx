import { X, Crown, CheckCircle2, ShieldCheck, PhoneCall, Zap, BarChart3 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { useState } from 'react';

export function ProModal() {
  const { isProModalOpen, setProModalOpen, isPro, setPro, language } = useStore();
  const isEn = language === 'en';
  const [loading, setLoading] = useState(false);

  if (!isProModalOpen) return null;

  const handleSubscribe = () => {
    setLoading(true);
    // Simulate payment process
    setTimeout(() => {
      setLoading(false);
      setPro(true);
      alert(isEn ? "Payment successful! Welcome to KisanMitra PRO." : "भुगतान सफल रहा! किसानमित्र प्रो में आपका स्वागत है।");
      setProModalOpen(false);
    }, 1500);
  };

  const features = [
    {
      icon: Zap,
      en: "Unlimited AI Crop Doctor Scans",
      hi: "असीमित एआई फसल डॉक्टर स्कैन"
    },
    {
      icon: PhoneCall,
      en: "Unlimited Expert Consultations (Call/Chat)",
      hi: "असीमित विशेषज्ञ परामर्श (कॉल/चैट)"
    },
    {
      icon: ShieldCheck,
      en: "Priority Weather Alerts & 7-Day Plans",
      hi: "प्राथमिकता मौसम अलर्ट और 7-दिवसीय योजनाएं"
    },
    {
      icon: BarChart3,
      en: "Advanced Mandi Price Predictions",
      hi: "उन्नत मंडी भाव भविष्यवाणियां"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProModalOpen(false)} />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={() => setProModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-white/50 hover:bg-white rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
            <Crown className="w-32 h-32 text-white" />
          </div>
          
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 backdrop-blur-sm border border-white/30">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 relative z-10">KisanMitra <span className="font-black text-amber-900">PRO</span></h2>
          <p className="text-orange-50 font-medium relative z-10">
            {isEn ? "Empower your farming with advanced AI and expert support." : "उन्नत एआई और विशेषज्ञ सहायता के साथ अपनी खेती को सशक्त बनाएं।"}
          </p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-black text-gray-900 tracking-tight">
              ₹299
            </div>
            <div className="text-gray-500 font-medium mt-1">
              {isEn ? "for 3 months" : "3 महीने के लिए"}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="bg-orange-50 p-2 rounded-lg shrink-0 mt-0.5">
                  <f.icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{isEn ? f.en : f.hi}</p>
                </div>
              </div>
            ))}
          </div>

          {isPro ? (
            <div className="bg-green-50 text-green-700 font-bold p-4 rounded-xl text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {isEn ? "You are a PRO Member" : "आप एक प्रो सदस्य हैं"}
            </div>
          ) : (
            <button 
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Crown className="w-5 h-5" />
              )}
              {isEn ? "Subscribe & Pay ₹299" : "सदस्यता लें और ₹299 का भुगतान करें"}
            </button>
          )}
          
          <p className="text-center text-xs text-gray-400 mt-4 font-medium">
            {isEn ? "Secure payments via Razorpay/UPI" : "Razorpay/UPI के माध्यम से सुरक्षित भुगतान"}
          </p>
        </div>
      </div>
    </div>
  );
}
