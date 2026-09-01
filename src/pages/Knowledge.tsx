import { useState } from 'react';
import { useStore } from '../store/useStore';
import { BookOpen, Search, Phone, MapPin } from 'lucide-react';

const KNOWLEDGE_BASE = [
  {
    category: 'Wheat',
    title: 'Wheat Rust Management',
    desc: 'Identify and treat yellow and brown rust before it spreads to the entire field.',
    hiTitle: 'गेहूं का रतुआ प्रबंधन',
    hiDesc: 'पीले और भूरे रतुआ को पूरे खेत में फैलने से पहले पहचानें और उसका इलाज करें।'
  },
  {
    category: 'Soil',
    title: 'Improving Soil Moisture',
    desc: 'Simple mulching techniques to retain water during dry spells.',
    hiTitle: 'मिट्टी की नमी में सुधार',
    hiDesc: 'सूखे के दौरान पानी बनाए रखने के लिए सरल मल्चिंग तकनीक।'
  },
  {
    category: 'Tomato',
    title: 'Preventing Late Blight',
    desc: 'How to manage watering schedules and spacing to prevent fungal infections.',
    hiTitle: 'लेट ब्लाइट को रोकना',
    hiDesc: 'फंगल संक्रमण को रोकने के लिए पानी के कार्यक्रम और दूरी का प्रबंधन कैसे करें।'
  }
];

export default function Knowledge() {
  const { language } = useStore();
  const isEn = language === 'en';
  const [search, setSearch] = useState('');

  const filtered = KNOWLEDGE_BASE.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.hiTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-orange-600" />
          {isEn ? 'Farming Knowledge' : 'खेती का ज्ञान'}
        </h1>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isEn ? "Search articles..." : "लेख खोजें..."}
            className="w-full bg-white border border-gray-300 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md uppercase tracking-wider mb-3 inline-block">
              {item.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isEn ? item.title : item.hiTitle}
            </h3>
            <p className="text-gray-600 text-sm">
              {isEn ? item.desc : item.hiDesc}
            </p>
            <button className="mt-4 text-orange-600 font-medium text-sm hover:underline">
              {isEn ? 'Read More →' : 'और पढ़ें →'}
            </button>
          </div>
        ))}
      </div>

      {/* Expert Connect Section */}
      <div className="bg-teal-50 border border-teal-100 rounded-3xl p-8 mt-12">
        <h2 className="text-2xl font-bold text-teal-900 mb-6 text-center">
          {isEn ? 'Need Expert Help?' : 'विशेषज्ञ की मदद चाहिए?'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              {isEn ? 'Kisan Call Center' : 'किसान कॉल सेंटर'}
            </h3>
            <p className="text-teal-600 font-bold text-xl mb-2">1800-180-1551</p>
            <p className="text-sm text-gray-500">
              {isEn ? '(Toll Free - Available 6AM to 10PM)' : '(टोल फ्री - सुबह 6 बजे से रात 10 बजे तक उपलब्ध)'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              {isEn ? 'Nearby KVK' : 'निकटतम KVK'}
            </h3>
            <p className="text-gray-700 mb-2">
              {isEn ? 'Krishi Vigyan Kendra, Local District' : 'कृषि विज्ञान केंद्र, स्थानीय जिला'}
            </p>
            <button className="text-sm font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100">
              {isEn ? 'Find on Map (Demo)' : 'मानचित्र पर खोजें (डेमो)'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
