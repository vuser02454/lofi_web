import useBackgroundStore from '../../stores/useBackgroundStore';

export default function MediaBackground() {
  const { backgrounds, currentBg } = useBackgroundStore();
  const bg = backgrounds[currentBg];

  const isVideo = bg.media?.endsWith('.mp4');

  return (
    <div className="fixed inset-0" style={{ width: '100vw', height: '100vh', height: '100dvh' }}>
      {isVideo ? (
        <video
          key={bg.id}
          src={bg.media}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minWidth: '100vw', minHeight: '100vh', minHeight: '100dvh' }}
        />
      ) : (
        <img
          key={bg.id}
          src={bg.media || bg.gif}
          alt={bg.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minWidth: '100vw', minHeight: '100vh', minHeight: '100dvh' }}
        />
      )}
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)' }}
      />
    </div>
  );
}
