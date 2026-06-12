import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, TrendingUp, Star, Sparkles } from 'lucide-react';
import { getRarityColor, getRarityLabel, getRarityBg, getRarityGlow } from '../../lib/random';
import { RARITY_CONFIG } from '../../data/swords';
import type { Sword } from '../../types';

interface RollResultProps {
  sword: Sword | null;
  coinsValue: number;
  onClose: () => void;
  onSell: () => void;
  onKeep: () => void;
}

export function RollResult({ sword, coinsValue, onClose, onSell, onKeep }: RollResultProps) {
  if (!sword) return null;

  const rarityColor = getRarityColor(sword.rarity);
  const rarityLabel = getRarityLabel(sword.rarity);
  const rarityBg = getRarityBg(sword.rarity);
  const rarityGlow = getRarityGlow(sword.rarity);
  const cfg = RARITY_CONFIG[sword.rarity];

  const isSecret = sword.rarity === 'secret';
  const isMythicPlus = ['mythic', 'secret'].includes(sword.rarity);
  const isLegendaryPlus = ['legendary', 'mythic', 'secret'].includes(sword.rarity);
  const isEpicPlus = ['epic', 'legendary', 'mythic', 'secret'].includes(sword.rarity);

  // Cinematic entry for legendary+
  const cardAnimation = isLegendaryPlus ? {
    initial: { scale: 0, opacity: 0, rotateY: -180 },
    animate: {
      scale: [0, 1.15, 0.92, 1.06, 1],
      opacity: [0, 1, 1, 1, 1],
      rotateY: [-180, 0, 0, 0, 0],
    },
    transition: { duration: 0.8, times: [0, 0.4, 0.6, 0.8, 1], ease: 'easeOut' },
  } : {
    initial: { scale: 0.5, opacity: 0, y: 40 },
    animate: { scale: 1, opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="overlay"
        onClick={onClose}
      >
        {/* Legendary+ screen flash */}
        {isLegendaryPlus && (
          <div className="screen-flash" style={{ background: rarityColor }} />
        )}

        {/* Secret spinning ring */}
        {isSecret && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                border: '2px solid transparent',
                borderTopColor: rarityColor,
                borderRightColor: rarityColor + '60',
                boxShadow: `0 0 40px ${rarityColor}40`,
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{
                border: '1px solid ' + rarityColor + '40',
                boxShadow: `inset 0 0 30px ${rarityColor}20`,
              }}
            />
          </>
        )}

        {/* Mythic+ outer glow burst */}
        {isMythicPlus && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-40 h-40 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${rarityColor}80, transparent)` }}
          />
        )}

        <motion.div
          {...cardAnimation}
          className="relative max-w-sm w-full mx-4 rounded-2xl overflow-hidden border-2"
          style={{
            background: rarityBg,
            borderColor: rarityColor,
            boxShadow: `0 0 60px ${rarityGlow}, 0 0 120px ${rarityGlow}50`,
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Animated background glow */}
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at center, ${rarityGlow} 0%, transparent 65%)` }}
          />

          {/* Shimmer for legendary+ */}
          {isLegendaryPlus && (
            <div
              className="absolute inset-0 animate-shimmer opacity-10 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
              }}
            />
          )}

          {/* Top decorative bar */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)` }} />

          {/* Rarity header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="relative z-10 flex items-center justify-between px-5 pt-4 pb-2"
          >
            <span
              className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${isSecret ? 'rainbow-text rainbow-border' : ''}`}
              style={!isSecret ? {
                color: rarityColor,
                borderColor: `${rarityColor}50`,
                background: `${rarityColor}18`,
                fontFamily: '"Cinzel", serif',
                textShadow: `0 0 10px ${rarityColor}`,
              } : {
                borderColor: 'transparent',
                background: 'rgba(255,255,255,0.1)',
              }}
            >
              ✦ {rarityLabel} ✦
            </span>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Content */}
          <div className="relative z-10 px-6 pb-6 text-center">
            {/* Image */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={isEpicPlus ? {
                scale: [0, 1.2, 0.9, 1.05, 1],
                rotate: [-20, 5, -3, 2, 0],
              } : { scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: isEpicPlus ? 0.8 : 0.4, ease: 'easeOut' }}
              className={`my-4 flex justify-center ${isEpicPlus ? 'animate-float' : ''}`}
            >
              {/* Glow rings for epic+ */}
              {isEpicPlus && (
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: `radial-gradient(circle, ${rarityColor}40, transparent)`, filter: 'blur(15px)' }}
                  />
                  <img
                    src={sword.image}
                    alt={sword.name}
                    className="w-44 h-44 object-contain relative z-10"
                    style={{ filter: `drop-shadow(0 0 20px ${rarityColor}) drop-shadow(0 0 40px ${rarityColor}50)` }}
                  />
                </div>
              )}
              {!isEpicPlus && (
                <img
                  src={sword.image}
                  alt={sword.name}
                  className="w-40 h-40 object-contain"
                  style={{ filter: `drop-shadow(0 0 12px ${rarityColor}80)` }}
                />
              )}
            </motion.div>

            {/* NEW badge for legendary+ */}
            {isLegendaryPlus && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full mb-2 text-xs font-bold"
                style={{ background: `${rarityColor}30`, color: rarityColor, border: `1px solid ${rarityColor}50` }}
              >
                <Sparkles className="w-3 h-3" />
                ULTRA RARE
              </motion.div>
            )}

            {/* Name */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className={`text-2xl font-bold mb-1 ${isSecret ? 'rainbow-text' : ''}`}
              style={!isSecret ? {
                color: rarityColor,
                fontFamily: '"Cinzel", serif',
                textShadow: `0 0 20px ${rarityColor}`,
              } : { fontFamily: '"Cinzel", serif' }}
            >
              {sword.name}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-slate-300 text-sm mb-4 leading-relaxed"
            >
              {sword.description}
            </motion.p>

            {/* Tags */}
            {sword.tags && sword.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-1.5 justify-center mb-4"
              >
                {sword.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ borderColor: `${rarityColor}40`, color: rarityColor + 'cc', background: `${rarityColor}10` }}
                  >
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Value */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-center justify-center gap-2 mb-5 p-3 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-sm">Giá trị:</span>
              <span className="text-amber-400 font-bold font-mono text-xl">{coinsValue.toLocaleString()}</span>
              <span className="text-amber-500 text-sm">xu</span>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSell}
                className="flex-1 btn-gold flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" />
                Bán ({coinsValue.toLocaleString()})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onKeep}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" />
                Giữ lại
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
