import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Star, BarChart2, Coins, Flame, Clock, Trophy } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { getSwordById, RARITY_CONFIG, SWORDS } from '../../data/swords';
import { getRarityColor } from '../../lib/random';

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'secret'];

export function StatsPanel() {
  const { stats, inventory, level, xp, coins, rollHistory, adminMode } = useGameStore();

  const activeItems = inventory.filter(i => !i.sold);
  const XP_PER_LEVEL = 500;
  const xpProgress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
  const xpInLevel = xp % XP_PER_LEVEL;

  const bestSword = stats.bestItem ? getSwordById(stats.bestItem) : null;
  const rarestSword = stats.rarestItem ? getSwordById(stats.rarestItem) : null;

  // Collection completion
  const uniqueIds = new Set(activeItems.map(i => i.swordId));
  const collectionPct = Math.round((uniqueIds.size / SWORDS.length) * 100);

  // Lucky streak: consecutive legendary+
  let streak = 0;
  for (const entry of rollHistory) {
    const s = getSwordById(entry.swordId);
    if (s && ['legendary', 'mythic', 'secret'].includes(s.rarity)) streak++;
    else break;
  }

  const rarityStats = [
    { rarity: 'common', count: stats.commonCount },
    { rarity: 'uncommon', count: stats.uncommonCount },
    { rarity: 'rare', count: stats.rareCount },
    { rarity: 'epic', count: stats.epicCount },
    { rarity: 'legendary', count: stats.legendaryCount },
    { rarity: 'mythic', count: stats.mythicCount },
    { rarity: 'secret', count: stats.secretCount },
  ];

  const topStatCards = [
    { icon: <Target className="w-5 h-5" />, label: 'Tổng Rolls', value: stats.totalRolls.toLocaleString(), color: '#a78bfa', bg: 'rgba(124,58,237,0.1)' },
    { icon: <Coins className="w-5 h-5" />, label: 'Coins Hiện Tại', value: coins.toLocaleString(), color: '#fbbf24', bg: 'rgba(217,119,6,0.1)' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Tổng Kiếm Được', value: stats.totalCoinsEarned.toLocaleString(), color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Tổng Đã Tiêu', value: stats.totalCoinsSpent.toLocaleString(), color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
    { icon: <Award className="w-5 h-5" />, label: 'Kho Hiện Tại', value: activeItems.length.toLocaleString(), color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
    { icon: <Star className="w-5 h-5" />, label: 'Level', value: `${level}`, color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
      {/* Level & XP hero */}
      <div className="card-game p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(124,58,237,0.15), transparent 60%)' }} />

        <div className="relative z-10">
          <h2 className="section-title mb-5">Thống Kê</h2>

          <div className="flex items-center gap-5 p-4 rounded-2xl mb-5"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
            {/* Level circle */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="6" />
                <circle cx="40" cy="40" r="35" fill="none" stroke="#7c3aed"
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - xpProgress / 100)}`}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(124,58,237,0.8))', transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bold text-white text-xl leading-none" style={{ fontFamily: '"Cinzel", serif' }}>
                  {level}
                </span>
                <span className="text-purple-400 text-[10px]">LV</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-purple-300 font-semibold">Level {level}</span>
                <span className="text-slate-500 text-sm font-mono">{xpInLevel}/{XP_PER_LEVEL} XP</span>
              </div>
              <div className="progress-bar h-3">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    background: 'linear-gradient(90deg, #4c1d95, #7c3aed, #a78bfa)',
                    boxShadow: '0 0 10px rgba(124,58,237,0.5)',
                  }}
                />
              </div>
              <p className="text-slate-500 text-xs mt-1.5">
                Còn {XP_PER_LEVEL - xpInLevel} XP để level {level + 1}
              </p>
            </div>

            {adminMode && (
              <div className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold text-yellow-300 border border-yellow-500/40"
                style={{ background: 'rgba(120,53,15,0.3)' }}>
                ⚡ GOD
              </div>
            )}
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topStatCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="stat-card"
                style={{ background: stat.bg, borderColor: `${stat.color}20` }}
              >
                <div className="mb-2" style={{ color: stat.color }}>{stat.icon}</div>
                <p className="text-white font-bold text-xl font-mono">{stat.value}</p>
                <p className="text-slate-500 text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Collection + Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Collection */}
        <div className="card-game p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Bộ Sưu Tập</h3>
          </div>
          <div className="flex items-end justify-between mb-3">
            <span className="text-3xl font-bold text-white font-mono">{uniqueIds.size}</span>
            <span className="text-slate-500 text-sm">/ {SWORDS.length} kiếm</span>
          </div>
          <div className="progress-bar h-3 mb-2">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${collectionPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(90deg, #d97706, #fbbf24)',
                boxShadow: '0 0 8px rgba(251,191,36,0.4)',
              }}
            />
          </div>
          <p className="text-amber-400 text-sm font-mono">{collectionPct}% hoàn thành</p>
        </div>

        {/* Lucky streak */}
        <div className="card-game p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Streak Huyền Thoại</h3>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-white font-mono">{streak}</span>
            <span className="text-slate-500 text-sm mb-1">lần liên tiếp</span>
          </div>
          <p className="text-slate-600 text-xs">Legendary+ liên tiếp gần nhất</p>
          {streak >= 3 && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mt-2 text-orange-400 text-sm font-bold"
            >
              🔥 STREAK đang bùng cháy!
            </motion.div>
          )}
        </div>
      </div>

      {/* Rarity breakdown */}
      <div className="card-game p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Phân Bố Độ Hiếm</h3>
        </div>
        <div className="space-y-3">
          {rarityStats.map(({ rarity, count }) => {
            const color = getRarityColor(rarity);
            const cfg = RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG];
            const percentage = stats.totalRolls > 0
              ? ((count / stats.totalRolls) * 100).toFixed(1) : '0.0';
            const expectedPct = cfg.dropChance;

            return (
              <div key={rarity}>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs font-bold shrink-0" style={{ color, fontFamily: '"Cinzel", serif' }}>
                    {cfg.label}
                  </div>
                  <div className="flex-1 h-3 bg-[#0d1028] rounded-full overflow-hidden border border-[#1e2250]">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(parseFloat(percentage) / expectedPct * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                      style={{ background: color, boxShadow: `0 0 8px ${cfg.glowColor}` }}
                    />
                  </div>
                  <div className="text-right shrink-0 w-24">
                    <span className="text-white font-mono text-sm">{count}</span>
                    <span className="text-slate-500 text-xs ml-1">({percentage}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-slate-600 text-xs mt-3">
          * Thanh bar so sánh với tỷ lệ kỳ vọng của từng rarity
        </p>
      </div>

      {/* Best items */}
      {(bestSword || rarestSword) && (
        <div className="card-game p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Thành Tích Nổi Bật</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {rarestSword && (
              <div className="p-4 rounded-xl border text-center" style={{
                borderColor: `${getRarityColor(rarestSword.rarity)}40`,
                background: RARITY_CONFIG[rarestSword.rarity].bgGradient,
              }}>
                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Hiếm Nhất</div>
                <img src={rarestSword.image} alt={rarestSword.name}
                  className="w-16 h-16 object-contain mx-auto mb-2"
                  style={{ filter: `drop-shadow(0 0 8px ${getRarityColor(rarestSword.rarity)}80)` }}
                />
                <p className="text-xs font-bold text-white">{rarestSword.name}</p>
                <p className="text-xs mt-0.5" style={{ color: getRarityColor(rarestSword.rarity), fontFamily: '"Cinzel", serif' }}>
                  {RARITY_CONFIG[rarestSword.rarity].label}
                </p>
              </div>
            )}
            {bestSword && (
              <div className="p-4 rounded-xl border text-center" style={{
                borderColor: `${getRarityColor(bestSword.rarity)}40`,
                background: RARITY_CONFIG[bestSword.rarity].bgGradient,
              }}>
                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Giá Trị Cao Nhất</div>
                <img src={bestSword.image} alt={bestSword.name}
                  className="w-16 h-16 object-contain mx-auto mb-2"
                  style={{ filter: `drop-shadow(0 0 8px ${getRarityColor(bestSword.rarity)}80)` }}
                />
                <p className="text-xs font-bold text-white">{bestSword.name}</p>
                <p className="text-xs text-amber-400 mt-0.5 font-mono">{bestSword.value.toLocaleString()} xu</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent history */}
      {rollHistory.length > 0 && (
        <div className="card-game p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Lịch Sử Roll</h3>
            <span className="text-slate-600 text-xs ml-1">(10 gần nhất)</span>
          </div>
          <div className="space-y-2">
            {rollHistory.slice(0, 10).map((entry, i) => {
              const sword = getSwordById(entry.swordId);
              if (!sword) return null;
              const color = getRarityColor(sword.rarity);
              const cfg = RARITY_CONFIG[sword.rarity];
              return (
                <motion.div
                  key={entry.instanceId}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl border"
                  style={{ borderColor: `${color}20`, background: `${color}05` }}
                >
                  <img src={sword.image} alt={sword.name}
                    className="w-8 h-8 object-contain"
                    style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{sword.name}</p>
                    <p className="text-xs" style={{ color, fontFamily: '"Cinzel", serif' }}>{cfg.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 text-xs font-mono">{entry.coinsEarned.toLocaleString()}</p>
                    <p className="text-slate-600 text-[10px]">{new Date(entry.rolledAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
