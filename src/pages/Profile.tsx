import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { UserCircle, Save, MapPin, Phone, Ruler, Camera, Crown, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';


export default function Profile() {
  const { language, profile, updateProfile, user, isPro } = useStore();
  const isEn = language === 'en';
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
        const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.uid)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            const fetchedProfile = {
              name: data.name || '',
              phone: data.phone || '',
              location: data.location || '',
              farmSize: data.farm_size || '',
              photoUrl: data.photo_url || user?.photoURL || '',
              uid: user.uid
            };
            updateProfile(fetchedProfile);
            setFormData(fetchedProfile);
          } else {
            setFormData(profile);
          }
        } catch (error) {
          console.error("Error fetching profile", error);
        }
      } else {
        setFormData(profile);
      }
    };
    fetchProfile();
  }, [user, updateProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid) {
      alert(isEn 
        ? '⚠️ You are not logged in!\n\nPlease click the "Login" button in the menu first. Profile data cannot be saved to the database without logging in.' 
        : '⚠️ आप लॉग इन नहीं हैं!\n\nकृपया पहले मेन्यू से "लॉगिन" बटन पर क्लिक करें। लॉग इन किए बिना प्रोफ़ाइल डेटा डेटाबेस में सेव नहीं होगा।');
      return;
    }

    if (!formData.phone || formData.phone.trim() === '') {
      alert(isEn ? 'Please enter a valid phone number to save your profile.' : 'प्रोफ़ाइल सहेजने के लिए कृपया एक मान्य फ़ोन नंबर दर्ज करें।');
      return;
    }
    
    setLoading(true);
    try {
      let profileId = user.uid;

      // Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.uid,
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          farm_size: formData.farmSize,
          photo_url: formData.photoUrl,
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        if (error.message.includes('relation "public.profiles" does not exist') || error.message.includes('invalid input syntax')) {
            alert(isEn 
              ? '❌ Database Table Missing or Incorrect!\n\nPlease go to your Supabase Dashboard -> SQL Editor, and run the SQL code to create the "profiles" table with UUID type.' 
              : '❌ डेटाबेस टेबल नहीं है या गलत है!\n\nकृपया अपने Supabase Dashboard -> SQL Editor में जाएँ और "profiles" टेबल (UUID के साथ) बनाने वाला कोड रन करें।');
        }
        throw error;
      }

      updateProfile({ ...formData, uid: profileId });
      setIsEditing(false);
      alert(isEn ? '✅ Profile saved to Supabase successfully!' : '✅ प्रोफ़ाइल सफलतापूर्वक Supabase में सहेजी गई!');
    } catch (error: any) {
      console.error("Error updating profile", error);
      alert((isEn ? 'Error saving profile: ' : 'प्रोफ़ाइल सहेजने में त्रुटि: ') + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <UserCircle className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          {isEn ? 'My Profile' : 'मेरी प्रोफ़ाइल'}
        </h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center bg-emerald-50/50 border-b border-gray-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden group">
            {(isEditing ? formData.photoUrl : profile.photoUrl) ? (
              <img src={isEditing ? formData.photoUrl : profile.photoUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserCircle className="w-12 h-12" />
            )}
            
            {isEditing && (
              <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {isEditing && (
            <div className="mb-4">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-full"
              >
                {isEn ? 'Change Photo' : 'फ़ोटो बदलें'}
              </button>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            {isEditing ? formData.name || (isEn ? 'Farmer' : 'किसान') : profile.name || (isEn ? 'Farmer' : 'किसान')}
            {isPro && <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />}
          </h2>
          {isPro ? (
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold mt-2 border border-amber-200">
              <Crown className="w-4 h-4" />
              {isEn ? 'PRO Member' : 'प्रो सदस्य'}
            </div>
          ) : (
            <p className="text-emerald-700 font-medium mt-1">{isEn ? 'KisanMitra User' : 'किसानमित्र उपयोगकर्ता'}</p>
          )}
        </div>

        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{isEn ? 'Full Name' : 'पूरा नाम'}</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{isEn ? 'Phone Number' : 'फ़ोन नंबर'}</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{isEn ? 'Location (Village/City)' : 'स्थान (गाँव/शहर)'}</label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{isEn ? 'Farm Size (Acres/Hectares)' : 'खेत का आकार (एकड़/हेक्टेयर)'}</label>
                <input 
                  type="text" 
                  value={formData.farmSize} 
                  onChange={e => setFormData({...formData, farmSize: e.target.value})}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  <Save className="w-5 h-5" />
                  {loading ? '...' : (isEn ? 'Save Profile' : 'प्रोफ़ाइल सहेजें')}
                </button>
                <button type="button" disabled={loading} onClick={() => setIsEditing(false)} className="px-6 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50">
                  {isEn ? 'Cancel' : 'रद्द करें'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Phone className="w-6 h-6 text-gray-400 shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">{isEn ? 'Phone Number' : 'फ़ोन नंबर'}</div>
                  <div className="font-bold text-gray-900">{profile.phone || (isEn ? 'Not provided' : 'प्रदान नहीं किया गया')}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <MapPin className="w-6 h-6 text-gray-400 shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">{isEn ? 'Location' : 'स्थान'}</div>
                  <div className="font-bold text-gray-900">{profile.location || (isEn ? 'Not provided' : 'प्रदान नहीं किया गया')}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Ruler className="w-6 h-6 text-gray-400 shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">{isEn ? 'Farm Size' : 'खेत का आकार'}</div>
                  <div className="font-bold text-gray-900">{profile.farmSize || (isEn ? 'Not provided' : 'प्रदान नहीं किया गया')}</div>
                </div>
              </div>

              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-100 transition-colors mt-8 border border-emerald-100"
              >
                {isEn ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें'}
              </button>
              <button 
                onClick={handleLogout}
                className="w-full bg-white text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors mt-4 border border-red-200 flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                {isEn ? 'Logout' : 'लॉग आउट'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enterprise / FPO Model Placeholder */}
      <div className="bg-gray-900 rounded-3xl shadow-sm border border-gray-800 overflow-hidden mt-8 p-8 text-white relative">
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          {isEn ? 'Enterprise' : 'उद्यम'}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded-xl shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
          </div>
          <h2 className="text-2xl font-bold">{isEn ? 'FPO Manager Dashboard' : 'FPO प्रबंधक डैशबोर्ड'}</h2>
        </div>
        <p className="text-gray-400 mb-6">
          {isEn ? 'Manage multiple farms, track aggregate disease outbreaks, and predict regional crop yields using KisanMitra B2B analytics.' : 'KisanMitra B2B एनालिटिक्स का उपयोग करके कई खेतों का प्रबंधन करें, बीमारी के प्रकोप को ट्रैक करें और फसल की पैदावार की भविष्यवाणी करें।'}
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl font-bold transition-colors">
          {isEn ? 'Switch to FPO View' : 'FPO दृश्य पर स्विच करें'}
        </button>
      </div>

    </div>
  );
}
