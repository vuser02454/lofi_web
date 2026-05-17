import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAudioStore from '../../stores/useAudioStore';
import musicEngine from '../../audio/musicEngine';

// Curated lofi playlists (Spotify embed IDs)
const PLAYLISTS = [
  { id: '0vvXsWCC9xrXsKd4FyS8kM', name: 'Lofi Beats', desc: 'Chill beats to relax' },
  { id: '37i9dQZF1DWZd79rJ6a7lp', name: 'Sleep', desc: 'Calm ambient sleep sounds' },
  { id: '37i9dQZF1DX3rxVfibe1L0', name: 'Mood Booster', desc: 'Feel-good music' },
  { id: '37i9dQZF1DWWQRwui0ExPn', name: 'Lofi Café', desc: 'Coffee shop vibes' },
  { id: '37i9dQZF1DX0SM0LYsmbMT', name: 'Asian Lofi', desc: 'Eastern chill beats' },
  { id: '37i9dQZF1DXc8kgYqQLMfH', name: 'Lofi Rain', desc: 'Rainy day sessions' },
];

export default function SpotifyPlayer() {
  const { musicPlaying, setMusicPlaying } = useAudioStore();
  const [activePlaylist, setActivePlaylist] = useState(
    () => localStorage.getItem('lofi-spotify-playlist') || PLAYLISTS[0].id
  );
  const [customUrl, setCustomUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);

  const switchToPlaylist = useCallback((playlistId) => {
    // Pause generative music when switching to Spotify
    if (musicEngine.isPlaying()) {
      musicEngine.pause();
      setMusicPlaying(false);
    }
    setActivePlaylist(playlistId);
    localStorage.setItem('lofi-spotify-playlist', playlistId);
    setShowPlaylistPicker(false);
  }, [setMusicPlaying]);

  const handleCustomUrl = useCallback(() => {
    // Extract playlist ID from various Spotify URL formats
    const match = customUrl.match(/playlist[/:]([a-zA-Z0-9]+)/);
    if (match) {
      switchToPlaylist(match[1]);
      setCustomUrl('');
      setShowCustomInput(false);
    }
  }, [customUrl, switchToPlaylist]);

  const currentPlaylist = PLAYLISTS.find(p => p.id === activePlaylist);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-solid rounded-2xl overflow-hidden w-full max-w-sm"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" className="text-[#1DB954]">
            <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <div>
            <p className="text-xs font-medium text-white">Spotify</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              {currentPlaylist?.name || 'Custom Playlist'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Playlist picker toggle */}
          <button
            onClick={() => { setShowPlaylistPicker(!showPlaylistPicker); setShowCustomInput(false); }}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              showPlaylistPicker ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
            aria-label="Browse playlists"
            id="spotify-browse-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>

          {/* Custom URL toggle */}
          <button
            onClick={() => { setShowCustomInput(!showCustomInput); setShowPlaylistPicker(false); }}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              showCustomInput ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
            aria-label="Paste custom URL"
            id="spotify-custom-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </button>
        </div>
      </div>

      {/* Playlist picker */}
      <AnimatePresence>
        {showPlaylistPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2 grid grid-cols-2 gap-1.5">
              {PLAYLISTS.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => switchToPlaylist(pl.id)}
                  className={`text-left p-2 rounded-lg transition-all duration-200 ${
                    activePlaylist === pl.id
                      ? 'bg-[#1DB954]/15 ring-1 ring-[#1DB954]/30'
                      : 'bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}
                  id={`spotify-playlist-${pl.id}`}
                >
                  <p className="text-[11px] font-medium text-white/90 truncate">{pl.name}</p>
                  <p className="text-[9px] mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>{pl.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom URL input */}
      <AnimatePresence>
        {showCustomInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2 flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomUrl()}
                placeholder="Paste Spotify playlist URL..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#1DB954]/50 transition-colors"
                id="spotify-custom-url-input"
              />
              <button
                onClick={handleCustomUrl}
                className="px-3 py-2 bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-[#1DB954] rounded-lg text-xs font-medium transition-colors"
                id="spotify-custom-url-submit"
              >
                Go
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotify Embed Player */}
      <div className="w-full" style={{ minHeight: 152 }}>
        <iframe
          key={activePlaylist}
          title="Spotify Lofi Player"
          src={`https://open.spotify.com/embed/playlist/${activePlaylist}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{
            borderRadius: '0 0 12px 12px',
            border: 'none',
          }}
        />
      </div>
    </motion.div>
  );
}
