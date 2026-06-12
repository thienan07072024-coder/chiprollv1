import { motion } from 'framer-motion';
import { getRarityColor, getRarityBg, getRarityBorder, getRarityGlow } from '../../lib/random';
import type { Sword } from '../../types';

interface RollCardProps {
  sword: Sword;
  isWinner?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { card: 'w-20 h-28', icon: 'w-12 h-12', name: 'text-[10px]' },
  md: { card: 'w-28 h-36', icon: 'w-16 h-16', name: 'text-xs' },
  lg: { card: 'w-36 h-48', icon: 'w-24 h-24', name: 'text-sm' },
};

export function RollCard({ sword, isWinner = false, size = 'md', showInfo = false, className = '' }: RollCardProps) {
  const rarityColor = getRarityColor(sword.rarity);
  const rarityBg = getRarityBg(sword.rarity);
  const rarityBorder = getRarityBorder(sword.rarity);
  const rarityGlow = getRarityGlow(sword.rarity);
  const sz = SIZE_MAP[size];

  const isSecret = sword.rarity === 'secret';
  const isLegendaryPlus = ['legendary', 'mythic', 'secret'].includes(sword.rarity);

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center rounded-xl border-2 select-none shrink-0
        overflow-hidden transition-all duration-300
        ${isWinner ? 'scale-110 z-10' : ''}
        ${sz.card} ${className}
        ${isSecret ? 'rainbow-border' : ''}
      `}
      style={{
        background: rarityBg,
        borderColor: isWinner ? rarityColor : `${rarityBorder}99`,
        boxShadow: isWinner
          ? `0 0 30px ${rarityGlow}, 0 0 60px ${rarityGlow}, inset 0 0 30px ${rarityGlow}`
          : `0 0 10px ${rarityGlow}40`,
      }}
    >
      {/* Background shine */}
      {isLegendaryPlus && (
        <div
          className="absolute inset-0 opacity-20 animate-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* Winner glow radial */}
      {isWinner && (
        <div
          className="absolute inset-0 animate-pulse-glow"
          style={{
            background: `radial-gradient(ellipse at center, ${rarityGlow} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Image */}
      <div className={`relative z-10 flex items-center justify-center ${sz.icon} ${isWinner ? 'animate-float' : ''}`}>
        <img
          src={sword.image}
          alt={sword.name}
          className="max-w-full max-h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          style={{
            filter: `drop-shadow(0 0 10px ${rarityColor})`
          }}
        />
      </div>

      {/* Rarity bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: rarityColor }}
      />

      {/* Name on winner */}
      {(isWinner || showInfo) && (
        <div className="absolute bottom-2 left-0 right-0 text-center z-10 px-1">
          <p
            className={`font-bold leading-tight truncate ${sz.name}`}
            style={{ color: rarityColor }}
          >
            {sword.name}
          </p>
        </div>
      )}

      {/* Winner crown */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0, y: -10 }}
          animate={{ scale: 1, y: 0 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg z-20"
        >
          ▼
        </motion.div>
      )}
    </div>
  );
}
