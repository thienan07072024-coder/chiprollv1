import { useEffect, useRef, useCallback } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle' | 'triangle';
  life: number;
}

const CONFETTI_COLORS = [
  '#fbbf24', '#f59e0b', '#a78bfa', '#7c3aed',
  '#60a5fa', '#34d399', '#f87171', '#fb7185',
  '#e879f9', '#38bdf8',
];

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const animRef = useRef<number>(0);
  const activeRef = useRef(false);

  const createPiece = useCallback((canvas: HTMLCanvasElement): ConfettiPiece => {
    const shapes: ConfettiPiece['shape'][] = ['rect', 'circle', 'triangle'];
    return {
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 12,
      vy: -8 - Math.random() * 8,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.3,
      size: 6 + Math.random() * 10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      life: 0,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (active && !activeRef.current) {
      activeRef.current = true;
      // Spawn burst
      piecesRef.current = Array.from({ length: 120 }, () => createPiece(canvas));

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let anyAlive = false;

        piecesRef.current.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.vx *= 0.99; // air resistance
          p.angle += p.vAngle;
          p.life++;

          if (p.y < canvas.height + 20) {
            anyAlive = true;
            const alpha = Math.max(0, 1 - p.life / 180);

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
              ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else if (p.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.moveTo(0, -p.size / 2);
              ctx.lineTo(p.size / 2, p.size / 2);
              ctx.lineTo(-p.size / 2, p.size / 2);
              ctx.closePath();
              ctx.fill();
            }

            ctx.restore();
          }
        });

        if (anyAlive) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          activeRef.current = false;
          onComplete?.();
        }
      };

      cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (!active) {
        cancelAnimationFrame(animRef.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        activeRef.current = false;
      }
    };
  }, [active, createPiece, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
}
