import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  // Note: Actual Firebase implementation would be inside these actions
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

import { auth, googleProvider } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  
  signIn: async (email, pass) => {
    await signInWithEmailAndPassword(auth, email, pass);
  },
  signUp: async (email, pass) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  },
  signInWithGoogle: async () => {
    await signInWithPopup(auth, googleProvider);
  },
  signOut: async () => {
    await firebaseSignOut(auth);
  },
  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },
}));
