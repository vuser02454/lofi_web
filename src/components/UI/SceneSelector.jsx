import { motion } from 'framer-motion';
import useAppStore from '../../stores/useAppStore';
import { scenes } from '../../scenes/scenes';
import GlassPanel from './GlassPanel';

export default function SceneSelector() {
  const { currentScene, setScene } = useAppStore();

  return (
    <GlassPanel className="w-full max-w-xs">
      <h3 className="text-sm font-medium tracking-[0.15em] uppercase mb-4" style={{ color: 'var(--color-text-dim)' }}>
        🎬 Scenes
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {scenes.map((scene) => (
          <motion.button
            key={scene.id}
            onClick={() => setScene(scene.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative overflow-hidden rounded-xl p-3 text-left transition-all duration-300 ${
              currentScene === scene.id
                ? 'ring-1 ring-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                : 'hover:bg-white/5'
            }`}
            style={{
              background: currentScene === scene.id
                ? `linear-gradient(135deg, ${scene.gradient[0]}cc, ${scene.gradient[1]}cc)`
                : 'rgba(255,255,255,0.03)',
            }}
            id={`scene-btn-${scene.id}`}
          >
            {/* Miniature scene preview */}
            <div className="relative h-10 mb-2 rounded-lg overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${scene.gradient[0]}, ${scene.gradient[1]}, ${scene.gradient[2]})`,
              }}
            >
              {/* Mini neon dots */}
              {scene.neonColors.map((c, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: c + '66',
                    left: `${20 + i * 25}%`,
                    top: `${30 + (i % 2) * 30}%`,
                    boxShadow: `0 0 8px ${c}44`,
                  }}
                />
              ))}
            </div>

            <p className="text-xs font-medium text-white/90 font-[var(--font-jp)]">
              {scene.name}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {scene.subtitle}
            </p>

            {currentScene === scene.id && (
              <motion.div
                layoutId="scene-indicator"
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400"
                style={{ boxShadow: '0 0 8px rgba(139,92,246,0.6)' }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </GlassPanel>
  );
}
