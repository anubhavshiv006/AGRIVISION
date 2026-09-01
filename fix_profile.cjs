const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// Remove import
code = code.replace("import { supabase } from '../lib/supabase';", "");

// Replace the supabase logic with just the updateProfile
const oldLogic = `      // Save to Supabase and let it auto-generate a serial ID on insert (if not exists)
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('profiles')
        .upsert({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          farm_size: formData.farmSize,
          updated_at: new Date().toISOString()
        }, { onConflict: 'phone' })
        .select();

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
        alert(\`Supabase Error: \${supabaseError.message}\\n\\n(Tip: Did you run the latest SQL query in Supabase?)\`);
      } else {
        if (supabaseData && supabaseData.length > 0) {
          profileId = supabaseData[0].id.toString();
        }
        updateProfile({ ...formData, uid: profileId });
        setIsEditing(false);
        alert(isEn ? 'Profile saved successfully!' : 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई!');
      }`;

const newLogic = `      updateProfile({ ...formData, uid: profileId });
      setIsEditing(false);
      alert(isEn ? 'Profile saved successfully!' : 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई!');`;

code = code.replace(oldLogic, newLogic);

fs.writeFileSync('src/pages/Profile.tsx', code);
