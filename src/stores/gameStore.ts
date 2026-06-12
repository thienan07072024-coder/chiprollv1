import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { GameState, InventoryItem, RollHistoryEntry, Sword, Settings, DailyMission } from '../types';
import { GAME_CONFIG } from '../data/config';
import { updatePity, calculateItemValue } from '../lib/random';
import { SHOP_ITEMS } from '../data/shop';
import { getSwordById } from '../data/swords';

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  flashEffects: true,
  reduceMotion: false,
  autoRollSpeed: GAME_CONFIG.AUTO_ROLL_BASE_SPEED,
  theme: 'purple',
};

function generateDailyMissions(): DailyMission[] {
  return [
    {
      id: 'daily-roll-10',
      title: 'Tay Mơ',
      description: 'Roll 10 lần trong ngày',
      icon: '🎲',
      target: 10,
      progress: 0,
      reward: 500,
      completed: false,
      claimed: false,
      type: 'rolls',
    },
    {
      id: 'daily-sell-5',
      title: 'Thương Nhân',
      description: 'Bán 5 kiếm',
      icon: '💰',
      target: 5,
      progress: 0,
      reward: 300,
      completed: false,
      claimed: false,
      type: 'sell',
    },
    {
      id: 'daily-rare',
      title: 'Săn Hiếm',
      description: 'Roll được 1 kiếm Rare trở lên',
      icon: '🌟',
      target: 1,
      progress: 0,
      reward: 1000,
      completed: false,
      claimed: false,
      type: 'rare_roll',
    },
  ];
}

const INITIAL_STATE: GameState = {
  coins: GAME_CONFIG.STARTING_COINS,
  xp: 0,
  level: 1,
  inventory: [],
  rollHistory: [],
  stats: {
    totalRolls: 0,
    totalCoinsEarned: 0,
    totalCoinsSpent: 0,
    bestItem: null,
    rarestItem: null,
    commonCount: 0,
    uncommonCount: 0,
    rareCount: 0,
    epicCount: 0,
    legendaryCount: 0,
    mythicCount: 0,
    secretCount: 0,
  },
  pity: {
    rollsSinceEpic: 0,
    rollsSinceLegendary: 0,
    rollsSinceMythic: 0,
    rollsSinceSecret: 0,
  },
  shopUpgrades: {},
  settings: DEFAULT_SETTINGS,
  unlockedFeatures: {
    x10Roll: false,
    x100Roll: false,
    autoRoll: true,
  },
  adminMode: false,
  dailyMissions: generateDailyMissions(),
  lastMissionReset: Date.now(),
  achievements: {},
  achievementUnlockedAt: {},
};

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'secret'];

const ACHIEVEMENTS_DEFS = [
  { id: 'first-roll', title: 'Khởi Đầu', condition: (s: GameState['stats']) => s.totalRolls >= 1 },
  { id: 'roll-100', title: 'Nghiện Nặng', condition: (s: GameState['stats']) => s.totalRolls >= 100 },
  { id: 'roll-1000', title: 'Vô Tận', condition: (s: GameState['stats']) => s.totalRolls >= 1000 },
  { id: 'first-rare', title: 'Hên Vãi', condition: (s: GameState['stats']) => s.rareCount >= 1 },
  { id: 'first-epic', title: 'Epic Gamer', condition: (s: GameState['stats']) => s.epicCount >= 1 },
  { id: 'first-legendary', title: 'Huyền Thoại', condition: (s: GameState['stats']) => s.legendaryCount >= 1 },
  { id: 'first-mythic', title: 'Thần Thánh', condition: (s: GameState['stats']) => s.mythicCount >= 1 },
  { id: 'first-secret', title: 'Bí Ẩn Tối Thượng', condition: (s: GameState['stats']) => s.secretCount >= 1 },
  { id: 'millionaire', title: 'Tỷ Phú', condition: (s: GameState['stats']) => s.totalCoinsEarned >= 1000000 },
];

interface GameStore extends GameState {
  addRollResult: (sword: Sword) => { instanceId: string; coinsValue: number };
  sellItem: (instanceId: string) => void;
  sellAll: (rarity?: string) => void;
  lockItem: (instanceId: string) => void;
  unlockItem: (instanceId: string) => void;
  purchaseUpgrade: (upgradeId: string) => boolean;
  updateSettings: (settings: Partial<Settings>) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  resetGame: () => void;
  getUpgradeLevel: (upgradeId: string) => number;
  getLuckBoost: () => number;
  getCoinMultiplier: () => number;
  getAutoRollSpeed: () => number;
  enableAdminMode: () => void;
  claimMissionReward: (missionId: string) => void;
  checkAndResetMissions: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addRollResult: (sword: Sword) => {
        const state = get();
        const instanceId = uuidv4();
        const coinMultiplierLevel = state.getUpgradeLevel('coin-multiplier');
        const coinsValue = calculateItemValue(sword.value, coinMultiplierLevel);

        const inventoryItem: InventoryItem = {
          instanceId,
          swordId: sword.id,
          obtainedAt: Date.now(),
          locked: false,
          sold: false,
        };

        const historyEntry: RollHistoryEntry = {
          instanceId,
          swordId: sword.id,
          rolledAt: Date.now(),
          coinsEarned: coinsValue,
        };

        const rarityKey = `${sword.rarity}Count` as keyof typeof state.stats;
        const currentRarityCount = (state.stats[rarityKey] as number) || 0;
        const currentRarityIndex = RARITY_ORDER.indexOf(sword.rarity);
        const bestRarityIndex = state.stats.rarestItem
          ? RARITY_ORDER.indexOf(
              state.inventory.find(i => i.swordId === state.stats.rarestItem)?.swordId ?? '' as any
            )
          : -1;

        const newPity = updatePity(state.pity, sword.rarity);
        const newXp = state.xp + GAME_CONFIG.XP_PER_ROLL;
        const newLevel = Math.floor(newXp / GAME_CONFIG.XP_PER_LEVEL) + 1;

        const newStats = {
          ...state.stats,
          totalRolls: state.stats.totalRolls + 1,
          totalCoinsSpent: state.stats.totalCoinsSpent + GAME_CONFIG.ROLL_COST,
          [rarityKey]: currentRarityCount + 1,
          rarestItem:
            currentRarityIndex > bestRarityIndex ? sword.id : state.stats.rarestItem,
          bestItem:
            sword.value > (state.stats.bestItem ? sword.value : 0)
              ? sword.id
              : state.stats.bestItem,
        };

        // Update daily missions
        const isRarePlus = ['rare', 'epic', 'legendary', 'mythic', 'secret'].includes(sword.rarity);
        const updatedMissions = state.dailyMissions.map(m => {
          if (m.completed) return m;
          let newProgress = m.progress;
          if (m.type === 'rolls') newProgress = m.progress + 1;
          if (m.type === 'rare_roll' && isRarePlus) newProgress = m.progress + 1;
          const completed = newProgress >= m.target;
          return { ...m, progress: newProgress, completed };
        });

        // Check achievements
        const newAchievements = { ...state.achievements };
        const newAchievementUnlockedAt = { ...state.achievementUnlockedAt };
        for (const ach of ACHIEVEMENTS_DEFS) {
          if (!newAchievements[ach.id] && ach.condition(newStats)) {
            newAchievements[ach.id] = true;
            newAchievementUnlockedAt[ach.id] = Date.now();
          }
        }

        set({
          inventory: [...state.inventory, inventoryItem],
          rollHistory: [historyEntry, ...state.rollHistory].slice(0, 100),
          pity: newPity,
          xp: newXp,
          level: newLevel,
          stats: newStats,
          dailyMissions: updatedMissions,
          achievements: newAchievements,
          achievementUnlockedAt: newAchievementUnlockedAt,
        });

        return { instanceId, coinsValue };
      },

      sellItem: (instanceId: string) => {
        const state = get();
        const item = state.inventory.find(i => i.instanceId === instanceId);
        if (!item || item.locked || item.sold) return;

        const sword = getSwordById(item.swordId);
        if (!sword) return;

        const coinMultiplierLevel = state.getUpgradeLevel('coin-multiplier');
        const value = calculateItemValue(sword.value, coinMultiplierLevel);

        // Update sell missions
        const updatedMissions = state.dailyMissions.map(m => {
          if (m.completed || m.type !== 'sell') return m;
          const newProgress = m.progress + 1;
          return { ...m, progress: newProgress, completed: newProgress >= m.target };
        });

        set({
          coins: state.coins + value,
          inventory: state.inventory.map(i =>
            i.instanceId === instanceId ? { ...i, sold: true } : i
          ),
          stats: {
            ...state.stats,
            totalCoinsEarned: state.stats.totalCoinsEarned + value,
          },
          dailyMissions: updatedMissions,
        });
      },

      sellAll: (rarity?: string) => {
        const state = get();
        let totalEarned = 0;
        let sellCount = 0;
        const coinMultiplierLevel = state.getUpgradeLevel('coin-multiplier');

        const updated = state.inventory.map(item => {
          if (item.locked || item.sold) return item;
          const sword = getSwordById(item.swordId);
          if (!sword) return item;
          if (rarity && sword.rarity !== rarity) return item;
          const value = calculateItemValue(sword.value, coinMultiplierLevel);
          totalEarned += value;
          sellCount++;
          return { ...item, sold: true };
        });

        const updatedMissions = state.dailyMissions.map(m => {
          if (m.completed || m.type !== 'sell') return m;
          const newProgress = Math.min(m.progress + sellCount, m.target);
          return { ...m, progress: newProgress, completed: newProgress >= m.target };
        });

        set({
          inventory: updated,
          coins: state.coins + totalEarned,
          stats: {
            ...state.stats,
            totalCoinsEarned: state.stats.totalCoinsEarned + totalEarned,
          },
          dailyMissions: updatedMissions,
        });
      },

      lockItem: (instanceId: string) => {
        set(state => ({
          inventory: state.inventory.map(i =>
            i.instanceId === instanceId ? { ...i, locked: true } : i
          ),
        }));
      },

      unlockItem: (instanceId: string) => {
        set(state => ({
          inventory: state.inventory.map(i =>
            i.instanceId === instanceId ? { ...i, locked: false } : i
          ),
        }));
      },

      purchaseUpgrade: (upgradeId: string) => {
        const state = get();
        const shopItem = SHOP_ITEMS.find(s => s.id === upgradeId);
        if (!shopItem) return false;

        const currentLevel = state.shopUpgrades[upgradeId] ?? 0;
        if (currentLevel >= shopItem.maxLevel) return false;

        const cost = Math.floor(
          shopItem.baseCost * Math.pow(shopItem.costMultiplier, currentLevel)
        );
        if (state.coins < cost) return false;

        const newFeatures = { ...state.unlockedFeatures };
        if (upgradeId === 'unlock-x10') newFeatures.x10Roll = true;
        if (upgradeId === 'unlock-x100') newFeatures.x100Roll = true;

        set({
          coins: state.coins - cost,
          shopUpgrades: {
            ...state.shopUpgrades,
            [upgradeId]: currentLevel + 1,
          },
          unlockedFeatures: newFeatures,
          stats: {
            ...state.stats,
            totalCoinsSpent: state.stats.totalCoinsSpent + cost,
          },
        });

        return true;
      },

      updateSettings: (newSettings: Partial<Settings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      addCoins: (amount: number) => {
        set(state => ({ coins: state.coins + amount }));
      },

      spendCoins: (amount: number) => {
        const state = get();
        if (state.coins < amount) return false;
        set({ coins: state.coins - amount });
        return true;
      },

      resetGame: () => {
        set({ ...INITIAL_STATE, dailyMissions: generateDailyMissions(), lastMissionReset: Date.now() });
      },

      getUpgradeLevel: (upgradeId: string) => {
        return get().shopUpgrades[upgradeId] ?? 0;
      },

      getLuckBoost: () => {
        const state = get();
        if (state.adminMode) return 999;
        const level = state.shopUpgrades['luck-boost'] ?? 0;
        return level * 0.05;
      },

      getCoinMultiplier: () => {
        const level = get().shopUpgrades['coin-multiplier'] ?? 0;
        return 1 + level * 0.1;
      },

      getAutoRollSpeed: () => {
        const state = get();
        const speedLevel = state.shopUpgrades['auto-roll-speed'] ?? 0;
        const base = state.settings.autoRollSpeed;
        return Math.max(GAME_CONFIG.AUTO_ROLL_MIN_SPEED, base - speedLevel * 200);
      },

      enableAdminMode: () => {
        set({
          adminMode: true,
          coins: 9999999,
        });
      },

      claimMissionReward: (missionId: string) => {
        const state = get();
        const mission = state.dailyMissions.find(m => m.id === missionId);
        if (!mission || !mission.completed || mission.claimed) return;

        set({
          coins: state.coins + mission.reward,
          dailyMissions: state.dailyMissions.map(m =>
            m.id === missionId ? { ...m, claimed: true } : m
          ),
        });
      },

      checkAndResetMissions: () => {
        const state = get();
        const now = Date.now();
        const lastReset = new Date(state.lastMissionReset);
        const nowDate = new Date(now);

        const isSameDay =
          lastReset.getFullYear() === nowDate.getFullYear() &&
          lastReset.getMonth() === nowDate.getMonth() &&
          lastReset.getDate() === nowDate.getDate();

        if (!isSameDay) {
          set({
            dailyMissions: generateDailyMissions(),
            lastMissionReset: now,
          });
        }
      },
    }),
    {
      name: 'chip-roll-game-state-v2',
      version: 2,
    }
  )
);
