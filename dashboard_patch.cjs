const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  "LayoutDashboard, History, CheckCircle2, Circle, Plus, Calendar",
  "LayoutDashboard, History, CheckCircle2, Circle, Plus, Calendar, Crown"
);

const proBanner = `          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full shrink-0">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{isEn ? 'Upgrade to KisanMitra PRO' : 'किसानमित्र प्रो में अपग्रेड करें'}</h3>
                <p className="text-sm text-amber-50 mt-1">{isEn ? 'Get unlimited AI analysis, priority weather alerts, and 7-day action plans.' : 'असीमित एआई विश्लेषण, प्राथमिकता वाले मौसम अलर्ट और 7-दिवसीय कार्य योजनाएं प्राप्त करें।'}</p>
              </div>
            </div>
            <button className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold shrink-0 hover:bg-gray-50 transition-colors shadow-sm">
              {isEn ? 'Upgrade Now' : 'अभी अपग्रेड करें'}
            </button>
          </div>
`;

code = code.replace(
  "<WeatherWidget />",
  "<WeatherWidget />\n" + proBanner
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
