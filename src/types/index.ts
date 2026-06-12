export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'
  | 'secret';

export interface Sword {
  id: string;
  name: string;
  rarity: Rarity;
  value: number;
  dropChance: number;
  glowColor: string;
  description: string;
  image: string;
  tags?: string[];
}

export interface InventoryItem {
  instanceId: string;
  swordId: string;
  obtainedAt: number;
  locked: boolean;
  sold: boolean;
}

export interface RollHistoryEntry {
  instanceId: string;
  swordId: string;
  rolledAt: number;
  coinsEarned: number;
}

export interface PlayerStats {
  totalRolls: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  bestItem: string | null;
  rarestItem: string | null;
  commonCount: number;
  uncommonCount: number;
  rareCount: number;
  epicCount: number;
  legendaryCount: number;
  mythicCount: number;
  secretCount: number;
}

export interface PityState {
  rollsSinceEpic: number;
  rollsSinceLegendary: number;
  rollsSinceMythic: number;
  rollsSinceSecret: number;
}

export interface ShopUpgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  maxLevel: number;
  currentLevel: number;
  effect: string;
}

export interface Settings {
  soundEnabled: boolean;
  flashEffects: boolean;
  reduceMotion: boolean;
  autoRollSpeed: number;
  theme: 'purple' | 'blue' | 'red' | 'gold';
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
  type: 'rolls' | 'sell' | 'earn' | 'rare_roll';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  condition: (stats: PlayerStats) => boolean;
}

export interface GameState {
  coins: number;
  xp: number;
  level: number;
  inventory: InventoryItem[];
  rollHistory: RollHistoryEntry[];
  stats: PlayerStats;
  pity: PityState;
  shopUpgrades: Record<string, number>;
  settings: Settings;
  unlockedFeatures: {
    x10Roll: boolean;
    x100Roll: boolean;
    autoRoll: boolean;
  };
  adminMode?: boolean;
  dailyMissions: DailyMission[];
  lastMissionReset: number;
  achievements: Record<string, boolean>;
  achievementUnlockedAt: Record<string, number>;
}

export interface RollResult {
  sword: Sword;
  instanceId: string;
  isNew: boolean;
  coinsIfSold: number;
}

export type ActiveView = 'roll' | 'inventory' | 'shop' | 'stats' | 'missions';
