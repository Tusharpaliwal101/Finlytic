import { create } from 'zustand';
import { Policy } from '../types';

interface PolicyState {
  policies: Policy[];
  loading: boolean;
  selectedIds: string[];
  
  loadPolicies: (uid?: string) => Promise<void>;
  savePolicy: (policy: Policy, uid?: string) => Promise<void>;
  deletePolicy: (id: string, uid?: string) => Promise<void>;
  toggleSelect: (id: string) => void;
  clearAll: (uid?: string) => Promise<void>;
}

export const usePolicyStore = create<PolicyState>((set, get) => ({
  policies: [],
  loading: false,
  selectedIds: [],

  loadPolicies: async (uid) => {
    set({ loading: true });
    if (uid) {
      // Firestore path: users/{uid}/policies
      // Mock: const data = await getDocs(collection(db, `users/${uid}/policies`));
    } else {
      const saved = localStorage.getItem('finlytic_policies');
      if (saved) set({ policies: JSON.parse(saved) });
    }
    set({ loading: false });
  },

  savePolicy: async (policy, uid) => {
    const { policies } = get();
    const newPolicy = { ...policy, id: policy.id || Math.random().toString(36).substr(2, 9) };
    const updated = [...policies, newPolicy];
    
    if (uid) {
      // Logic for Firestore save
    } else {
      localStorage.setItem('finlytic_policies', JSON.stringify(updated));
    }
    set({ policies: updated });
  },

  deletePolicy: async (id, uid) => {
    const { policies } = get();
    const updated = policies.filter(p => p.id !== id);
    if (uid) {
      // await deleteDoc(doc(db, `users/${uid}/policies`, id));
    } else {
      localStorage.setItem('finlytic_policies', JSON.stringify(updated));
    }
    set({ policies: updated });
  },

  toggleSelect: (id) => {
    const { selectedIds } = get();
    set({
      selectedIds: selectedIds.includes(id)
        ? selectedIds.filter(sid => sid !== id)
        : [...selectedIds, id]
    });
  },

  clearAll: async (uid) => {
    if (uid) {
      // Logic for batch delete in Firestore
    } else {
      localStorage.removeItem('finlytic_policies');
    }
    set({ policies: [], selectedIds: [] });
  }
}));
