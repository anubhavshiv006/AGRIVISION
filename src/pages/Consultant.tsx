import { useState } from 'react';
import { useStore } from '../store/useStore';
import { PhoneCall, MessageCircle, Star, Award, CheckCircle, Crown, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

interface Expert {
  id: string;
  nameEn: string;
  nameHi: string;
  specialtyEn: string;
  specialtyHi: string;
  exp: number;
  rating: number;
  reviews: number;
  image: string;
}

const EXPERTS: Expert[] = [
  {
    id: 'e1',
    nameEn: 'Dr. R.K. Sharma',
    nameHi: 'डॉ. आर.के. शर्मा',
    specialtyEn: 'Crop Disease & Pest Control',
    specialtyHi: 'फसल रोग और कीट नियंत्रण',
    exp: 15,
    rating: 4.9,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop'
  },
  {
    id: 'e2',
    nameEn: 'Dr. Anita Verma',
    nameHi: 'डॉ. अनीता वर्मा',
    specialtyEn: 'Soil Health & Fertilizers',
    specialtyHi: 'मिट्टी स्वास्थ्य और उर्वरक',
    exp: 12,
    rating: 4.8,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1594824432258-00566373b9e4?w=150&h=150&fit=crop'
  },
  {
    id: 'e3',
    nameEn: 'Mr. Vikram Singh',
    nameHi: 'श्री विक्रम सिंह',
    specialtyEn: 'Organic Farming & Irrigation',
    specialtyHi: 'जैविक खेती और सिंचाई',
    exp: 8,
    rating: 4.7,
    reviews: 520,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop'
  }
];

export default function Consultant() {
  const { language, isPro, setProModalOpen } = useStore();
  const isEn = language === 'en';
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleBook = (expertId: string, type: 'call' | 'chat') => {
    setLoadingId(`${expertId}-${type}`);
    setTimeout(() => {
      setLoadingId(null);
      alert(isEn 
        ? `Successfully booked ${type} consultation! An expert will connect with you shortly.` 
        : `सफलतापूर्वक ${type} परामर्श बुक किया गया! एक विशेषज्ञ जल्द ही आपसे जुड़ेंगे।`);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <PhoneCall className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
            {isEn ? "Talk to Agriculture Experts" : "कृषि विशेषज्ञों से बात करें"}
          </h1>
          <p className="text-emerald-50 text-lg max-w-2xl font-medium">
            {isEn 
              ? "Get instant advice on crop diseases, fertilizers, and market trends from certified agronomists." 
              : "प्रमाणित कृषिविदों से फसल रोगों, उर्वरकों और बाजार के रुझानों पर तुरंत सलाह लें।"}
          </p>
        </div>
      </div>

      {!isPro && (
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-orange-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 text-white p-3 rounded-full shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {isEn ? "Want Free Consultations?" : "मुफ्त परामर्श चाहते हैं?"}
              </h3>
              <p className="text-orange-800 text-sm font-medium mt-1">
                {isEn 
                  ? "Upgrade to KisanMitra PRO to get unlimited expert calls and chats." 
                  : "असीमित विशेषज्ञ कॉल और चैट प्राप्त करने के लिए किसानमित्र प्रो में अपग्रेड करें।"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setProModalOpen(true)}
            className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shrink-0 shadow-sm"
          >
            {isEn ? "Go PRO Now" : "अभी प्रो बनें"}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {EXPERTS.map(expert => (
          <div key={expert.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Expert Info */}
              <div className="flex gap-4 flex-1">
                <img 
                  src={expert.image} 
                  alt={expert.nameEn} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-gray-50 shrink-0"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {isEn ? expert.nameEn : expert.nameHi}
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </h2>
                  <p className="text-green-700 font-semibold text-sm mb-2">
                    {isEn ? expert.specialtyEn : expert.specialtyHi}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                      <Award className="w-4 h-4 text-gray-400" />
                      {expert.exp} {isEn ? "Years Exp." : "वर्ष अनुभव"}
                    </div>
                    <div className="flex items-center gap-1 font-bold text-gray-900">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {expert.rating} 
                      <span className="text-gray-500 font-medium text-xs">({expert.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:min-w-[300px]">
                {/* Chat Option */}
                <button 
                  onClick={() => handleBook(expert.id, 'chat')}
                  disabled={loadingId !== null}
                  className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group relative overflow-hidden"
                >
                  <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                  <span className="font-bold text-gray-900 text-sm mb-1">
                    {isEn ? "Chat Support" : "चैट सपोर्ट"}
                  </span>
                  <div className="text-blue-600 font-black">
                    {isPro ? (
                      <span className="text-green-600">{isEn ? "FREE" : "मुफ़्त"}</span>
                    ) : "₹49"}
                  </div>
                  {loadingId === `${expert.id}-chat` && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>

                {/* Call Option */}
                <button 
                  onClick={() => handleBook(expert.id, 'call')}
                  disabled={loadingId !== null}
                  className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 border-green-100 hover:border-green-300 hover:bg-green-50 transition-colors group relative overflow-hidden bg-green-50/50"
                >
                  <PhoneCall className="w-6 h-6 text-green-500 mb-2 transition-colors" />
                  <span className="font-bold text-gray-900 text-sm mb-1">
                    {isEn ? "Audio Call" : "ऑडियो कॉल"}
                  </span>
                  <div className="text-green-700 font-black">
                    {isPro ? (
                      <span className="text-green-600">{isEn ? "FREE" : "मुफ़्त"}</span>
                    ) : "₹99"}
                  </div>
                  {loadingId === `${expert.id}-call` && (
                    <div className="absolute inset-0 bg-green-50/80 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl">
        <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
        <p className="text-sm font-medium leading-relaxed">
          {isEn 
            ? "100% Secure & Verified. All our experts are highly qualified and undergo a strict verification process. Money-back guarantee if you are not satisfied with the consultation."
            : "100% सुरक्षित और सत्यापित। हमारे सभी विशेषज्ञ अत्यधिक योग्य हैं और एक सख्त सत्यापन प्रक्रिया से गुजरते हैं। यदि आप परामर्श से संतुष्ट नहीं हैं तो मनी-बैक गारंटी।"}
        </p>
      </div>
    </div>
  );
}
