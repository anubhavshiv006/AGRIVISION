const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const fpoMode = `
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
`;

code = code.replace(
  '    </div>\n  );\n}',
  fpoMode + '\n    </div>\n  );\n}'
);

fs.writeFileSync('src/pages/Profile.tsx', code);
