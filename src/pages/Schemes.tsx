import { useStore } from '../store/useStore';
import { Landmark, FileText, CheckCircle2, IndianRupee, ShieldCheck, Tractor, Droplets, ArrowRight } from 'lucide-react';

const SCHEMES = [
  {
    id: 'pm-kisan',
    icon: IndianRupee,
    titleEn: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    titleHi: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
    descEn: 'Income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
    descHi: 'सभी भूमिधारक किसान परिवारों को तीन समान किश्तों में प्रति वर्ष ₹6,000 की आय सहायता।',
    benefitsEn: ['₹6,000 yearly financial benefit', 'Direct bank transfer', 'No intermediaries'],
    benefitsHi: ['₹6,000 का वार्षिक वित्तीय लाभ', 'सीधे बैंक खाते में ट्रांसफर', 'कोई बिचौलिया नहीं'],
    link: 'https://pmkisan.gov.in/'
  },
  {
    id: 'pmfby',
    icon: ShieldCheck,
    titleEn: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    titleHi: 'पीएमएफबीवाई (प्रधानमंत्री फसल बीमा योजना)',
    descEn: 'Comprehensive crop insurance scheme from pre-sowing to post-harvest losses against non-preventable natural risks.',
    descHi: 'बुवाई से पहले से लेकर फसल कटाई के बाद तक अपरिहार्य प्राकृतिक जोखिमों के खिलाफ व्यापक फसल बीमा योजना।',
    benefitsEn: ['Low premium rates', 'Full insured amount', 'Covers localized calamities'],
    benefitsHi: ['कम प्रीमियम दरें', 'पूरी बीमित राशि', 'स्थानीयकृत आपदाओं को कवर करता है'],
    link: 'https://pmfby.gov.in/'
  },
  {
    id: 'kcc',
    icon: FileText,
    titleEn: 'Kisan Credit Card (KCC)',
    titleHi: 'किसान क्रेडिट कार्ड (केसीसी)',
    descEn: 'Provides farmers with timely access to credit for agricultural and allied activities at concessional interest rates.',
    descHi: 'किसानों को रियायती ब्याज दरों पर कृषि और संबद्ध गतिविधियों के लिए ऋण तक समय पर पहुंच प्रदान करता है।',
    benefitsEn: ['Low interest rates (up to 4% with prompt repayment)', 'Covers post-harvest expenses', 'Flexible repayment'],
    benefitsHi: ['कम ब्याज दरें (समय पर चुकाने पर 4% तक)', 'कटाई के बाद के खर्चों को कवर करता है', 'लचीला पुनर्भुगतान'],
    link: 'https://www.myscheme.gov.in/schemes/kcc'
  },
  {
    id: 'pkvy',
    icon: Tractor,
    titleEn: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    titleHi: 'परंपरागत कृषि विकास योजना (पीकेवीवाई)',
    descEn: 'Promotes organic farming through the cluster approach and participatory guarantee system of certification.',
    descHi: 'क्लस्टर दृष्टिकोण और प्रमाणन की भागीदारी गारंटी प्रणाली के माध्यम से जैविक खेती को बढ़ावा देता है।',
    benefitsEn: ['Financial assistance for organic inputs', 'Certification support', 'Market linkage'],
    benefitsHi: ['जैविक इनपुट के लिए वित्तीय सहायता', 'प्रमाणन समर्थन', 'बाजार संपर्क'],
    link: 'https://pgsindia-ncof.gov.in/pkvy/'
  },
  {
    id: 'pmksy',
    icon: Droplets,
    titleEn: 'PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)',
    titleHi: 'पीएमकेएसवाई (प्रधानमंत्री कृषि सिंचाई योजना)',
    descEn: 'Focuses on improving water use efficiency at farm level through micro-irrigation ("Per Drop More Crop").',
    descHi: '"प्रति बूंद अधिक फसल" के माध्यम से खेत के स्तर पर जल उपयोग दक्षता में सुधार पर ध्यान केंद्रित करता है।',
    benefitsEn: ['Subsidy on drip/sprinkler systems', 'Water conservation', 'Increased yield'],
    benefitsHi: ['ड्रिप/स्प्रिंकलर सिस्टम पर सब्सिडी', 'जल संरक्षण', 'पैदावार में वृद्धि'],
    link: 'https://pmksy.gov.in/'
  },
  {
    id: 'enam',
    icon: Landmark,
    titleEn: 'e-NAM (National Agriculture Market)',
    titleHi: 'ई-नाम (राष्ट्रीय कृषि बाजार)',
    descEn: 'A pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market.',
    descHi: 'एक अखिल भारतीय इलेक्ट्रॉनिक ट्रेडिंग पोर्टल जो एकीकृत राष्ट्रीय बाजार बनाने के लिए मौजूदा एपीएमसी मंडियों को नेटवर्क करता है।',
    benefitsEn: ['Transparent online trading', 'Better price discovery', 'Direct payment to farmers'],
    benefitsHi: ['पारदर्शी ऑनलाइन ट्रेडिंग', 'बेहतर मूल्य खोज', 'किसानों को सीधा भुगतान'],
    link: 'https://www.enam.gov.in/'
  }
];

export default function Schemes() {
  const { language } = useStore();
  const isEn = language === 'en';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-2">
          <Landmark className="w-10 h-10 text-orange-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {isEn ? 'Government Schemes for Farmers' : 'किसानों के लिए सरकारी योजनाएं'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {isEn 
            ? 'Explore prominent central government schemes designed to support agricultural activities, provide financial security, and promote modern farming.'
            : 'कृषि गतिविधियों का समर्थन करने, वित्तीय सुरक्षा प्रदान करने और आधुनिक खेती को बढ़ावा देने के लिए बनाई गई प्रमुख केंद्र सरकार की योजनाओं का अन्वेषण करें।'}
        </p>
      </div>

      
      {/* Partner Banner - Lead Generation Model */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200 rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
          {isEn ? 'Sponsored Partner' : 'प्रायोजित भागीदार'}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isEn ? 'Instant Crop Loan & Insurance Approval' : 'तत्काल फसल ऋण और बीमा स्वीकृति'}
          </h2>
          <p className="text-gray-700 font-medium">
            {isEn ? 'Apply through KisanMitra partners and get your loan approved within 24 hours at special interest rates.' : 'किसानमित्र भागीदारों के माध्यम से आवेदन करें और विशेष ब्याज दरों पर 24 घंटे के भीतर अपना ऋण स्वीकृत कराएं।'}
          </p>
        </div>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors whitespace-nowrap shadow-md">
          {isEn ? 'Apply Now' : 'अभी आवेदन करें'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {SCHEMES.map((scheme) => (
          <div key={scheme.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow hover:border-orange-200 flex flex-col h-full">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shrink-0">
                <scheme.icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isEn ? scheme.titleEn : scheme.titleHi}
                </h2>
              </div>
            </div>
            
            <p className="text-gray-700 font-medium mb-6 flex-grow">
              {isEn ? scheme.descEn : scheme.descHi}
            </p>

            <div className="space-y-3 mb-8">
              {(isEn ? scheme.benefitsEn : scheme.benefitsHi).map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>

            <a 
              href={scheme.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-800 hover:text-orange-700 font-bold rounded-xl transition-colors"
            >
              {isEn ? 'Learn More / Apply' : 'और जानें / आवेदन करें'}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
