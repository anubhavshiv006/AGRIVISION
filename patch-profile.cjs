const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// Replace import
code = code.replace("import { supabase } from '../lib/supabase';", "import { db, doc, getDoc, setDoc, logout } from '../lib/firebase';");

// Replace handleLogout
const oldLogout = `  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };`;

const newLogout = `  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };`;
code = code.replace(oldLogout, newLogout);

// Replace fetchProfile
const oldFetch = `    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.uid)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            const fetchedProfile = {
              name: data.name || '',
              phone: data.phone || '',
              location: data.location || '',
              farmSize: data.farm_size || '',
              photoUrl: data.photo_url || user?.photoURL || '',
              uid: user.uid
            };
            updateProfile(fetchedProfile);
            setFormData(fetchedProfile);
          } else {
            setFormData(profile);
          }
        } catch (error) {
          console.error("Error fetching profile", error);
        }
      } else {
        setFormData(profile);
      }
    };`;

const newFetch = `    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          
          if (snap.exists()) {
            const data = snap.data();
            const fetchedProfile = {
              name: data.name || '',
              phone: data.phone || '',
              location: data.location || '',
              farmSize: data.farmSize || '',
              photoUrl: data.photoUrl || user?.photoURL || '',
              uid: user.uid
            };
            updateProfile(fetchedProfile);
            setFormData(fetchedProfile);
          } else {
            setFormData(profile);
          }
        } catch (error) {
          console.error("Error fetching profile", error);
        }
      } else {
        setFormData(profile);
      }
    };`;
code = code.replace(oldFetch, newFetch);

// Replace handleSubmit
const oldSubmit = `    try {
      let profileId = user.uid;
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
        
      if (error) {
        if (error.message.includes('relation "public.profiles" does not exist') || error.message.includes('invalid input syntax')) {
            alert(isEn 
              ? '❌ Database Table Missing or Incorrect!\\n\\nPlease go to your Supabase Dashboard -> SQL Editor, and run the SQL code to create the "profiles" table with UUID type.' 
              : '❌ डेटाबेस टेबल नहीं है या गलत है!\\n\\nकृपया अपने Supabase Dashboard -> SQL Editor में जाएँ और "profiles" टेबल (UUID के साथ) बनाने वाला कोड रन करें।');
        }
        throw error;
      }

      updateProfile({ ...formData, uid: profileId });
      setIsEditing(false);
      alert(isEn ? '✅ Profile saved to Supabase successfully!' : '✅ प्रोफ़ाइल सफलतापूर्वक Supabase में सहेजी गई!');
    } catch (error: any) {
      console.error("Error updating profile", error);
      alert((isEn ? 'Error saving profile: ' : 'प्रोफ़ाइल सहेजने में त्रुटि: ') + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }`;

const newSubmit = `    try {
      let profileId = user.uid;
      // Save to Firebase
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        farmSize: formData.farmSize,
        photoUrl: formData.photoUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      updateProfile({ ...formData, uid: profileId });
      setIsEditing(false);
      alert(isEn ? '✅ Profile saved successfully!' : '✅ प्रोफ़ाइल सफलतापूर्वक सहेजी गई!');
    } catch (error: any) {
      console.error("Error updating profile", error);
      alert((isEn ? 'Error saving profile: ' : 'प्रोफ़ाइल सहेजने में त्रुटि: ') + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }`;
code = code.replace(oldSubmit, newSubmit);

fs.writeFileSync('src/pages/Profile.tsx', code);
console.log('Profile patched successfully.');
