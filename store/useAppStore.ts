/**
 * Zustand store for global application state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, FilterState } from '@/types';

interface AppStore extends AppState {
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSelectedExchange: (exchangeId: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setTimeRange: (range: '1h' | '24h' | '7d' | '30d') => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  selectedExchanges: [],
  selectedCloudProviders: [],
  latencyThreshold: {
    min: 0,
    max: 500,
  },
  showCloudRegions: true,
  showConnections: true,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      filters: defaultFilters,
      selectedExchange: null,
      isPlaying: false,
      timeRange: '24h',

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      setSelectedExchange: (exchangeId) => set({ selectedExchange: exchangeId }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setTimeRange: (timeRange) => set({ timeRange }),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'latency-visualizer-storage',
      partialize: (state) => ({ theme: state.theme, filters: state.filters }),
    }
  )
);

