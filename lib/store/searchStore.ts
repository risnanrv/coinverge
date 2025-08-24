import { create } from 'zustand';

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  logo: string;
}

interface SearchState {
  // State
  query: string;
  results: Coin[];
  selected: string[];
  defaultCoins: Coin[];
  
  // Actions
  setQuery: (query: string) => void;
  setResults: (results: Coin[]) => void;
  setDefaultCoins: (coins: Coin[]) => void;
  selectCoin: (coinId: string) => void;
  deselectCoin: (coinId: string) => void;
  clearSelection: () => void;
  isSelected: (coinId: string) => boolean;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  // Initial state
  query: '',
  results: [],
  selected: [],
  defaultCoins: [],

  // Actions
  setQuery: (query: string) => set({ query }),

  setResults: (results: Coin[]) => set({ results }),

  setDefaultCoins: (coins: Coin[]) => set({ defaultCoins: coins }),

  selectCoin: (coinId: string) => {
    const { selected } = get();
    if (!selected.includes(coinId)) {
      set({ selected: [...selected, coinId] });
    }
  },

  deselectCoin: (coinId: string) => {
    const { selected } = get();
    set({ selected: selected.filter(id => id !== coinId) });
  },

  clearSelection: () => set({ selected: [] }),

  isSelected: (coinId: string) => {
    const { selected } = get();
    return selected.includes(coinId);
  },
}));
