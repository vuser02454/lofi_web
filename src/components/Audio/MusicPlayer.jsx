import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAudioStore from '../../stores/useAudioStore';
import musicEngine from '../../audio/musicEngine';
import ambientEngine from '../../audio/ambientEngine';
import { trackNames } from '../../scenes/scenes';

export default function MusicPlayer() {
  const {
    musicPlaying, musicVolume, currentTrack,
    toggleMusic, setMusicPlaying, setMusicVolume, nextTrack, prevTrack,
  } = useAudioStore();

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const initRef = useRef(false);

  const initAudio = useCallback(async () => {
    if (initRef.current) return;
    initRef.current = true;
    setLoading(true);
    try {
      await ambientEngine.init();
      await musicEngine.loadTrack(currentTrack);
      setInitialized(true);
    } catch (e) {
      console.error('Audio init failed:', e);
    }
    setLoading(false);
  }, [currentTrack]);

  // Handle play/pause
  useEffect(() => {
    if (!initialized) return;
    if (musicPlaying) {
      musicEngine.play(musicVolume);
    } else {
      musicEngine.pause();
    }
  }, [musicPlaying, initialized, musicVolume]);

  // Handle volume
  useEffect(() => {
    if (!initialized) return;
    musicEngine.setVolume(musicVolume);
  }, [musicVolume, initialized]);

  // Handle track change
  useEffect(() => {
    if (!initialized) return;
    const wasPlaying = musicPlaying;
    (async () => {
      setLoading(true);
      await musicEngine.loadTrack(currentTrack);
      if (wasPlaying) musicEngine.play(musicVolume);
      setLoading(false);
    })();
  }, [currentTrack, initialized]);

  const handlePlayClick = async () => {
    if (!initialized) {
      await initAudio();
      setMusicPlaying(true);
      musicEngine.play(musicVolume);
      return;
    }
    toggleMusic();
  };

  const track = trackNames[currentTrack];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-solid p-4 sm:p-5 rounded-2xl w-full max-w-sm"
    >
      {/* Track info */}
      <div className="text-center mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Now Playing
            </p>
            <h3 className="text-lg font-medium text-white">{track.name}</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>
              {track.key} · {track.bpm} BPM · Generative
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Visualizer bars */}
      <div className="flex items-end justify-center gap-[3px] h-8 mb-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.6)' }}
            animate={musicPlaying && !loading ? {
              height: [4, 8 + Math.random() * 20, 4],
            } : { height: 4 }}
            transition={{
              duration: 0.4 + Math.random() * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.05,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mb-4">
        <button
          onClick={() => { prevTrack(); }}
          className="text-white/50 hover:text-white transition-colors p-2"
          id="prev-track-btn"
          aria-label="Previous track"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          onClick={handlePlayClick}
          disabled={loading}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.8), rgba(99,102,241,0.8))',
            boxShadow: musicPlaying ? '0 0 30px rgba(139,92,246,0.4)' : 'none',
          }}
          id="play-pause-btn"
          aria-label={musicPlaying ? 'Pause' : 'Play'}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : musicPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => { nextTrack(); }}
          className="text-white/50 hover:text-white transition-colors p-2"
          id="next-track-btn"
          aria-label="Next track"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-3 px-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 flex-shrink-0">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={musicVolume}
          onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
          className="flex-1"
          id="music-volume-slider"
          aria-label="Music volume"
        />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 flex-shrink-0">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      </div>
    </motion.div>
  );
}
