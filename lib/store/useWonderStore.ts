import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WonderState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  comparison: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  
  isQuickOrderOpen: boolean;
  toggleQuickOrder: (isOpen: boolean) => void;
  
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useWonderStore = create<WonderState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id) => {
        const { favorites } = get();
        if (favorites.includes(id)) {
          set({ favorites: favorites.filter(f => f !== id) });
        } else {
          set({ favorites: [...favorites, id] });
        }
      },
      isFavorite: (id) => get().favorites.includes(id),

      comparison: [],
      addToCompare: (id) => {
        const { comparison } = get();
        if (!comparison.includes(id)) {
          if (comparison.length >= 4) {
            alert('Maximum of 4 expeditions can be compared at once');
            return;
          }
          set({ comparison: [...comparison, id] });
        }
      },
      removeFromCompare: (id) => {
        const { comparison } = get();
        set({ comparison: comparison.filter(c => c !== id) });
      },
      clearCompare: () => set({ comparison: [] }),

      isQuickOrderOpen: false,
      toggleQuickOrder: (isOpen) => set({ isQuickOrderOpen: isOpen }),

      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'kavkazskitur-storage',
    }
  )
);
