import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useAudioStore from '../../stores/useAudioStore';
import ambientEngine from '../../audio/ambientEngine';
import GlassPanel from '../UI/GlassPanel';

const ambientChannels = [
  { key: 'rain', label: '雨 Rain', icon: '🌧️', enableKey: 'rainEnabled', volumeKey: 'rainVolume', toggleKey: 'toggleRain', setVolumeKey: 'setRainVolume' },
  { key: 'cafe', label: 'カフェ Café', icon: '☕', enableKey: 'cafeEnabled', volumeKey: 'cafeVolume', toggleKey: 'toggleCafe', setVolumeKey: 'setCafeVolume' },
  { key: 'wind', label: '風 Wind', icon: '🍃', enableKey: 'windEnabled', volumeKey: 'windVolume', toggleKey: 'toggleWind', setVolumeKey: 'setWindVolume' },
  { key: 'crackle', label: 'レコード Vinyl', icon: '💿', enableKey: 'crackleEnabled', volumeKey: 'crackleVolume', toggleKey: 'toggleCrackle', setVolumeKey: 'setCrackleVolume' },
];

export default function AmbientControls() {
  const store = useAudioStore();

  // Sync ambient volumes
  useEffect(() => {
    if (!ambientEngine.started) return;
    ambientChannels.forEach(({ key, enableKey, volumeKey }) => {
      const enabled = store[enableKey];
      const volume = store[volumeKey];
      ambientEngine.setVolume(key, enabled ? volume : 0);
    });
  }, [
    store.rainEnabled, store.rainVolume,
    store.cafeEnabled, store.cafeVolume,
    store.windEnabled, store.windVolume,
    store.crackleEnabled, store.crackleVolume,
  ]);

  return (
    <GlassPanel className="w-full max-w-xs">
      <h3 className="text-sm font-medium tracking-[0.15em] uppercase mb-4" style={{ color: 'var(--color-text-dim)' }}>
        🎧 Ambient Sounds
      </h3>

      <div className="space-y-3">
        {ambientChannels.map(({ key, label, icon, enableKey, volumeKey, toggleKey, setVolumeKey }) => (
          <div key={key} className="flex items-center gap-3">
            <button
              onClick={() => store[toggleKey]()}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${
                store[enableKey]
                  ? 'bg-purple-500/20 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5'
              }`}
              id={`ambient-toggle-${key}`}
              aria-label={`Toggle ${key}`}
            >
              {icon}
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-xs mb-1 truncate" style={{ color: store[enableKey] ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                {label}
              </p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={store[enableKey] ? store[volumeKey] : 0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  store[setVolumeKey](val);
                  if (val > 0 && !store[enableKey]) store[toggleKey]();
                  if (val === 0 && store[enableKey]) store[toggleKey]();
                }}
                className="w-full"
                id={`ambient-volume-${key}`}
                aria-label={`${key} volume`}
              />
            </div>

            {/* Level indicator */}
            <div className="flex gap-[2px] items-end h-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{
                    backgroundColor: store[enableKey] && store[volumeKey] > i * 0.2
                      ? 'rgba(139, 92, 246, 0.7)'
                      : 'rgba(255,255,255,0.1)',
                    height: 4 + i * 2,
                  }}
                  animate={store[enableKey] ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
