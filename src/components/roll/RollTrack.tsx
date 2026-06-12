import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { RollCard } from './RollCard';
import { generateRollStrip } from '../../lib/random';
import type { Sword } from '../../types';
import { GAME_CONFIG } from '../../data/config';

interface RollTrackProps {
  isRolling: boolean;
  result: Sword | null;
  onAnimationComplete: () => void;
  reduceMotion?: boolean;
}

const CARD_WIDTH = 112; // px (w-28 = 112px)
const CARD_GAP = 8; // px
const CARD_TOTAL = CARD_WIDTH + CARD_GAP;
const WINNER_INDEX = 36; // strip position of winner (near end)
const VISIBLE_CARDS = 7;

export function RollTrack({ isRolling, result, onAnimationComplete, reduceMotion = false }: RollTrackProps) {
  const [strip, setStrip] = useState<Sword[]>([]);
  const [winnerIdx, setWinnerIdx] = useState<number>(WINNER_INDEX);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Reset and prepare strip when rolling starts
  useEffect(() => {
    if (isRolling && result) {
      hasAnimated.current = false;
      const newStrip = generateRollStrip(result, 40);
      // Find where we placed result
      const idx = newStrip.findIndex(s => s.id === result.id && newStrip.indexOf(s) > 30);
      const wIdx = idx >= 0 ? idx : WINNER_INDEX;
      setWinnerIdx(wIdx);
      setStrip(newStrip);

      // Reset position immediately
      controls.set({ x: 0 });
    }
  }, [isRolling, result, controls]);

  // Animate once strip is ready
  useEffect(() => {
    if (!isRolling || strip.length === 0 || hasAnimated.current) return;
    hasAnimated.current = true;

    const containerWidth = containerRef.current?.offsetWidth ?? 700;
    const centerOffset = containerWidth / 2 - CARD_WIDTH / 2;
    // Final position: winner card is centered
    const targetX = -(winnerIdx * CARD_TOTAL - centerOffset);

    if (reduceMotion) {
      controls.set({ x: targetX });
      setTimeout(onAnimationComplete, 300);
      return;
    }

    controls.start({
      x: targetX,
      transition: {
        duration: GAME_CONFIG.ROLL_STRIP_DURATION / 1000,
        ease: [0.15, 0.85, 0.35, 1.0], // Custom ease: fast start, slow end
      },
    }).then(() => {
      onAnimationComplete();
    });
  }, [strip, isRolling, winnerIdx, controls, onAnimationComplete, reduceMotion]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Center indicator */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] z-20 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-80" />
      </div>

      {/* Center highlight frame */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{
          width: CARD_WIDTH + 8,
          height: 148,
          border: '2px solid rgba(251,191,36,0.6)',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(251,191,36,0.3), inset 0 0 20px rgba(251,191,36,0.1)',
        }}
      />

      {/* Strip container with mask */}
      <div
        className="overflow-hidden roll-strip-container"
        style={{ height: 148 }}
      >
        <motion.div
          animate={controls}
          className="flex items-center gap-2 roll-strip"
          style={{ paddingLeft: containerRef.current ? containerRef.current.offsetWidth / 2 - CARD_WIDTH / 2 : 300 }}
        >
          {strip.map((sword, i) => (
            <RollCard
              key={`${sword.id}-${i}`}
              sword={sword}
              isWinner={isRolling && i === winnerIdx && !isRolling}
              size="md"
              className="shrink-0"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
