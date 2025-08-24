import { create } from 'zustand';
import { Session } from 'next-auth';

interface AuthState {
  // State
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setSession: (session: Session | null) => void;
  setIsLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  session: null,
  isAuthenticated: false,
  isLoading: true,

  // Actions
  setSession: (session: Session | null) => {
    set({ 
      session, 
      isAuthenticated: !!session,
      isLoading: false 
    });
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  signOut: () => {
    set({ 
      session: null, 
      isAuthenticated: false,
      isLoading: false 
    });
  },
}));
