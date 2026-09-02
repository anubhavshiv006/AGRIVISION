import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ShoppingBag, MapPin, Tractor, Search, Star, ExternalLink, Leaf, Bug, Zap, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SUGGESTIONS = [
  { id: 1, name: 'Neem Oil Extract', hi: 'नीम तेल अर्क', type: 'Organic Pesticide', for: 'Aphids, Whiteflies', price: '₹250' },
  { id: 2, name: 'Trichoderma Viride', hi: 'ट्राइकोडर्मा विरिड', type: 'Bio-Fungicide', for: 'Root Rot, Wilt', price: '₹180' },
  { id: 3, name: 'Imidacloprid 17.8% SL', hi: 'इमिडाक्लोप्रिड', type: 'Chemical Insecticide', for: 'Jassids, Thrips', price: '₹450' },
];

const ONLINE_PRODUCTS = [
  { id: 101, name: 'KisanGuard Organic Spray', price: 399, rating: 4.8, img: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Condor_landbouwspuit.jpg' },
  { id: 102, name: 'EcoProtect Bio-Pesticide', price: 549, rating: 4.6, img: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Condor_landbouwspuit.jpg' },
  { id: 103, name: 'AgriSafe Fungicide Plus', price: 299, rating: 4.5, img: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Condor_landbouwspuit.jpg' },
  { id: 104, name: 'NutriBoost Liquid Fertilizer', price: 450, rating: 4.9, img: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Condor_landbouwspuit.jpg' },
];

const MANDI_PRICES = [
  { date: '1 Aug', wheat: 2150, rice: 3200, soybean: 4500 },
  { date: '5 Aug', wheat: 2180, rice: 3150, soybean: 4600 },
  { date: '10 Aug', wheat: 2200, rice: 3250, soybean: 4550 },
  { date: '15 Aug', wheat: 2250, rice: 3300, soybean: 4700 },
  { date: '20 Aug', wheat: 2230, rice: 3400, soybean: 4800 },
  { date: '25 Aug', wheat: 2300, rice: 3450, soybean: 4950 },
  { date: '30 Aug', wheat: 2350, rice: 3500, soybean: 5100 },
];

export default function Market() {
  const { language } = useStore();
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<'suggestions' | 'online' | 'nearby' | 'prices' | 'rentals'>('suggestions');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          {isEn ? 'Agri Market & Suggestions' : 'कृषि बाज़ार और सुझाव'}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('suggestions')}
          className={cn("px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2", activeTab === 'suggestions' ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50")}
        >
          <Leaf className="w-4 h-4" />
          {isEn ? 'Expert Suggestions' : 'विशेषज्ञ सुझाव'}
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={cn("px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2", activeTab === 'online' ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50")}
        >
          <ShoppingBag className="w-4 h-4" />
          {isEn ? 'Buy Online' : 'ऑनलाइन खरीदें'}
        </button>
        <button
          onClick={() => setActiveTab('nearby')}
          className={cn("px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2", activeTab === 'nearby' ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50")}
        >
          <MapPin className="w-4 h-4" />
          {isEn ? 'Nearby Shops' : 'नज़दीकी दुकानें'}
        </button>
        <button
          onClick={() => setActiveTab('prices')}
          className={cn("px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2", activeTab === 'prices' ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50")}
        >
          <TrendingUp className="w-4 h-4" />
          {isEn ? 'Mandi Prices' : 'मंडी भाव'}
        </button>
        <button
          onClick={() => setActiveTab('rentals')}
          className={cn("px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2", activeTab === 'rentals' ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50")}
        >
          <Tractor className="w-4 h-4" />
          {isEn ? 'Rentals (P2P)' : 'किराये पर (P2P)'}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 min-h-[500px]">
        
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              {isEn ? 'Recommended Pesticides & Treatments' : 'अनुशंसित कीटनाशक और उपचार'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SUGGESTIONS.map(s => (
                <div key={s.id} className="border border-gray-100 rounded-2xl p-5 bg-gradient-to-br from-emerald-50/50 to-white hover:border-emerald-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{isEn ? s.name : s.hi}</h3>
                    <Bug className="w-5 h-5 text-emerald-600 opacity-50" />
                  </div>
                  <div className="text-sm text-emerald-700 font-medium mb-3">{s.type}</div>
                  <div className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">{isEn ? 'Targets:' : 'लक्ष्य:'}</span> {s.for}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="font-bold text-gray-900">{s.price}</span>
                    <button className="text-sm text-emerald-600 font-bold hover:text-emerald-700">
                      {isEn ? 'Find Retailer' : 'विक्रेता खोजें'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {activeTab === 'rentals' && (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tractor className="w-5 h-5 text-amber-600" />
              {isEn ? 'Rent Equipment & Tractors' : 'उपकरण और ट्रैक्टर किराए पर लें'}
            </h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-800 font-medium">
                  {isEn ? 'KisanMitra takes a 2% platform fee for secure P2P rentals.' : 'किसानमित्र सुरक्षित P2P किराये के लिए 2% प्लेटफ़ॉर्म शुल्क लेता है।'}
                </p>
              </div>
              <button className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold">List Equipment</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Mahindra 575 DI', owner: 'Ramesh Singh', price: '₹500/hr', img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/A_John_Deere_9320_at_a_construction_site_in_the_US.jpg' },
                { name: 'Rotavator Heavy Duty', owner: 'Suresh Kumar', price: '₹300/hr', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/TractorWithMountedRototiller.JPG' },
                { name: 'Seed Drill Machine', owner: 'Prakash', price: '₹250/hr', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bourgault_Air_Seeder_%26_Paralink_Hoe_Drill.jpg' }
              ].map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden bg-gray-100">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{isEn ? 'Owner:' : 'मालिक:'} {item.owner}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-lg text-emerald-700">{item.price}</span>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700">
                        {isEn ? 'Book Now' : 'अभी बुक करें'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'online' && (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
              {isEn ? 'Verified Agricultural Products' : 'सत्यापित कृषि उत्पाद'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ONLINE_PRODUCTS.map(p => (
                <div key={p.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-40 overflow-hidden bg-gray-100">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500 text-sm mb-3">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium text-gray-700">{p.rating}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-black text-lg text-gray-900">₹{p.price}</span>
                      <button className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors">
                        {isEn ? 'Buy Now' : 'अभी खरीदें'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nearby' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              {isEn ? 'Nearby Fertilizer & Pesticide Shops' : 'नज़दीकी उर्वरक और कीटनाशक की दुकानें'}
            </h2>
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-8 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isEn ? 'Find stores in your area' : 'अपने क्षेत्र में स्टोर खोजें'}
              </h3>
              <p className="text-gray-600 mb-6">
                {isEn ? 'Click the button below to search Google Maps for agricultural supplies, seeds, and pesticide retailers near your current location.' : 'अपने वर्तमान स्थान के पास कृषि आपूर्ति, बीज और कीटनाशक खुदरा विक्रेताओं के लिए Google मानचित्र खोजने के लिए नीचे दिए गए बटन पर क्लिक करें।'}
              </p>
              <a 
                href="https://www.google.com/maps/search/agricultural+supplies+fertilizer+pesticide+shop+near+me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <MapPin className="w-5 h-5" />
                {isEn ? 'Open Maps & Search' : 'मैप्स खोलें और खोजें'}
                <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
              </a>
            </div>
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              {isEn ? 'Live Mandi Price Trends (30 Days)' : 'लाइव मंडी भाव रुझान (30 दिन)'}
            </h2>
            <div className="h-[400px] w-full bg-white border border-gray-100 rounded-2xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MANDI_PRICES} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${value}`, '']}
                  />
                  <Legend iconType="circle" />
                  <Line type="monotone" name={isEn ? 'Wheat (गेहूं)' : 'गेहूं (Wheat)'} dataKey="wheat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name={isEn ? 'Rice (चावल)' : 'चावल (Rice)'} dataKey="rice" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name={isEn ? 'Soybean (सोयाबीन)' : 'सोयाबीन (Soybean)'} dataKey="soybean" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
