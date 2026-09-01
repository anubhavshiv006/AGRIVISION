const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const oldFetchStart = `    const fetchProfile = async () => {`;
const oldFetchEnd = `    fetchProfile();`;

const match = code.match(/const fetchProfile = async \(\) => \{[\s\S]*?fetchProfile\(\);/);

if (match) {
  const newFetch = `    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.uid)
            .single();
            
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
    };
    fetchProfile();`;
  code = code.replace(match[0], newFetch);
}

fs.writeFileSync('src/pages/Profile.tsx', code);
