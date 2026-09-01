const fs = require('fs');
let code = fs.readFileSync('src/pages/Schemes.tsx', 'utf8');

const partnerBanner = `
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
`;

code = code.replace(
  '<div className="grid md:grid-cols-2 gap-6">',
  partnerBanner + '\n      <div className="grid md:grid-cols-2 gap-6">'
);

fs.writeFileSync('src/pages/Schemes.tsx', code);
