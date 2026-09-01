const fs = require('fs');
let code = fs.readFileSync('src/pages/CropDoctor.tsx', 'utf8');

const targetAd = `
              {/* Targeted Ad Placement */}
              {result.possibleProblem !== 'Appears Healthy' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border border-amber-100">
                      <ShoppingBag className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">{isEn ? 'Recommended Product' : 'अनुशंसित उत्पाद'}</p>
                      <p className="text-sm text-gray-900 font-medium">{isEn ? 'EcoProtect Fungicide - Best for Leaf Blight' : 'इकोप्रोटेक्ट फफूंदनाशक - लीफ ब्लाइट के लिए सर्वश्रेष्ठ'}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/market')} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 whitespace-nowrap">
                    {isEn ? 'Buy at 10% Off' : '10% छूट पर खरीदें'}
                  </button>
                </div>
              )}
`;

code = code.replace(
  "</div>\n              \n              {result.confidence === 'Low' && (",
  "</div>\n              \n              " + targetAd + "\n\n              {result.confidence === 'Low' && ("
);

fs.writeFileSync('src/pages/CropDoctor.tsx', code);
