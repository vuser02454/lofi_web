import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../stores/useAppStore';
import { getScene } from '../../scenes/scenes';

export default function SceneBackground() {
  const currentScene = useAppStore((s) => s.currentScene);
  const scene = getScene(currentScene);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-0"
      >
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${scene.gradient[0]} 0%, ${scene.gradient[1]} 50%, ${scene.gradient[2]} 100%)`,
          }}
        />

        {/* Ambient light overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 80%, ${scene.warmGlow} 0%, transparent 60%),
                         radial-gradient(ellipse at 70% 20%, ${scene.accentColor.replace(/[\d.]+\)$/, '0.08)')} 0%, transparent 50%)`,
          }}
        />

        {/* Neon light sources */}
        {scene.neonColors.map((color, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            animate={{
              opacity: [0.15, 0.3, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
            style={{
              width: 200 + i * 80,
              height: 200 + i * 80,
              left: `${15 + i * 30}%`,
              top: `${50 + (i % 2 === 0 ? 10 : -15)}%`,
              background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
        ))}

        {/* Window/building silhouettes */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%]"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)`,
          }}
        />

        {/* Building shapes */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] flex items-end justify-center gap-1 px-4 overflow-hidden opacity-30">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{
                width: 30 + Math.random() * 40,
                height: `${30 + Math.random() * 70}%`,
                background: `linear-gradient(to top, rgba(10,10,20,0.9) 0%, rgba(20,15,35,0.7) 100%)`,
                borderRadius: '2px 2px 0 0',
              }}
            >
              {/* Tiny windows */}
              <div className="flex flex-wrap gap-1 p-1 justify-center mt-2">
                {Array.from({ length: Math.floor(Math.random() * 8) + 2 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-1.5 h-1.5 rounded-[1px]"
                    style={{
                      backgroundColor: Math.random() > 0.5
                        ? scene.neonColors[j % scene.neonColors.length] + '55'
                        : 'rgba(255,200,100,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cinematic vignette */}
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Film grain overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '128px',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
