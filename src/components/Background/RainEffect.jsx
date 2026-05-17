import { useEffect, useRef } from 'react';
import useAppStore from '../../stores/useAppStore';
import { getScene } from '../../scenes/scenes';

export default function RainEffect() {
  const canvasRef = useRef(null);
  const currentScene = useAppStore((s) => s.currentScene);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const scene = getScene(currentScene);
    const intensity = scene.rainIntensity;
    const wind = scene.windStrength;
    const dropCount = Math.floor(200 * intensity);

    // Initialize drops
    const createDrop = () => ({
      x: Math.random() * canvas.width * 1.2 - canvas.width * 0.1,
      y: Math.random() * -canvas.height,
      length: 15 + Math.random() * 25,
      speed: 8 + Math.random() * 12,
      thickness: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.3,
      depth: Math.random(),
    });

    drops = Array.from({ length: dropCount }, createDrop);

    // Splash particles
    const splashes = [];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rain drops
      drops.forEach((drop) => {
        const depthScale = 0.5 + drop.depth * 0.5;
        const windOffset = wind * 3 * depthScale;

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(
          drop.x + windOffset * drop.length * 0.1,
          drop.y + drop.length * depthScale
        );
        ctx.strokeStyle = `rgba(180, 200, 255, ${drop.opacity * depthScale})`;
        ctx.lineWidth = drop.thickness * depthScale;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Move
        drop.y += drop.speed * depthScale;
        drop.x += windOffset * 0.5;

        // Reset
        if (drop.y > canvas.height) {
          // Create splash
          if (Math.random() < 0.3) {
            splashes.push({
              x: drop.x,
              y: canvas.height - 5,
              radius: 1 + Math.random() * 2,
              opacity: 0.4,
              life: 1,
            });
          }
          Object.assign(drop, createDrop());
          drop.y = Math.random() * -100;
        }
      });

      // Draw splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (1 + (1 - s.life) * 2), 0, Math.PI, true);
        ctx.strokeStyle = `rgba(180, 200, 255, ${s.opacity * s.life})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        s.life -= 0.03;
        if (s.life <= 0) splashes.splice(i, 1);
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [currentScene]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
