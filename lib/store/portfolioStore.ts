import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Holding {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
}

interface PortfolioState {
  // State
  coins: string[];
  holdings: Holding[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addCoin: (coinId: string) => void;
  removeCoin: (coinId: string) => void;
  addMultipleCoins: (coinIds: string[]) => void;
  clearPortfolio: () => void;
  setHoldings: (holdings: Holding[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  validateAndCleanCoins: () => string[];
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      // Initial state
      coins: [],
      holdings: [],
      loading: false,
      error: null,

      // Actions
      addCoin: (coinId: string) => {
        const { coins } = get();
        if (!coins.includes(coinId)) {
          set({ coins: [...coins, coinId] });
        }
      },

      removeCoin: (coinId: string) => {
        const { coins, holdings } = get();
        set({ 
          coins: coins.filter(id => id !== coinId),
          holdings: holdings.filter(holding => holding.id !== coinId)
        });
      },

      addMultipleCoins: (coinIds: string[]) => {
        const { coins } = get();
        const newCoins = coinIds.filter(id => !coins.includes(id));
        if (newCoins.length > 0) {
          set({ coins: [...coins, ...newCoins] });
        }
      },

      clearPortfolio: () => {
        set({ coins: [], holdings: [], error: null });
      },

      setHoldings: (holdings: Holding[]) => {
        set({ holdings });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      validateAndCleanCoins: () => {
        const { coins } = get();
        
        // Filter out obviously invalid IDs
        const validCoins = coins.filter(id => 
          id && 
          typeof id === 'string' && 
          id.trim() !== '' && 
          !id.includes(' ') && 
          id.length > 0 &&
          id.length < 50 // Reasonable length for a coin ID
        );

        // Update state if any invalid coins were found
        if (validCoins.length !== coins.length) {
          set({ coins: validCoins });
        }

        return validCoins;
      },
    }),
    {
      name: 'portfolio-storage', // unique name for localStorage key
      partialize: (state) => ({ coins: state.coins }), // only persist coins array
    }
  )
);
