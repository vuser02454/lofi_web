import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAudioStore = create(
  persist(
    (set) => ({
      musicPlaying: false,
      musicVolume: 0.5,
      currentTrack: 0,

      rainVolume: 0.6,
      cafeVolume: 0.0,
      windVolume: 0.0,
      crackleVolume: 0.2,

      rainEnabled: true,
      cafeEnabled: false,
      windEnabled: false,
      crackleEnabled: true,

      toggleMusic: () => set((s) => ({ musicPlaying: !s.musicPlaying })),
      setMusicPlaying: (val) => set({ musicPlaying: val }),
      setMusicVolume: (vol) => set({ musicVolume: vol }),
      nextTrack: () => set((s) => ({ currentTrack: (s.currentTrack + 1) % 4 })),
      prevTrack: () => set((s) => ({ currentTrack: (s.currentTrack - 1 + 4) % 4 })),

      setRainVolume: (vol) => set({ rainVolume: vol }),
      setCafeVolume: (vol) => set({ cafeVolume: vol }),
      setWindVolume: (vol) => set({ windVolume: vol }),
      setCrackleVolume: (vol) => set({ crackleVolume: vol }),

      toggleRain: () => set((s) => ({ rainEnabled: !s.rainEnabled })),
      toggleCafe: () => set((s) => ({ cafeEnabled: !s.cafeEnabled })),
      toggleWind: () => set((s) => ({ windEnabled: !s.windEnabled })),
      toggleCrackle: () => set((s) => ({ crackleEnabled: !s.crackleEnabled })),
    }),
    {
      name: 'lofi-audio-store',
      partialize: (state) => ({
        musicVolume: state.musicVolume,
        rainVolume: state.rainVolume,
        cafeVolume: state.cafeVolume,
        windVolume: state.windVolume,
        crackleVolume: state.crackleVolume,
        rainEnabled: state.rainEnabled,
        cafeEnabled: state.cafeEnabled,
        windEnabled: state.windEnabled,
        crackleEnabled: state.crackleEnabled,
      }),
    }
  )
);

export default useAudioStore;
