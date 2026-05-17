import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../stores/useAppStore';
import useFullscreen from '../../hooks/useFullscreen';
import SceneSelector from './SceneSelector';
import AmbientControls from '../Audio/AmbientControls';
import PomodoroTimer from '../Timer/PomodoroTimer';
import SpotifyPlayer from '../Audio/SpotifyPlayer';

export default function Sidebar() {
  const {
    showUI, toggleUI,
    isSidebarOpen, sidebarTab, setSidebarTab, closeSidebar
  } = useAppStore();
  
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  if (!showUI) return null;

  const tabs = [
    {
      id: 'scenes',
      label: 'Scenes',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      )
    },
    {
      id: 'ambient',
      label: 'Ambient',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
    },
    {
      id: 'timer',
      label: 'Timer',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
    },
    {
      id: 'spotify',
      label: 'Spotify',
      accentColor: '#1DB954',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      )
    }
  ];

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full flex z-50 select-none"
    >
      {/* Icon Navigation Rail */}
      <div className="w-16 h-full glass-solid border-r border-white/5 flex flex-col items-center py-8 justify-between relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col gap-6 w-full">
          {tabs.map((tab) => {
            const isActive = isSidebarOpen && sidebarTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarTab(tab.id)}
                className={`relative flex flex-col items-center justify-center w-full py-2 transition-colors ${
                  isActive ? (tab.accentColor ? 'text-white' : 'text-purple-300') : 'text-white/40 hover:text-white/80'
                }`}
                style={isActive && tab.accentColor ? { color: tab.accentColor } : {}}
              >
                {tab.icon}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-full bg-purple-400 rounded-r-md"
                    style={{
                      backgroundColor: tab.accentColor || '#a78bfa',
                      boxShadow: `2px 0 8px ${tab.accentColor || 'rgba(139,92,246,0.6)'}`,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-6 w-full mt-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className={`flex flex-col items-center justify-center w-full transition-colors ${isFullscreen ? 'text-purple-300' : 'text-white/40 hover:text-white/80'}`}
          >
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleUI}
            className="flex flex-col items-center justify-center w-full text-white/40 hover:text-white/80 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Expandable Content Area */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80 h-full glass-panel border-r border-white/5 flex flex-col relative z-10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
              <h2 className="text-sm font-medium tracking-widest uppercase text-white/80">
                {tabs.find(t => t.id === sidebarTab)?.label}
              </h2>
              <button 
                onClick={closeSidebar}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sidebarTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {sidebarTab === 'scenes' && <SceneSelector />}
                  {sidebarTab === 'ambient' && <AmbientControls />}
                  {sidebarTab === 'timer' && <PomodoroTimer />}
                  {sidebarTab === 'spotify' && <SpotifyPlayer />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
