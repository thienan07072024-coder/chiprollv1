import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = [
  'rgba(124,58,237,',
  'rgba(167,139,250,',
  'rgba(192,132,252,',
  'rgba(251,191,36,',
  'rgba(96,165,250,',
];

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 60 }, () => createParticle(canvas));
    };

    function createParticle(canvas: HTMLCanvasElement): Particle {
      const maxLife = 180 + Math.random() * 300;
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.3 + Math.random() * 0.8),
        size: 1 + Math.random() * 3,
        opacity: 0.1 + Math.random() * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: Math.floor(Math.random() * maxLife),
        maxLife,
      };
    }

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const progress = p.life / p.maxLife;
        const fadeOpacity =
          progress < 0.1
            ? progress / 0.1
            : progress > 0.9
            ? (1 - progress) / 0.1
            : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${(p.opacity * fadeOpacity).toFixed(2)})`;
        ctx.fill();

        // Glow effect for larger particles
        if (p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${(p.opacity * fadeOpacity * 0.15).toFixed(2)})`;
          ctx.fill();
        }

        if (p.life >= p.maxLife || p.y < -20) {
          particlesRef.current[i] = createParticle(canvas);
          particlesRef.current[i].life = 0;
          particlesRef.current[i].y = canvas.height + 10;
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
