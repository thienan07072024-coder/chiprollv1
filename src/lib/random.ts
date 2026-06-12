import { ROLLABLE_SWORDS, RARITY_CONFIG } from '../data/swords';
import type { Sword, PityState } from '../types';

/**
 * Perform a weighted random sword selection with pity system.
 * Pity increases drop chance for higher rarities after many dry rolls.
 */
export function rollSword(pity: PityState, luckBoost: number = 0): Sword {
  // Build weighted pool
  const pool: Array<{ sword: Sword; weight: number }> = [];

  for (const sword of ROLLABLE_SWORDS) {
    let weight = sword.dropChance;

    // Pity boosts — increase weight of higher rarities if pity is building
    if (sword.rarity === 'epic' && pity.rollsSinceEpic >= 40) {
      const overflow = pity.rollsSinceEpic - 40;
      weight += overflow * 0.5;
    }
    if (sword.rarity === 'legendary' && pity.rollsSinceLegendary >= 150) {
      const overflow = pity.rollsSinceLegendary - 150;
      weight += overflow * 0.02;
    }

    // Luck boost from shop upgrades
    if (['epic', 'legendary', 'mythic', 'secret'].includes(sword.rarity)) {
      weight *= 1 + luckBoost;
    }

    pool.push({ sword, weight });
  }

  const totalWeight = pool.reduce((sum, { weight }) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const { sword, weight } of pool) {
    random -= weight;
    if (random <= 0) return sword;
  }

  // Fallback to last item (should not happen)
  return ROLLABLE_SWORDS[ROLLABLE_SWORDS.length - 1];
}

/**
 * Generate a full animation strip of swords ending with the result.
 */
export function generateRollStrip(result: Sword, count: number = 40): Sword[] {
  const allSwords = ROLLABLE_SWORDS;
  const strip: Sword[] = [];

  for (let i = 0; i < count - 1; i++) {
    strip.push(allSwords[Math.floor(Math.random() * allSwords.length)]);
  }

  // Winner goes near the end (position count-3 for centering)
  strip.splice(count - 4, 0, result);
  return strip;
}

/**
 * Update pity counters after a roll result.
 */
export function updatePity(pity: PityState, rarity: string): PityState {
  const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'secret'];
  const rarityIndex = rarityOrder.indexOf(rarity);

  return {
    rollsSinceEpic: rarityIndex >= 3 ? 0 : pity.rollsSinceEpic + 1,
    rollsSinceLegendary: rarityIndex >= 4 ? 0 : pity.rollsSinceLegendary + 1,
    rollsSinceMythic: rarityIndex >= 5 ? 0 : pity.rollsSinceMythic + 1,
    rollsSinceSecret: rarityIndex >= 6 ? 0 : pity.rollsSinceSecret + 1,
  };
}

/**
 * Get rarity color from config.
 */
export function getRarityColor(rarity: string): string {
  return RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG]?.color ?? '#9ca3af';
}

export function getRarityGlow(rarity: string): string {
  return RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG]?.glowColor ?? 'rgba(156,163,175,0.4)';
}

export function getRarityLabel(rarity: string): string {
  return RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG]?.label ?? rarity;
}

export function getRarityBg(rarity: string): string {
  return RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG]?.bgGradient ?? '';
}

export function getRarityBorder(rarity: string): string {
  return RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG]?.borderColor ?? '#4b5563';
}

/**
 * Calculate item value with shop upgrades applied.
 */
export function calculateItemValue(baseValue: number, coinMultiplierLevel: number): number {
  return Math.floor(baseValue * (1 + coinMultiplierLevel * 0.1));
}
