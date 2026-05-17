import { useEffect, useRef } from 'react';
import useAppStore from '../../stores/useAppStore';

function HtmlBackground() {
  const currentScene = useAppStore((s) => s.currentScene);
  const bgRef = useRef(null);

  // Map scenes to the user's provided GIFs
  const gifs = {
    'rainy-cafe': '/gifs/kikis delivery service majo no takkybin GIF by Maudit.gif',
    'urban-rooftop': '/gifs/howls moving castle GIF.gif',
    'midnight-garden': '/gifs/my neighbor totoro GIF by Maudit.gif',
    'neon-alley': '/gifs/kikis delivery service majo no takkybin GIF by Maudit.gif',
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // Move up to 20px
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      bgRef.current.style.transform = `translate(${-x}px, ${-y}px) scale(1.05)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden bg-black">
      <img 
        ref={bgRef}
        src={gifs[currentScene] || gifs['rainy-cafe']}
        alt="Anime Background"
        className="w-full h-full object-cover transition-opacity duration-1000"
        style={{ transform: 'scale(1.05)', transition: 'transform 0.1s ease-out' }}
      />
    </div>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <HtmlBackground />
    </div>
  );
}
