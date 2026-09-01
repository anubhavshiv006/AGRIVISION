const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// 1. Add isPro
code = code.replace(
  "const { language, user, profile, updateProfile } = useStore();",
  "const { language, user, profile, updateProfile, isPro } = useStore();"
);

// 2. Add Crown import if not present
if (!code.includes('Crown')) {
  code = code.replace(
    "import { User as UserIcon, Camera, Save, MapPin, Phone, Ruler } from 'lucide-react';",
    "import { User as UserIcon, Camera, Save, MapPin, Phone, Ruler, Crown } from 'lucide-react';"
  );
}

// 3. Add PRO badge under the name
const nameBlockOld = `<h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? formData.name || (isEn ? 'Farmer' : 'किसान') : profile.name || (isEn ? 'Farmer' : 'किसान')}
          </h2>
          <p className="text-emerald-700 font-medium mt-1">{isEn ? 'KisanMitra User' : 'किसानमित्र उपयोगकर्ता'}</p>`;

const nameBlockNew = `<h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
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
          )}`;

code = code.replace(nameBlockOld, nameBlockNew);

fs.writeFileSync('src/pages/Profile.tsx', code);
