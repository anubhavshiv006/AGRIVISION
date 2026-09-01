import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Camera, Mic, Sprout, Bot, BookOpen, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const { language } = useStore();
  const isEn = language === 'en';

  const features = [
    {
      icon: <Camera className="w-8 h-8 text-green-600" />,
      title: isEn ? 'AI Crop Doctor' : 'एआई फसल डॉक्टर',
      desc: isEn ? 'Upload a photo to detect diseases instantly' : 'बीमारी का तुरंत पता लगाने के लिए फोटो अपलोड करें',
      link: '/doctor',
      color: 'bg-green-100'
    },
    {
      icon: <Mic className="w-8 h-8 text-blue-600" />,
      title: isEn ? 'Voice Kisan' : 'आवाज़ किसान',
      desc: isEn ? 'Ask questions using your voice in Hindi or English' : 'हिंदी या अंग्रेजी में अपनी आवाज़ का उपयोग करके प्रश्न पूछें',
      link: '/agent',
      color: 'bg-blue-100'
    },
    {
      icon: <Sprout className="w-8 h-8 text-emerald-600" />,
      title: isEn ? 'Smart Farm Advisor' : 'स्मार्ट फार्म सलाहकार',
      desc: isEn ? 'Get a 7-day personalized action plan' : '7-दिवसीय व्यक्तिगत कार्य योजना प्राप्त करें',
      link: '/dashboard',
      color: 'bg-emerald-100'
    },
    {
      icon: <Bot className="w-8 h-8 text-purple-600" />,
      title: isEn ? 'AI Farm Agent' : 'एआई फार्म एजेंट',
      desc: isEn ? 'Chat with your personal farming assistant' : 'अपने व्यक्तिगत खेती सहायक के साथ चैट करें',
      link: '/agent',
      color: 'bg-purple-100'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-orange-600" />,
      title: isEn ? 'Farming Knowledge' : 'खेती का ज्ञान',
      desc: isEn ? 'Learn about best practices and crop care' : 'सर्वोत्तम प्रथाओं और फसल देखभाल के बारे में जानें',
      link: '/knowledge',
      color: 'bg-orange-100'
    },
    {
      icon: <Users className="w-8 h-8 text-teal-600" />,
      title: isEn ? 'Expert Connect' : 'विशेषज्ञ से जुड़ें',
      desc: isEn ? 'Find nearby agriculture support when AI is uncertain' : 'जब एआई अनिश्चित हो तो आस-पास कृषि सहायता खोजें',
      link: '/knowledge',
      color: 'bg-teal-100'
    }
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden rounded-3xl bg-gradient-to-b from-orange-50/70 via-white/50 to-green-100/60 border border-white/60 shadow-lg backdrop-blur-sm mt-4">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-6 md:px-12 flex flex-col items-center gap-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-md mb-2 border border-green-100"
            >
              <Sprout className="w-12 h-12 text-green-600" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight"
            >
              {isEn ? 'KisanMitra' : 'किसानमित्र'} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">
                {isEn ? 'Your AI Farming Companion' : 'आपका एआई खेती साथी'}
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium"
            >
              {isEn 
                ? 'Instantly identify crop diseases and get expert farming advice using your phone.' 
                : 'अपने फोन का उपयोग करके तुरंत फसल की बीमारियों की पहचान करें और विशेषज्ञ खेती सलाह लें।'}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center pt-8 w-full max-w-3xl mx-auto"
            >
              <Link 
                to="/doctor" 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white p-6 rounded-2xl shadow-xl shadow-green-200/50 transition-transform hover:-translate-y-1 flex items-center justify-center gap-4 border-2 border-green-500"
              >
                <div className="bg-white/20 p-3 rounded-full">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="text-sm md:text-base opacity-90 font-medium uppercase tracking-wider">{isEn ? 'Step 1' : 'पहला कदम'}</div>
                  <div className="text-xl md:text-2xl font-bold">{isEn ? 'Take Photo of Crop' : 'फसल की फोटो लें'}</div>
                </div>
              </Link>
              
              <Link 
                to="/agent" 
                className="flex-1 bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-200 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-4"
              >
                <div className="bg-orange-100 p-3 rounded-full">
                  <Mic className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm md:text-base opacity-80 font-medium uppercase tracking-wider text-orange-600">{isEn ? 'Have Questions?' : 'कोई सवाल है?'}</div>
                  <div className="text-xl md:text-2xl font-bold">{isEn ? 'Speak to AI Assistant' : 'एआई से बोलकर पूछें'}</div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="text-center space-y-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-900"
        >
          {isEn ? 'How KisanMitra Works' : 'किसानमित्र कैसे काम करता है'}
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-lg font-medium text-gray-600">
          {['Capture', 'Analyze', 'Understand', 'Act', 'Follow Up'].map((step, i) => (
             <motion.div 
               key={step} 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.15 }}
               className="flex flex-col md:flex-row items-center gap-4 md:gap-8"
             >
               <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">{i + 1}</span>
                 {isEn ? step : ['फोटो लें', 'विश्लेषण करें', 'समझें', 'कार्रवाई करें', 'निगरानी करें'][i]}
               </div>
               {i < 4 && <div className="hidden md:block text-green-300">➔</div>}
               {i < 4 && <div className="md:hidden text-green-300">↓</div>}
             </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link to={f.link} className="block group h-full bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {f.desc}
              </p>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* About Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEn ? 'About KisanMitra' : 'किसानमित्र के बारे में'}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{isEn ? 'Problem' : 'समस्या'}</h3>
            <p className="text-gray-600">{isEn ? 'Farmers often need to identify crop problems quickly but may not have immediate access to agricultural experts.' : 'किसानों को अक्सर फसल की समस्याओं को जल्दी पहचानने की आवश्यकता होती है, लेकिन कृषि विशेषज्ञों तक तत्काल पहुंच नहीं हो सकती है।'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{isEn ? 'Solution' : 'समाधान'}</h3>
            <p className="text-gray-600">{isEn ? 'KisanMitra combines AI image analysis, conversational AI, voice interaction and personalized farm guidance into one platform.' : 'किसानमित्र एआई छवि विश्लेषण, संवादात्मक एआई, वॉयस इंटरेक्शन और व्यक्तिगत कृषि मार्गदर्शन को एक मंच में जोड़ता है।'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{isEn ? 'Unique Value' : 'अद्वितीय मूल्य'}</h3>
            <p className="text-gray-600">{isEn ? 'KisanMitra does not simply detect a crop problem. It follows: Detect → Explain → Guide → Monitor → Escalate.' : 'किसानमित्र केवल फसल की समस्या का पता नहीं लगाता है। यह अनुसरण करता है: पता लगाएं → समझाएं → मार्गदर्शन करें → निगरानी करें → आगे बढ़ाएं।'}</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
