import { create } from 'zustand';

const backgrounds = [
  { id: 'howls', name: "Howl's Castle", media: '/videos/howls.mp4' },
  { id: 'kiki', name: "Kiki's Delivery", media: '/videos/kiki.mp4' },
  { id: 'totoro', name: 'My Neighbor Totoro', media: '/videos/totoro.mp4' },
  { id: 'grave', name: 'Grave of Fireflies', media: '/videos/grave.mp4' },
  { id: 'relax', name: 'Relax Vibes', media: '/videos/relax.mp4' },
];

const useBackgroundStore = create((set) => ({
  backgrounds,
  currentBg: 0,
  setCurrentBg: (i) => set({ currentBg: i }),
  nextBg: () => set((s) => ({ currentBg: (s.currentBg + 1) % backgrounds.length })),
  prevBg: () => set((s) => ({ currentBg: (s.currentBg - 1 + backgrounds.length) % backgrounds.length })),
}));

export default useBackgroundStore;
