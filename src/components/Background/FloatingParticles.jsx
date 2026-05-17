import { useEffect, useRef } from 'react';
import useAppStore from '../../stores/useAppStore';
import { getScene } from '../../scenes/scenes';

export default function FloatingParticles() {
  const canvasRef = useRef(null);
  const currentScene = useAppStore((s) => s.currentScene);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const scene = getScene(currentScene);

    const particles = Array.from({ length: scene.particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -0.1 - Math.random() * 0.3,
      opacity: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.005 + Math.random() * 0.01,
      wobble: 0.3 + Math.random() * 0.5,
    }));

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      particles.forEach((p) => {
        const pulse = Math.sin(time * p.pulseSpeed * 60 + p.phase) * 0.3 + 0.7;
        const wobbleX = Math.sin(time * 0.5 + p.phase) * p.wobble;

        // Glow effect
        const gradient = ctx.createRadialGradient(
          p.x + wobbleX, p.y, 0,
          p.x + wobbleX, p.y, p.size * 4
        );
        gradient.addColorStop(0, scene.particleColor.replace(/[\d.]+\)$/, `${p.opacity * pulse})`));
        gradient.addColorStop(0.4, scene.particleColor.replace(/[\d.]+\)$/, `${p.opacity * pulse * 0.4})`));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(p.x + wobbleX, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x + wobbleX, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = scene.particleColor.replace(/[\d.]+\)$/, `${p.opacity * pulse * 0.9})`);
        ctx.fill();

        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap
        if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      });

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
      className="fixed inset-0 z-20 pointer-events-none"
    />
  );
}
