import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import useAudioStore from '../../stores/useAudioStore';
import musicEngine from '../../audio/musicEngine';
import ambientEngine from '../../audio/ambientEngine';
import { trackNames } from '../../scenes/scenes';
import useBackgroundStore from '../../stores/useBackgroundStore';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Tiny sub-components (defined outside render) ── */

const TodoItem = ({ text, initialChecked = false }) => {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <li className="flex items-center gap-3 group cursor-pointer py-1" onClick={() => setChecked(!checked)}>
      <span className={`material-symbols-outlined text-lg transition-colors ${checked ? 'text-primary' : 'text-outline-variant group-hover:text-primary'}`}>
        {checked ? 'check_circle' : 'radio_button_unchecked'}
      </span>
      <span className={`text-sm transition-colors ${checked ? 'text-outline line-through' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
        {text}
      </span>
    </li>
  );
};

const TabButton = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl text-xs font-medium tracking-wide uppercase transition-all duration-300 ${
      active
        ? 'bg-primary/15 text-primary shadow-sm'
        : 'text-outline hover:text-on-surface-variant hover:bg-surface-variant/30'
    }`}
  >
    <span className="material-symbols-outlined text-xl" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
    {label}
  </button>
);

const AmbientSlider = ({ icon, label, enabled, volume, onToggle, onVolume }) => (
  <div className="flex items-center gap-3">
    <button
      onClick={onToggle}
      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-300 ${
        enabled ? 'bg-primary/20 shadow-[0_0_10px_rgba(99,83,135,0.25)]' : 'bg-surface-variant/40'
      }`}
    >{icon}</button>
    <div className="flex-1 min-w-0">
      <p className={`text-[11px] mb-1 truncate ${enabled ? 'text-on-surface' : 'text-outline'}`}>{label}</p>
      <input
        type="range" min="0" max="1" step="0.01"
        value={enabled ? volume : 0}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          onVolume(v);
          if (v > 0 && !enabled) onToggle();
          if (v === 0 && enabled) onToggle();
        }}
        className="w-full accent-primary h-1"
      />
    </div>
  </div>
);

/* ── Main Component ── */

const LoFiDashboard = () => {
  const store = useAudioStore();
  const {
    musicPlaying, currentTrack, musicVolume,
    toggleMusic, setMusicPlaying, nextTrack, prevTrack, setMusicVolume,
  } = store;

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('music');   // music | pomodoro | timer
  const [musicSource, setMusicSource] = useState('local'); // local | spotify
  const [spotifyInput, setSpotifyInput] = useState('');
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState('https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const initRef = useRef(false);

  // Background state
  const { backgrounds, currentBg, nextBg, prevBg } = useBackgroundStore();

  // Pomodoro state
  const [pomodoroSec, setPomodoroSec] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('focus'); // focus | short | long
  const pomodoroPresets = useMemo(() => ({ focus: 25 * 60, short: 5 * 60, long: 15 * 60 }), []);

  // Stopwatch / Timer state
  const [stopwatchSec, setStopwatchSec] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  /* ── Audio init ── */
  const initAudio = useCallback(async () => {
    if (initRef.current) return;
    initRef.current = true;
    setLoading(true);
    try {
      await ambientEngine.init();
      await musicEngine.loadTrack(currentTrack);
      setInitialized(true);
    } catch (e) { console.error('Audio init failed:', e); }
    setLoading(false);
  }, [currentTrack]);

  useEffect(() => {
    if (!initialized) return;
    if (musicPlaying) musicEngine.play(musicVolume);
    else musicEngine.pause();
  }, [musicPlaying, initialized, musicVolume]);

  useEffect(() => {
    if (!initialized) return;
    const wasPlaying = musicPlaying;
    (async () => {
      setLoading(true);
      await musicEngine.loadTrack(currentTrack);
      if (wasPlaying) musicEngine.play(musicVolume);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, initialized]);

  const handlePlayClick = async () => {
    if (!initialized) { await initAudio(); setMusicPlaying(true); musicEngine.play(musicVolume); return; }
    toggleMusic();
  };

  const handleSpotifySubmit = (e) => {
    e.preventDefault();
    const match = spotifyInput.match(/spotify\.com\/(playlist|album|track|show|episode|artist)\/([a-zA-Z0-9]+)/);
    if (match) {
      setSpotifyEmbedUrl(`https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`);
    } else if (spotifyInput.includes('spotify:')) {
      const parts = spotifyInput.split(':');
      if (parts.length >= 3) {
        setSpotifyEmbedUrl(`https://open.spotify.com/embed/${parts[1]}/${parts[2]}?utm_source=generator&theme=0`);
      }
    }
    setSpotifyInput('');
  };

  /* ── Ambient sync ── */
  useEffect(() => {
    if (!ambientEngine.started) return;
    const channels = ['rain', 'cafe', 'wind', 'crackle'];
    channels.forEach((k) => {
      const enabled = store[`${k}Enabled`];
      const vol = store[`${k}Volume`];
      ambientEngine.setVolume(k, enabled ? vol : 0);
    });
  }, [store.rainEnabled, store.rainVolume, store.cafeEnabled, store.cafeVolume,
      store.windEnabled, store.windVolume, store.crackleEnabled, store.crackleVolume, store]);

  /* ── Pomodoro tick ── */
  useEffect(() => {
    if (!pomodoroRunning || pomodoroSec <= 0) return;
    const id = setInterval(() => setPomodoroSec((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [pomodoroRunning, pomodoroSec]);

  useEffect(() => {
    if (pomodoroSec === 0 && pomodoroRunning) {
      setTimeout(() => { setPomodoroRunning(false); alert('Session complete! Take a breath. 🌿'); }, 0);
    }
  }, [pomodoroSec, pomodoroRunning]);

  /* ── Stopwatch tick ── */
  useEffect(() => {
    if (!stopwatchRunning) return;
    const id = setInterval(() => setStopwatchSec((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, [stopwatchRunning]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
    return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  const switchPomodoroMode = (mode) => {
    setPomodoroMode(mode);
    setPomodoroSec(pomodoroPresets[mode]);
    setPomodoroRunning(false);
  };

  /* ── Pomodoro ring progress ── */
  const pomodoroTotal = pomodoroPresets[pomodoroMode];
  const pomodoroProgress = pomodoroTotal > 0 ? ((pomodoroTotal - pomodoroSec) / pomodoroTotal) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (pomodoroProgress / 100) * circumference;

  const track = trackNames[currentTrack];

  return (
    <>
      {/* ── Toggle FAB ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-5 z-50 w-14 h-14 rounded-2xl glass-panel flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-500 shadow-lg group ${isOpen ? 'right-5 sm:right-[440px]' : 'right-5'}`}
        style={{ color: '#1c1c19' }}
      >
        <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:rotate-90">
          {isOpen ? 'close' : 'tune'}
        </span>
      </button>

      {/* ── Overlay backdrop (mobile) ── */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 sm:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* ── Drawer ── */}
      <div className={`fixed top-0 right-0 h-full w-[85vw] max-w-[380px] sm:max-w-none sm:w-[420px] z-40 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full glass-panel overflow-y-auto overflow-x-hidden"
          style={{ borderLeft: '1px solid rgba(229,226,221,0.15)' }}
        >
          <div className="absolute inset-0 grain-texture z-0 pointer-events-none"></div>

          <div className="relative z-10 p-5 pt-7 pb-10 flex flex-col gap-5" style={{ color: '#1c1c19' }}>

            {/* ── Header ── */}
            <div className="flex flex-col gap-4 mb-2">
              <div className="flex items-center justify-between pr-14 sm:pr-0">
                <div className="flex items-center gap-3">
                  <img
                    alt="avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant/50"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-medium">Good evening</p>
                    <p className="text-base font-headline-lg leading-tight">Avery</p>
                  </div>
                </div>
              </div>
              
              {/* Background Controls */}
              <div className="flex items-center justify-between bg-surface-variant/40 rounded-xl p-2 px-3 pr-14 sm:pr-3 soft-shadow">
                <span className="text-[10px] uppercase tracking-[0.15em] text-secondary font-medium hidden sm:inline-block">Scene</span>
                <div className="flex items-center justify-end flex-1 gap-3">
                  <div className="flex items-center gap-1">
                    <button onClick={prevBg} className="material-symbols-outlined text-sm text-outline hover:text-primary">chevron_left</button>
                    <span className="text-[10px] text-secondary font-medium truncate max-w-[150px]">{backgrounds[currentBg].name}</span>
                    <button onClick={nextBg} className="material-symbols-outlined text-sm text-outline hover:text-primary">chevron_right</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Tab Bar ── */}
            <div className="flex gap-1.5 p-1 bg-surface-variant/40 rounded-2xl">
              <TabButton active={activeTab === 'music'} icon="headphones" label="Music" onClick={() => setActiveTab('music')} />
              <TabButton active={activeTab === 'pomodoro'} icon="target" label="Pomodoro" onClick={() => setActiveTab('pomodoro')} />
              <TabButton active={activeTab === 'timer'} icon="timer" label="Timer" onClick={() => setActiveTab('timer')} />
            </div>

            {/* ━━━ TABS ━━━ */}
            <AnimatePresence mode="wait">
              {activeTab === 'music' && (
                <motion.div
                  key="music"
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  {/* Player Card */}
                  <section className="bg-surface/50 backdrop-blur-md rounded-3xl overflow-hidden soft-shadow analog-border flex flex-col">
                    {/* Source Toggle */}
                    <div className="flex gap-1 p-2 bg-surface-variant/20">
                      <button onClick={() => setMusicSource('local')} className={`flex-1 py-1.5 rounded-xl text-[10px] font-medium uppercase tracking-wider transition-all ${musicSource === 'local' ? 'bg-primary/20 text-primary' : 'text-outline hover:text-primary'}`}>Local Chill</button>
                      <button onClick={() => setMusicSource('spotify')} className={`flex-1 py-1.5 rounded-xl text-[10px] font-medium uppercase tracking-wider transition-all ${musicSource === 'spotify' ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'text-outline hover:text-[#1DB954]'}`}>Spotify</button>
                    </div>

                    {musicSource === 'local' ? (
                      <>
                        <div className="relative w-full aspect-[16/9]">
                          <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80"
                            alt="cover" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          <div className="absolute bottom-4 left-5 right-5">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-1">Now Playing</p>
                            <h2 className="text-lg font-headline-lg text-white leading-tight">{track?.name || 'Midnight Coffee'}</h2>
                            <p className="text-xs text-white/60 mt-0.5">{track ? `${track.key} · ${track.bpm} BPM` : 'Analog Dreams'}</p>
                          </div>
                          <button className="absolute top-3 right-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-sm">favorite</span>
                          </button>
                        </div>

                        <div className="p-5 pt-4">
                          <div className="relative w-full h-1 bg-surface-variant rounded-full overflow-hidden mb-4">
                            <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: musicPlaying ? '100%' : '0%', transition: 'width 30s linear' }} />
                          </div>
                          <div className="flex items-center justify-center gap-5">
                            <button onClick={prevTrack} className="material-symbols-outlined text-outline hover:text-primary transition-colors text-xl">skip_previous</button>
                            <button onClick={handlePlayClick} disabled={loading}
                              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${musicPlaying ? 'bg-primary-container text-on-surface' : 'bg-primary text-on-primary'}`}>
                              {loading
                                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{musicPlaying ? 'pause' : 'play_arrow'}</span>}
                            </button>
                            <button onClick={nextTrack} className="material-symbols-outlined text-outline hover:text-primary transition-colors text-xl">skip_next</button>
                          </div>
                          {/* Volume */}
                          <div className="flex items-center gap-2 mt-4 px-1">
                            <span className="material-symbols-outlined text-outline text-sm">volume_down</span>
                            <input type="range" min="0" max="1" step="0.01" value={musicVolume}
                              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                              className="flex-1 accent-primary h-1" />
                            <span className="material-symbols-outlined text-outline text-sm">volume_up</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col w-full gap-3 mt-2 px-3 pb-4">
                        <form onSubmit={handleSpotifySubmit} className="relative flex items-center w-full">
                          <span className="material-symbols-outlined absolute left-3 text-outline-variant text-base pointer-events-none">link</span>
                          <input 
                            type="text" 
                            value={spotifyInput}
                            onChange={(e) => setSpotifyInput(e.target.value)}
                            placeholder="Paste Spotify link..."
                            className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-xl pl-9 pr-16 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-variant/40 transition-all placeholder:text-outline-variant/70 backdrop-blur-sm shadow-sm"
                          />
                          <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center justify-center">
                            Load
                          </button>
                        </form>
                        <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-md border border-outline-variant/20 bg-black/5">
                          <iframe 
                            src={spotifyEmbedUrl} 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                            style={{ background: 'transparent' }}
                          >
                          </iframe>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Ambient Sounds */}
                  <section className="bg-surface/50 backdrop-blur-md rounded-3xl p-5 soft-shadow analog-border">
                    <h3 className="text-xs uppercase tracking-[0.15em] text-secondary font-medium mb-4">🎧 Ambient Sounds</h3>
                    <div className="space-y-3">
                      <AmbientSlider icon="🌧️" label="Rain" enabled={store.rainEnabled} volume={store.rainVolume}
                        onToggle={store.toggleRain} onVolume={store.setRainVolume} />
                      <AmbientSlider icon="☕" label="Café" enabled={store.cafeEnabled} volume={store.cafeVolume}
                        onToggle={store.toggleCafe} onVolume={store.setCafeVolume} />
                      <AmbientSlider icon="🍃" label="Wind" enabled={store.windEnabled} volume={store.windVolume}
                        onToggle={store.toggleWind} onVolume={store.setWindVolume} />
                      <AmbientSlider icon="💿" label="Vinyl Crackle" enabled={store.crackleEnabled} volume={store.crackleVolume}
                        onToggle={store.toggleCrackle} onVolume={store.setCrackleVolume} />
                    </div>
                  </section>
                </motion.div>
              )}

              {/* ━━━ POMODORO TAB ━━━ */}
              {activeTab === 'pomodoro' && (
                <motion.div
                  key="pomodoro"
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <section className="bg-surface/50 backdrop-blur-md rounded-3xl p-6 soft-shadow analog-border flex flex-col items-center">
                    {/* Mode switcher */}
                    <div className="flex gap-1 p-1 bg-surface-variant/40 rounded-xl mb-6 w-full">
                      {[['focus','Focus'], ['short','Short'], ['long','Long']].map(([k, l]) => (
                        <button key={k} onClick={() => switchPomodoroMode(k)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${pomodoroMode === k ? 'bg-primary/15 text-primary' : 'text-outline hover:text-on-surface-variant'}`}>
                          {l}
                        </button>
                      ))}
                    </div>

                    {/* Circular timer */}
                    <div className="relative w-40 h-40 mb-6">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(229,226,221,0.3)" strokeWidth="6" />
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#635387" strokeWidth="6"
                          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-1000 ease-linear" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-headline-xl tracking-tight tabular-nums">{fmt(pomodoroSec)}</span>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-secondary mt-1">
                          {pomodoroMode === 'focus' ? 'Focus Time' : pomodoroMode === 'short' ? 'Short Break' : 'Long Break'}
                        </span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                      <button onClick={() => { setPomodoroSec(pomodoroPresets[pomodoroMode]); setPomodoroRunning(false); }}
                        className="w-10 h-10 rounded-full border border-outline-variant hover:border-primary flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-lg text-outline">restart_alt</span>
                      </button>
                      <button onClick={() => setPomodoroRunning(!pomodoroRunning)}
                        className={`px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${pomodoroRunning ? 'bg-primary-container text-on-surface' : 'bg-primary text-on-primary shadow-md'}`}>
                        {pomodoroRunning ? 'Pause' : 'Start'}
                      </button>
                      <button onClick={() => { switchPomodoroMode(pomodoroMode === 'focus' ? 'short' : 'focus'); }}
                        className="w-10 h-10 rounded-full border border-outline-variant hover:border-primary flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-lg text-outline">skip_next</span>
                      </button>
                    </div>

                    {/* Session dots */}
                    <div className="flex gap-2 mt-6">
                      {[0,1,2,3].map((i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-opacity ${i === 0 ? 'bg-primary' : 'bg-primary/30'}`} />
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {/* ━━━ TIMER (Stopwatch) TAB ━━━ */}
              {activeTab === 'timer' && (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <section className="bg-surface/50 backdrop-blur-md rounded-3xl p-6 soft-shadow analog-border flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-secondary font-medium mb-4">Stopwatch</span>

                    <div className="text-5xl font-headline-xl tracking-tight tabular-nums mb-6">
                      {fmt(stopwatchSec)}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <button onClick={() => { setStopwatchSec(0); setStopwatchRunning(false); setLaps([]); }}
                        className="w-10 h-10 rounded-full border border-outline-variant hover:border-primary flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-lg text-outline">restart_alt</span>
                      </button>
                      <button onClick={() => setStopwatchRunning(!stopwatchRunning)}
                        className={`px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${stopwatchRunning ? 'bg-primary-container text-on-surface' : 'bg-primary text-on-primary shadow-md'}`}>
                        {stopwatchRunning ? 'Pause' : 'Start'}
                      </button>
                      <button onClick={() => { if (stopwatchRunning) setLaps((p) => [...p, stopwatchSec]); }}
                        disabled={!stopwatchRunning}
                        className="w-10 h-10 rounded-full border border-outline-variant hover:border-primary flex items-center justify-center transition-colors disabled:opacity-30">
                        <span className="material-symbols-outlined text-lg text-outline">flag</span>
                      </button>
                    </div>

                    {/* Laps */}
                    {laps.length > 0 && (
                      <div className="w-full border-t border-surface-variant pt-4 max-h-48 overflow-y-auto">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-secondary font-medium mb-3">Laps</p>
                        {laps.map((t, i) => (
                          <div key={i} className="flex justify-between py-1.5 text-sm border-b border-surface-variant/50 last:border-b-0">
                            <span className="text-outline">Lap {i + 1}</span>
                            <span className="tabular-nums font-medium">{fmt(t)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Tasks (always visible) ── */}
            <section className="bg-surface/50 backdrop-blur-md rounded-3xl p-5 soft-shadow analog-border">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-sm font-headline-lg-mobile">Unfinished notes</h3>
                <span className="text-xs text-outline">3 items</span>
              </div>
              <ul className="flex flex-col gap-2">
                <TodoItem text="Finish chapter 4 of 'The Slow Home'" initialChecked={true} />
                <TodoItem text="Water the monstera and snake plant" />
                <TodoItem text="Journal about today's quiet moments" />
              </ul>
              <button className="flex items-center gap-1.5 text-outline hover:text-primary transition-colors text-xs mt-4 pt-3 border-t border-surface-variant/50">
                <span className="material-symbols-outlined text-base">add</span>
                Write a new thought
              </button>
            </section>

            {/* ── Mood ── */}
            <section className="bg-surface/50 backdrop-blur-md rounded-3xl p-5 soft-shadow analog-border">
              <h3 className="text-sm font-medium text-center mb-4">How are you feeling?</h3>
              <div className="flex justify-between items-center text-2xl px-2">
                {['😔','😐','😌','😊','✨'].map((e, i) => (
                  <button key={i} className="hover:scale-125 transition-transform opacity-50 hover:opacity-100 grayscale hover:grayscale-0">{e}</button>
                ))}
              </div>
              <p className="mt-4 text-on-surface-variant italic text-xs text-center">
                "The slow rhythm of the evening is your sanctuary."
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default LoFiDashboard;
