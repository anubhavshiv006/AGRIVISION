const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const oldImports = `import { db, updateDoc, doc, getDoc, setDoc } from '../lib/firebase';`;
const newImports = `import { supabase } from '../lib/supabase';`;
code = code.replace(oldImports, newImports);

const oldFetch = `    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            updateProfile({
              name: data.name || '',
              phone: data.phone || '',
              location: data.location || '',
              farmSize: data.farmSize || '',
              photoUrl: data.photoUrl || ''
            });
            setFormData({
              name: data.name || '',
              phone: data.phone || '',
              location: data.location || '',
              farmSize: data.farmSize || '',
              photoUrl: data.photoUrl || ''
            });
          }
        } catch (error) {
          console.error("Error fetching profile", error);
        }
      }
    };`;

const newFetch = `    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.uid)
            .single();
            
          if (data) {
            updateProfile({
              name: data.name || '',
              phone: data.phone || '',
              location: data.location || '',
              farmSize: data.farm_size || '',
              photoUrl: data.photo_url || ''
            });
            setFormData({
              name: data.name || '',
              phone: data.phone || '',
              location: data.location || '',
              farmSize: data.farm_size || '',
              photoUrl: data.photo_url || ''
            });
          }
        } catch (error) {
          console.error("Error fetching profile", error);
        }
      }
    };`;

code = code.replace(oldFetch, newFetch);

const oldSubmit = `      if (user?.uid) {
        // Save to Firebase
        await setDoc(doc(db, 'users', user.uid), {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          farmSize: formData.farmSize,
          photoUrl: formData.photoUrl
        }, { merge: true });
      }`;

const newSubmit = `      if (user?.uid) {
        // Save to Supabase
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.uid,
            name: formData.name,
            phone: formData.phone,
            location: formData.location,
            farm_size: formData.farmSize,
            photo_url: formData.photoUrl,
            updated_at: new Date().toISOString()
          });
        if (error) throw error;
      }`;

code = code.replace(oldSubmit, newSubmit);

fs.writeFileSync('src/pages/Profile.tsx', code);
