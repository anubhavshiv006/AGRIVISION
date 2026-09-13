const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const regexSubmit = /try \{\s*let profileId = user\.uid;\s*\/\/ Save to Supabase[\s\S]*?updateProfile\(\{ \.\.\.formData, uid: profileId \}\);/m;

const newSubmit = `try {
      let profileId = user.uid;
      // Save to Firebase
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: formData.name || '',
        phone: formData.phone || '',
        location: formData.location || '',
        farmSize: formData.farmSize || '',
        photoUrl: formData.photoUrl || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      updateProfile({ ...formData, uid: profileId });`;

code = code.replace(regexSubmit, newSubmit);

// also replace the success alert
code = code.replace(
  "alert(isEn ? '✅ Profile saved to Supabase successfully!' : '✅ प्रोफ़ाइल सफलतापूर्वक Supabase में सहेजी गई!');",
  "alert(isEn ? '✅ Profile saved successfully!' : '✅ प्रोफ़ाइल सफलतापूर्वक सहेजी गई!');"
);

fs.writeFileSync('src/pages/Profile.tsx', code);
console.log('Profile patch 2 successfully.');
