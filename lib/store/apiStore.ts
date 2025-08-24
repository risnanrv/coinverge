import { create } from 'zustand';

interface ApiState {
  // State
  isHealthy: boolean;
  isLoading: boolean;
  lastHealthCheck: Date | null;
  
  // Actions
  setHealthStatus: (isHealthy: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  updateHealthCheck: () => void;
  checkApiHealth: () => Promise<boolean>;
}

export const useApiStore = create<ApiState>((set, get) => ({
  // Initial state
  isHealthy: false,
  isLoading: false,
  lastHealthCheck: null,

  // Actions
  setHealthStatus: (isHealthy: boolean) => set({ isHealthy }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  updateHealthCheck: () => set({ lastHealthCheck: new Date() }),

  checkApiHealth: async () => {
    try {
      set({ isLoading: true });
      
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const isHealthy = response.ok;
      
      set({ 
        isHealthy, 
        isLoading: false,
        lastHealthCheck: new Date()
      });

      return isHealthy;
    } catch (error) {
      console.error('API health check failed:', error);
      set({ 
        isHealthy: false, 
        isLoading: false,
        lastHealthCheck: new Date()
      });
      return false;
    }
  },
}));
