export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  effect: string;
  category: 'luck' | 'speed' | 'unlock' | 'cosmetic';
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'luck-boost',
    name: 'Lucky Charm',
    description: 'Increases drop rate of Rare+ items by 5% per level.',
    icon: '🍀',
    baseCost: 500,
    costMultiplier: 2.5,
    maxLevel: 5,
    effect: '+5% rare rate',
    category: 'luck',
  },
  {
    id: 'pity-reducer',
    name: 'Pity Accelerator',
    description: 'Reduces pity threshold by 5 rolls per level.',
    icon: '⚡',
    baseCost: 1000,
    costMultiplier: 3,
    maxLevel: 3,
    effect: '-5 pity threshold',
    category: 'luck',
  },
  {
    id: 'coin-multiplier',
    name: 'Gold Aura',
    description: 'Increases coin value of all items by 10% per level.',
    icon: '💰',
    baseCost: 750,
    costMultiplier: 2,
    maxLevel: 5,
    effect: '+10% item value',
    category: 'luck',
  },
  {
    id: 'auto-roll-speed',
    name: 'Auto-Roll Turbo',
    description: 'Reduces delay between auto-rolls by 200ms per level.',
    icon: '🚀',
    baseCost: 2000,
    costMultiplier: 2,
    maxLevel: 4,
    effect: '-200ms delay',
    category: 'speed',
  },
  {
    id: 'unlock-x10',
    name: 'x10 Roll',
    description: 'Unlock the ability to roll 10 times at once.',
    icon: '🎯',
    baseCost: 5000,
    costMultiplier: 1,
    maxLevel: 1,
    effect: 'Unlocks x10',
    category: 'unlock',
  },
  {
    id: 'unlock-x100',
    name: 'x100 Roll',
    description: 'Unlock the ability to roll 100 times at once.',
    icon: '💫',
    baseCost: 50000,
    costMultiplier: 1,
    maxLevel: 1,
    effect: 'Unlocks x100',
    category: 'unlock',
  },
  {
    id: 'frame-gold',
    name: 'Golden Frame',
    description: 'Apply a golden cosmetic frame to the roll area.',
    icon: '✨',
    baseCost: 3000,
    costMultiplier: 1,
    maxLevel: 1,
    effect: 'Gold theme',
    category: 'cosmetic',
  },
  {
    id: 'frame-neon',
    name: 'Neon Frame',
    description: 'Apply a cyberpunk neon frame to the roll area.',
    icon: '🌈',
    baseCost: 5000,
    costMultiplier: 1,
    maxLevel: 1,
    effect: 'Neon theme',
    category: 'cosmetic',
  },
];
