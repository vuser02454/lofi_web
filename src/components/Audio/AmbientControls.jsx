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
    <section className="card-glass rounded-3xl p-5 flex flex-col gap-4">
      <h3 className="text-[10px] uppercase tracking-[0.15em] text-secondary font-medium">
        🎧 Ambient Sounds
      </h3>

      <div className="space-y-4">
        {ambientChannels.map(({ key, label, icon, enableKey, volumeKey, toggleKey, setVolumeKey }) => (
          <div key={key} className="flex items-center gap-3">
            <button
              onClick={() => store[toggleKey]()}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${
                store[enableKey]
                  ? 'bg-primary/20 text-primary shadow-[0_0_12px_rgba(99,83,135,0.2)]'
                  : 'bg-surface-variant/20 text-outline hover:bg-surface-variant/40'
              }`}
              id={`ambient-toggle-${key}`}
              aria-label={`Toggle ${key}`}
            >
              {icon}
            </button>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-xs mb-1.5 font-medium truncate" style={{ color: store[enableKey] ? '#1c1c19' : '#7a757f' }}>
                {label.split(' ')[1]}
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
          </div>
        ))}
      </div>
    </section>
  );
}
