import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Gift, Star, Zap, Trophy, Lock } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { useToast } from '../fx/Toast';

const ACHIEVEMENTS_DEFS = [
  { id: 'first-roll', title: 'Khởi Đầu', description: 'Roll lần đầu tiên', icon: '🎲', rarity: 'common' },
  { id: 'roll-100', title: 'Nghiện Nặng', description: 'Roll 100 lần', icon: '🔄', rarity: 'uncommon' },
  { id: 'roll-1000', title: 'Vô Tận', description: 'Roll 1000 lần', icon: '⚡', rarity: 'rare' },
  { id: 'first-rare', title: 'Hên Vãi', description: 'Roll được kiếm Rare đầu tiên', icon: '💙', rarity: 'rare' },
  { id: 'first-epic', title: 'Epic Gamer', description: 'Roll được kiếm Epic đầu tiên', icon: '💜', rarity: 'epic' },
  { id: 'first-legendary', title: 'Huyền Thoại', description: 'Roll được kiếm Legendary đầu tiên', icon: '⭐', rarity: 'legendary' },
  { id: 'first-mythic', title: 'Thần Thánh', description: 'Roll được kiếm Mythic đầu tiên', icon: '🔥', rarity: 'mythic' },
  { id: 'first-secret', title: 'Bí Ẩn Tối Thượng', description: 'Roll được kiếm SECRET', icon: '✨', rarity: 'secret' },
  { id: 'millionaire', title: 'Tỷ Phú', description: 'Kiếm tổng 1,000,000 coins', icon: '💰', rarity: 'legendary' },
];

const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  uncommon: '#4ade80',
  rare: '#60a5fa',
  epic: '#c084fc',
  legendary: '#fbbf24',
  mythic: '#f87171',
  secret: '#e0e7ff',
};

function MissionProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="progress-bar mt-2">
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
      />
    </div>
  );
}

export function MissionsPanel() {
  const { dailyMissions, achievements, achievementUnlockedAt, claimMissionReward, stats } = useGameStore();
  const { addToast } = useToast();

  const timeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  const handleClaim = (missionId: string) => {
    const mission = dailyMissions.find(m => m.id === missionId);
    if (!mission) return;
    claimMissionReward(missionId);
    addToast({
      type: 'success',
      title: '🎉 Nhận thưởng!',
      message: `+${mission.reward.toLocaleString()} coins từ "${mission.title}"`,
      duration: 3000,
    });
  };

  const completedCount = dailyMissions.filter(m => m.completed).length;
  const totalMissions = dailyMissions.length;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="card-game p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="section-title-gold mb-1">Nhiệm Vụ Hàng Ngày</h2>
            <p className="text-slate-500 text-sm">Hoàn thành để nhận thưởng coins • Reset sau {timeUntilReset()}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white font-mono">{completedCount}/{totalMissions}</div>
            <div className="text-xs text-slate-500">hoàn thành</div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="progress-bar">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalMissions) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              background: 'linear-gradient(90deg, #d97706, #fbbf24)',
              boxShadow: '0 0 12px rgba(251,191,36,0.5)',
            }}
          />
        </div>
        {completedCount === totalMissions && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-400 text-sm mt-2 text-center font-medium"
          >
            🎉 Hoàn thành tất cả nhiệm vụ hôm nay!
          </motion.p>
        )}
      </div>

      {/* Mission cards */}
      <div className="flex flex-col gap-3">
        {dailyMissions.map((mission, idx) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`mission-card ${mission.completed ? 'completed' : ''} ${mission.claimed ? 'claimed' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl"
                style={{
                  background: mission.completed
                    ? 'linear-gradient(135deg, rgba(20,83,45,0.4), rgba(20,83,45,0.2))'
                    : 'rgba(17,20,48,0.8)',
                  border: `1px solid ${mission.completed ? 'rgba(34,197,94,0.3)' : '#1e2250'}`,
                }}>
                {mission.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-white">{mission.title}</h3>
                  {mission.completed && !mission.claimed && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-700/50">
                      Sẵn nhận!
                    </span>
                  )}
                  {mission.claimed && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
                      Đã nhận
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{mission.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-600">{Math.min(mission.progress, mission.target)}/{mission.target}</span>
                  <span className="text-amber-400 text-xs font-mono font-bold flex items-center gap-1">
                    <Gift className="w-3 h-3" /> +{mission.reward.toLocaleString()} xu
                  </span>
                </div>
                <MissionProgressBar
                  value={mission.progress}
                  max={mission.target}
                  color={mission.completed ? '#22c55e' : '#7c3aed'}
                />
              </div>

              {/* Claim button */}
              <div className="shrink-0">
                {mission.completed && !mission.claimed ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaim(mission.id)}
                    className="btn-gold px-4 py-2 text-sm flex items-center gap-1.5"
                  >
                    <Gift className="w-4 h-4" />
                    Nhận
                  </motion.button>
                ) : mission.claimed ? (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <CheckSquare className="w-5 h-5 text-green-400" />
                  </div>
                ) : (
                  <div className="text-slate-600 text-sm font-mono">
                    {Math.round((mission.progress / mission.target) * 100)}%
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <div className="card-game p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="section-title">Thành Tựu</h2>
          <span className="text-slate-500 text-sm ml-2">
            {Object.values(achievements).filter(Boolean).length}/{ACHIEVEMENTS_DEFS.length} mở khóa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS_DEFS.map((ach, idx) => {
            const unlocked = achievements[ach.id];
            const unlockedAt = achievementUnlockedAt[ach.id];
            const color = RARITY_COLORS[ach.rarity] ?? '#9ca3af';

            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                className={`achievement-badge ${unlocked ? 'unlocked' : ''}`}
                style={unlocked ? {
                  borderColor: `${color}40`,
                  boxShadow: `0 0 15px ${color}20`,
                } : {}}
              >
                <div className="text-3xl mb-2" style={{ filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)' }}>
                  {ach.icon}
                </div>
                <h4 className="font-semibold text-sm mb-1"
                  style={{ color: unlocked ? color : '#4a5568' }}>
                  {ach.title}
                </h4>
                <p className="text-xs text-slate-600 leading-snug">{ach.description}</p>
                {unlocked && unlockedAt && (
                  <p className="text-[10px] text-slate-700 mt-1">
                    {new Date(unlockedAt).toLocaleDateString('vi-VN')}
                  </p>
                )}
                {!unlocked && (
                  <div className="mt-1">
                    <Lock className="w-3 h-3 text-slate-700 mx-auto" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
