import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, RefreshCw, Square, FastForward, ChevronRight, Info, TrendingUp, Sparkles } from 'lucide-react';
import { RollTrack } from './RollTrack';
import { RollResult } from './RollResult';
import { Confetti } from '../fx/Confetti';
import { useGameStore } from '../../stores/gameStore';
import { rollSword } from '../../lib/random';
import { GAME_CONFIG } from '../../data/config';
import { RARITY_CONFIG, getSwordById } from '../../data/swords';
import { useToast } from '../fx/Toast';
import type { Sword } from '../../types';

const RARE_RARITIES = ['epic', 'legendary', 'mythic', 'secret'];
const LEGENDARY_RARITIES = ['legendary', 'mythic', 'secret'];

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'secret'];

export function RollPanel() {
  const { addToast } = useToast();
  const store = useGameStore();
  const {
    coins, pity, settings, unlockedFeatures, adminMode,
    addRollResult, spendCoins, getLuckBoost, getAutoRollSpeed,
  } = store;

  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<Sword | null>(null);
  const [pendingResult, setPendingResult] = useState<{ sword: Sword; instanceId: string; coinsValue: number } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAutoRolling, setIsAutoRolling] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [showOdds, setShowOdds] = useState(false);

  const autoRollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoRollingRef = useRef(false);

  const doRoll = useCallback(() => {
    if (isRolling) return;
    if (coins < GAME_CONFIG.ROLL_COST) {
      addToast({ type: 'error', title: 'Không đủ coin!', message: `Cần ${GAME_CONFIG.ROLL_COST} coins để roll.` });
      return false;
    }

    spendCoins(GAME_CONFIG.ROLL_COST);
    const sword = rollSword(store.pity, getLuckBoost());
    const { instanceId, coinsValue } = addRollResult(sword);

    setCurrentResult(sword);
    setPendingResult({ sword, instanceId, coinsValue });
    setIsRolling(true);
    setRollCount(c => c + 1);

    return true;
  }, [isRolling, coins, spendCoins, store.pity, getLuckBoost, addRollResult, addToast]);

  const handleAnimationComplete = useCallback(() => {
    setIsRolling(false);
    if (!pendingResult) return;

    const { sword, coinsValue } = pendingResult;
    const isRare = RARE_RARITIES.includes(sword.rarity);
    const isLegendary = LEGENDARY_RARITIES.includes(sword.rarity);

    if (isRare) setConfettiActive(true);

    if (!isAutoRollingRef.current || isRare) {
      setShowResult(true);
    } else if (isAutoRollingRef.current) {
      const rarityConfig = RARITY_CONFIG[sword.rarity];
      addToast({
        type: isLegendary ? 'legendary' : isRare ? 'rare' : 'info',
        title: sword.name,
        message: `${rarityConfig.label} • ${coinsValue.toLocaleString()} coins`,
        duration: 2000,
      });
    }
  }, [pendingResult, addToast]);

  const handleKeep = useCallback(() => {
    setShowResult(false);
    setPendingResult(null);
  }, []);

  const handleSell = useCallback(() => {
    if (pendingResult) {
      store.sellItem(pendingResult.instanceId);
      addToast({ type: 'success', title: 'Đã bán!', message: `+${pendingResult.coinsValue.toLocaleString()} coins` });
    }
    setShowResult(false);
    setPendingResult(null);
  }, [pendingResult, store, addToast]);

  const startAutoRoll = useCallback(() => {
    if (isAutoRolling) return;
    setIsAutoRolling(true);
    isAutoRollingRef.current = true;

    const loop = () => {
      if (!isAutoRollingRef.current) return;
      if (coins < GAME_CONFIG.ROLL_COST) {
        setIsAutoRolling(false);
        isAutoRollingRef.current = false;
        addToast({ type: 'error', title: 'Auto-roll dừng', message: 'Không đủ coin.' });
        return;
      }
      doRoll();
      const speed = getAutoRollSpeed();
      autoRollRef.current = setTimeout(loop, GAME_CONFIG.ROLL_STRIP_DURATION + speed);
    };
    loop();
  }, [isAutoRolling, coins, doRoll, getAutoRollSpeed, addToast]);

  const stopAutoRoll = useCallback(() => {
    setIsAutoRolling(false);
    isAutoRollingRef.current = false;
    if (autoRollRef.current) clearTimeout(autoRollRef.current);
  }, []);

  const doX10Roll = useCallback(() => {
    if (isRolling) return;
    const results: Array<{ sword: Sword; coinsValue: number }> = [];

    for (let i = 0; i < 10; i++) {
      if (coins - (i + 1) * GAME_CONFIG.ROLL_COST < 0) break;
      spendCoins(GAME_CONFIG.ROLL_COST);
      const sword = rollSword(store.pity, getLuckBoost());
      const { coinsValue } = addRollResult(sword);
      results.push({ sword, coinsValue });
    }

    if (results.length > 0) {
      const bestResult = results.reduce((best, curr) =>
        RARITY_ORDER.indexOf(curr.sword.rarity) > RARITY_ORDER.indexOf(best.sword.rarity) ? curr : best
      );
      setCurrentResult(bestResult.sword);
      setIsRolling(true);
      addToast({
        type: 'info',
        title: `✨ x${results.length} Roll!`,
        message: `Best: ${bestResult.sword.name} (${RARITY_CONFIG[bestResult.sword.rarity].label})`,
        duration: 4000,
      });
    }
  }, [isRolling, coins, spendCoins, store.pity, getLuckBoost, addRollResult, addToast]);

  useEffect(() => {
    return () => { if (autoRollRef.current) clearTimeout(autoRollRef.current); };
  }, []);

  const canRoll = coins >= GAME_CONFIG.ROLL_COST && !isRolling;
  const luckBoost = getLuckBoost();

  // Pity bars config
  const pityBars = [
    { label: 'Epic', current: pity.rollsSinceEpic, max: GAME_CONFIG.PITY_EPIC, color: '#c084fc', glow: 'rgba(192,132,252,0.5)' },
    { label: 'Legendary', current: pity.rollsSinceLegendary, max: 200, color: '#fbbf24', glow: 'rgba(251,191,36,0.5)' },
    { label: 'Mythic', current: pity.rollsSinceMythic, max: 500, color: '#f87171', glow: 'rgba(248,113,113,0.5)' },
    { label: 'Secret', current: pity.rollsSinceSecret, max: 1000, color: '#e0e7ff', glow: 'rgba(224,231,255,0.5)' },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
      {/* Banner / Hero area */}
      <div className="card-game p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-game-grid opacity-30" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 60%)' }} />

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="section-title mb-1">Gacha Kiếm</h2>
              <p className="text-slate-500 text-xs">Roll #{rollCount + 1} • {GAME_CONFIG.ROLL_COST.toLocaleString()} 🪙 / lần</p>
            </div>
            <div className="flex items-center gap-2">
              {adminMode && (
                <span className="px-2 py-1 rounded-lg text-xs font-bold text-yellow-300 border border-yellow-500/40"
                  style={{ background: 'rgba(120,53,15,0.3)' }}>
                  ⚡ GOD MODE
                </span>
              )}
              {luckBoost > 0 && (
                <span className="px-2 py-1 rounded-lg text-xs font-bold text-purple-300 border border-purple-500/40"
                  style={{ background: 'rgba(124,58,237,0.15)' }}>
                  🍀 +{Math.round(luckBoost * 100)}% Luck
                </span>
              )}
              <button onClick={() => setShowOdds(!showOdds)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Odds table */}
          <AnimatePresence>
            {showOdds && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 rounded-xl border overflow-hidden"
                style={{ background: 'rgba(5,7,20,0.6)', borderColor: '#1e2250' }}
              >
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold">Tỷ lệ rơi</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(RARITY_CONFIG).map(([rarity, cfg]) => (
                    <div key={rarity} className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg"
                      style={{ background: `${cfg.color}08`, border: `1px solid ${cfg.color}20` }}>
                      <span style={{ color: cfg.color, fontFamily: '"Cinzel", serif' }}>{cfg.label}</span>
                      <span className="text-slate-400 font-mono">{cfg.dropChance}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Roll Track */}
          <div className="py-2 mb-5">
            <RollTrack
              isRolling={isRolling}
              result={currentResult}
              onAnimationComplete={handleAnimationComplete}
              reduceMotion={settings.reduceMotion}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Main Roll */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={doRoll}
              disabled={!canRoll || isAutoRolling}
              className="btn-primary flex items-center gap-2.5 text-lg px-10 py-4 roll-btn-glow"
              style={canRoll && !isAutoRolling ? {} : {}}
            >
              {isRolling ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}>
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                  Đang Roll...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  ROLL
                  <span className="text-sm opacity-60">({GAME_CONFIG.ROLL_COST}🪙)</span>
                </>
              )}
            </motion.button>

            {/* x10 Roll */}
            {unlockedFeatures.x10Roll && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={doX10Roll}
                disabled={coins < GAME_CONFIG.ROLL_COST * 10 || isRolling || isAutoRolling}
                className="btn-gold flex items-center gap-2 px-5 py-4"
              >
                <Sparkles className="w-4 h-4" />
                x10 ({(GAME_CONFIG.ROLL_COST * 10).toLocaleString()}🪙)
              </motion.button>
            )}

            {/* Auto roll */}
            {!isAutoRolling ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={startAutoRoll}
                disabled={!canRoll}
                className="btn-ghost flex items-center gap-2 px-5 py-4"
              >
                <FastForward className="w-5 h-5" />
                Auto
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={stopAutoRoll}
                className="btn-danger flex items-center gap-2 px-5 py-4 animate-pulse-glow"
              >
                <Square className="w-5 h-5" />
                Dừng Auto
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Pity bars */}
      <div className="card-game p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Hệ thống Pity</h3>
          <span className="text-xs text-slate-600 ml-1">— tích lũy giúp tăng cơ hội ra hiếm</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {pityBars.map(bar => {
            const pct = Math.min((bar.current / bar.max) * 100, 100);
            return (
              <div key={bar.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold" style={{ color: bar.color, fontFamily: '"Cinzel", serif' }}>
                    {bar.label}
                  </span>
                  <span className="text-slate-500 font-mono">{bar.current}/{bar.max}</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${bar.color}80, ${bar.color})`,
                      boxShadow: pct > 50 ? `0 0 8px ${bar.glow}` : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent history */}
      <RecentHistory />

      <Confetti active={confettiActive} onComplete={() => setConfettiActive(false)} />

      {showResult && pendingResult && (
        <RollResult
          sword={pendingResult.sword}
          coinsValue={pendingResult.coinsValue}
          onClose={handleKeep}
          onSell={handleSell}
          onKeep={handleKeep}
        />
      )}
    </div>
  );
}

function RecentHistory() {
  const { rollHistory } = useGameStore();
  const recent = rollHistory.slice(0, 15);
  if (recent.length === 0) return null;

  return (
    <div className="card-game p-4">
      <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">Lịch sử gần đây</h3>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <AnimatePresence>
          {recent.map((entry, i) => {
            const sword = getSwordById(entry.swordId);
            if (!sword) return null;
            const cfg = RARITY_CONFIG[sword.rarity];
            return (
              <motion.div
                key={entry.instanceId}
                initial={{ opacity: 0, scale: 0.7, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl border cursor-default group"
                style={{
                  borderColor: `${cfg.borderColor}50`,
                  background: `${cfg.color}08`,
                  minWidth: 60,
                  boxShadow: `0 0 8px ${cfg.glowColor}20`,
                }}
                title={sword.name}
              >
                <div className="flex justify-center items-center h-8">
                  <img src={sword.image} alt={sword.name}
                    className="max-h-full max-w-full object-contain"
                    style={{ filter: `drop-shadow(0 0 4px ${cfg.color}60)` }}
                  />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: cfg.color, fontFamily: '"Cinzel", serif' }}>
                  {cfg.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
