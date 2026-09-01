import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'hi';

export interface CropAnalysis {
  id: string;
  date: string;
  crop: string;
  imageUrl: string;
  result: {
    possibleProblem: string;
    confidence: string;
    nextSteps: string[];
  };
}

export interface FarmPlanTask {
  day: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface FarmPlan {
  id: string;
  crop: string;
  problem: string;
  tasks: FarmPlanTask[];
  createdAt: string;
}

export interface Notification {
  id: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  date: string;
  read: boolean;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note: string;
}

export interface UserProfile {
  name: string;
  farmSize: string;
  location: string;
  phone: string;
  photoUrl?: string;
  uid?: string;
}

export type Theme = 'light' | 'dark';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AppState {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  
  history: CropAnalysis[];
  addHistory: (analysis: CropAnalysis) => void;
  
  plans: FarmPlan[];
  addPlan: (plan: FarmPlan) => void;
  toggleTask: (planId: string, day: number) => void;

  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'date'>) => void;
  markNotificationsRead: () => void;

  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  isProModalOpen: boolean;
  setProModalOpen: (isOpen: boolean) => void;
  isPro: boolean;
  setPro: (isPro: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      history: [],
      addHistory: (analysis) => set((state) => ({ history: [analysis, ...state.history] })),
      
      plans: [],
      addPlan: (plan) => set((state) => ({ plans: [plan, ...state.plans] })),
      toggleTask: (planId, day) => set((state) => ({
        plans: state.plans.map(p => 
          p.id === planId ? {
            ...p,
            tasks: p.tasks.map(t => t.day === day ? { ...t, completed: !t.completed } : t)
          } : p
        )
      })),

      notifications: [
        {
          id: 'welcome',
          titleEn: 'Welcome to KisanMitra',
          titleHi: 'किसानमित्र में आपका स्वागत है',
          messageEn: 'Check out the new features: Market, Budget Book, and Profile!',
          messageHi: 'नई सुविधाएँ देखें: बाज़ार, बजट बुक, और प्रोफ़ाइल!',
          date: new Date().toISOString(),
          read: false
        }
      ],
      addNotification: (notif) => set((state) => ({
        notifications: [{ ...notif, id: Math.random().toString(36).substr(2, 9), read: false, date: new Date().toISOString() }, ...state.notifications]
      })),
      markNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),

      transactions: [],
      addTransaction: (tx) => set((state) => ({
        transactions: [{ ...tx, id: Math.random().toString(36).substr(2, 9) }, ...state.transactions]
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      profile: {
        name: 'Farmer',
        farmSize: '2 Acres',
        location: 'New Delhi',
        phone: '',
        photoUrl: ''
      },
      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),
      isProModalOpen: false,
      setProModalOpen: (isOpen) => set({ isProModalOpen: isOpen }),
      isPro: false,
      setPro: (isPro) => set({ isPro })
    }),
    {
      name: 'kisanmitra-storage',
    }
  )
);
