import useBackgroundStore from '../../stores/useBackgroundStore';

export default function MediaBackground() {
  const { backgrounds, currentBg } = useBackgroundStore();
  const bg = backgrounds[currentBg];

  const isVideo = bg.media?.endsWith('.mp4');

  return (
    <div className="absolute inset-0 w-full h-full">
      {isVideo ? (
        <video
          key={bg.id}
          src={bg.media}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          key={bg.id}
          src={bg.media || bg.gif}
          alt={bg.name}
          className="w-full h-full object-cover"
        />
      )}
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)' }}
      />
    </div>
  );
}
