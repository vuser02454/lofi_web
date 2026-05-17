import { create } from 'zustand';

const backgrounds = [
  { id: 'kimi-1', name: "Kimi No Nawa 1", media: '/videos/kimi-no-nawa-1.mp4' },
  { id: 'kimi-2', name: "Kimi No Nawa 2", media: '/videos/kimi-no-nawa-2.mp4' },
  { id: 'kimi-3', name: "Kimi No Nawa 3", media: '/videos/kimi-no-nawa-3.mp4' },
  { id: 'garden-1', name: "Garden of Words", media: '/videos/garden-of-words.mp4' },
  { id: 'weathering-1', name: "Weathering With You", media: '/videos/weathering-with-you.mp4' },
];

const useBackgroundStore = create((set) => ({
  backgrounds,
  currentBg: 0,
  setCurrentBg: (i) => set({ currentBg: i }),
  nextBg: () => set((s) => ({ currentBg: (s.currentBg + 1) % backgrounds.length })),
  prevBg: () => set((s) => ({ currentBg: (s.currentBg - 1 + backgrounds.length) % backgrounds.length })),
}));

export default useBackgroundStore;
