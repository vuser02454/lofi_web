import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      currentScene: 'rainy-cafe',
      isFullscreen: false,
      showUI: true,
      
      isSidebarOpen: false,
      sidebarTab: 'scenes', // 'scenes', 'ambient', 'timer', 'spotify'

      setScene: (scene) => set({ currentScene: scene }),
      toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
      setFullscreen: (val) => set({ isFullscreen: val }),
      toggleUI: () => set((s) => ({ showUI: !s.showUI })),
      
      setSidebarTab: (tab) => set((s) => {
        if (s.isSidebarOpen && s.sidebarTab === tab) {
          return { isSidebarOpen: false };
        }
        return { isSidebarOpen: true, sidebarTab: tab };
      }),
      closeSidebar: () => set({ isSidebarOpen: false }),
    }),
    { name: 'lofi-app-store', partialize: (state) => ({ currentScene: state.currentScene, isSidebarOpen: state.isSidebarOpen, sidebarTab: state.sidebarTab }) }
  )
);

export default useAppStore;
