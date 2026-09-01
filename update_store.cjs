const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

// Insert interface types
code = code.replace(
  "  updateProfile: (profile: Partial<UserProfile>) => void;",
  "  updateProfile: (profile: Partial<UserProfile>) => void;\n  isProModalOpen: boolean;\n  setProModalOpen: (isOpen: boolean) => void;\n  isPro: boolean;\n  setPro: (isPro: boolean) => void;"
);

// Insert default state
code = code.replace(
  "      updateProfile: (updates) => set((state) => ({\n        profile: { ...state.profile, ...updates }\n      }))",
  "      updateProfile: (updates) => set((state) => ({\n        profile: { ...state.profile, ...updates }\n      })),\n      isProModalOpen: false,\n      setProModalOpen: (isOpen) => set({ isProModalOpen: isOpen }),\n      isPro: false,\n      setPro: (isPro) => set({ isPro })"
);

fs.writeFileSync('src/store/useStore.ts', code);
