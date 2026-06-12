import type { Sword, Rarity } from '../types';

export const RARITY_CONFIG: Record<Rarity, {
  label: string;
  color: string;
  glowColor: string;
  bgGradient: string;
  dropChance: number;
  pityThreshold: number;
  valueMultiplier: number;
  borderColor: string;
}> = {
  common: {
    label: 'Common',
    color: '#9ca3af',
    glowColor: 'rgba(156,163,175,0.4)',
    bgGradient: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    dropChance: 55,
    pityThreshold: 999,
    valueMultiplier: 1,
    borderColor: '#4b5563',
  },
  uncommon: {
    label: 'Uncommon',
    color: '#4ade80',
    glowColor: 'rgba(74,222,128,0.4)',
    bgGradient: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
    dropChance: 25,
    pityThreshold: 999,
    valueMultiplier: 3,
    borderColor: '#16a34a',
  },
  rare: {
    label: 'Rare',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.5)',
    bgGradient: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)',
    dropChance: 12,
    pityThreshold: 999,
    valueMultiplier: 10,
    borderColor: '#3b82f6',
  },
  epic: {
    label: 'Epic',
    color: '#c084fc',
    glowColor: 'rgba(192,132,252,0.6)',
    bgGradient: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 100%)',
    dropChance: 5,
    pityThreshold: 50,
    valueMultiplier: 40,
    borderColor: '#9333ea',
  },
  legendary: {
    label: 'Legendary',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.7)',
    bgGradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    dropChance: 2,
    pityThreshold: 200,
    valueMultiplier: 200,
    borderColor: '#f59e0b',
  },
  mythic: {
    label: 'Mythic',
    color: '#f87171',
    glowColor: 'rgba(248,113,113,0.8)',
    bgGradient: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
    dropChance: 0.9,
    pityThreshold: 500,
    valueMultiplier: 1000,
    borderColor: '#ef4444',
  },
  secret: {
    label: 'SECRET',
    color: '#ffffff',
    glowColor: 'rgba(255,255,255,0.9)',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    dropChance: 0.1,
    pityThreshold: 1000,
    valueMultiplier: 10000,
    borderColor: '#a78bfa',
  },
};

export const SWORDS: Sword[] = [
  // === COMMON (55% / 5 = 11%) ===
  { id: 'wooden-sword', name: 'Wooden Sword', rarity: 'common', value: 10, dropChance: 11, glowColor: RARITY_CONFIG.common.glowColor, description: 'A basic training sword carved from old oak.', image: '/assets/swords/wooden-sword.png', tags: ['starter'] },
  { id: 'rusty-sword', name: 'Rusty Sword', rarity: 'common', value: 12, dropChance: 11, glowColor: RARITY_CONFIG.common.glowColor, description: 'Found in an old chest. Still sharp enough to cut.', image: '/assets/swords/rusty-sword.png', tags: ['salvaged'] },
  { id: 'bone-sword', name: 'Bone Sword', rarity: 'common', value: 15, dropChance: 11, glowColor: RARITY_CONFIG.common.glowColor, description: 'Carved from monster bones. Lightweight but brittle.', image: '/assets/swords/common.png', tags: ['undead'] },
  { id: 'stone-blade', name: 'Stone Blade', rarity: 'common', value: 14, dropChance: 11, glowColor: RARITY_CONFIG.common.glowColor, description: 'A crude but heavy blade chipped from hard stone.', image: '/assets/swords/common.png', tags: ['heavy', 'ancient'] },
  { id: 'bronze-dagger', name: 'Bronze Dagger', rarity: 'common', value: 18, dropChance: 11, glowColor: RARITY_CONFIG.common.glowColor, description: 'A short bronze dagger often used by thieves.', image: '/assets/swords/common.png', tags: ['fast', 'rogue'] },

  // === UNCOMMON (25% / 6) ===
  { id: 'iron-sword', name: 'Iron Sword', rarity: 'uncommon', value: 50, dropChance: 4.2, glowColor: RARITY_CONFIG.uncommon.glowColor, description: 'A reliable iron blade, favored by city guards.', image: '/assets/swords/uncommon.png', tags: ['standard'] },
  { id: 'hunter-blade', name: 'Hunter Blade', rarity: 'uncommon', value: 65, dropChance: 4.2, glowColor: RARITY_CONFIG.uncommon.glowColor, description: 'Crafted for beast hunters venturing into the wilds.', image: '/assets/swords/uncommon.png', tags: ['hunter'] },
  { id: 'silver-sword', name: 'Silver Sword', rarity: 'uncommon', value: 80, dropChance: 4.2, glowColor: RARITY_CONFIG.uncommon.glowColor, description: 'Effective against supernatural creatures.', image: '/assets/swords/uncommon.png', tags: ['silver', 'anti-curse'] },
  { id: 'serpent-fang', name: 'Serpent Fang', rarity: 'uncommon', value: 70, dropChance: 4.2, glowColor: RARITY_CONFIG.uncommon.glowColor, description: 'A venomous blade taken from a sea serpent.', image: '/assets/swords/uncommon.png', tags: ['venom', 'sea'] },
  { id: 'steel-cleaver', name: 'Steel Cleaver', rarity: 'uncommon', value: 90, dropChance: 4.2, glowColor: RARITY_CONFIG.uncommon.glowColor, description: 'A massive chunk of steel meant to crush armor.', image: '/assets/swords/uncommon.png', tags: ['heavy', 'brutal'] },
  { id: 'yggdrasil-branch', name: 'Yggdrasil Branch', rarity: 'uncommon', value: 75, dropChance: 4.0, glowColor: RARITY_CONFIG.uncommon.glowColor, description: 'A living sword grown from the World Tree Yggdrasil, wrapped in glowing green vines.', image: '/assets/swords/yggdrasil-branch.png', tags: ['nature', 'living', 'magic'] },

  // === RARE (12% / 7) ===
  { id: 'blue-steel-sword', name: 'Blue Steel Sword', rarity: 'rare', value: 200, dropChance: 1.7, glowColor: RARITY_CONFIG.rare.glowColor, description: 'Forged from blue steel alloy, radiating cold energy.', image: '/assets/swords/rare.png', tags: ['enchanted'] },
  { id: 'shadow-saber', name: 'Shadow Saber', rarity: 'rare', value: 250, dropChance: 1.7, glowColor: RARITY_CONFIG.rare.glowColor, description: 'A curved blade that bends light, making strikes unpredictable.', image: '/assets/swords/rare.png', tags: ['shadow'] },
  { id: 'thunder-blade', name: 'Thunder Blade', rarity: 'rare', value: 300, dropChance: 1.7, glowColor: RARITY_CONFIG.rare.glowColor, description: 'Crackles with stored lightning energy.', image: '/assets/swords/rare.png', tags: ['lightning', 'elemental'] },
  { id: 'aurora-saber', name: 'Aurora Saber', rarity: 'rare', value: 280, dropChance: 1.7, glowColor: RARITY_CONFIG.rare.glowColor, description: 'Shimmers with northern light energy.', image: '/assets/swords/rare.png', tags: ['aurora', 'prismatic'] },
  { id: 'crystal-longsword', name: 'Crystal Longsword', rarity: 'rare', value: 350, dropChance: 1.7, glowColor: RARITY_CONFIG.rare.glowColor, description: 'A perfectly clear blade that focuses light into heat.', image: '/assets/swords/rare.png', tags: ['crystal', 'magic'] },
  { id: 'steampunk-chainsword', name: 'Steampunk Chainsword', rarity: 'rare', value: 320, dropChance: 1.75, glowColor: RARITY_CONFIG.rare.glowColor, description: 'A mechanical blade with copper pipes and a spinning chainsaw edge.', image: '/assets/swords/steampunk-chainsword.png', tags: ['steampunk', 'mechanical', 'heavy'] },
  { id: 'obsidian-greatsword', name: 'Obsidian Greatsword', rarity: 'rare', value: 280, dropChance: 1.75, glowColor: RARITY_CONFIG.rare.glowColor, description: 'A massive heavy greatsword made of dark obsidian volcanic glass.', image: '/assets/swords/obsidian-greatsword.png', tags: ['heavy', 'fire', 'ancient'] },

  // === EPIC (5% / 6) ===
  { id: 'crimson-edge', name: 'Crimson Edge', rarity: 'epic', value: 1500, dropChance: 0.8, glowColor: RARITY_CONFIG.epic.glowColor, description: 'A blade bathed in ancient blood rituals, eternally sharp.', image: '/assets/swords/epic.png', tags: ['cursed', 'blood'] },
  { id: 'frost-fang', name: 'Frost Fang', rarity: 'epic', value: 1800, dropChance: 0.8, glowColor: RARITY_CONFIG.epic.glowColor, description: 'Crystallized from glacial ice. Freezes on contact.', image: '/assets/swords/epic.png', tags: ['ice', 'elemental'] },
  { id: 'lava-cutter', name: 'Lava Cutter', rarity: 'epic', value: 2000, dropChance: 0.8, glowColor: RARITY_CONFIG.epic.glowColor, description: 'Forged in a volcanic core. Melts through armor.', image: '/assets/swords/epic.png', tags: ['fire', 'lava'] },
  { id: 'death-whisper', name: 'Death Whisper', rarity: 'epic', value: 2200, dropChance: 0.8, glowColor: RARITY_CONFIG.epic.glowColor, description: 'So quiet it cannot be heard until it is too late.', image: '/assets/swords/epic.png', tags: ['death', 'silence'] },
  { id: 'abyssal-blade', name: 'Abyssal Blade', rarity: 'epic', value: 2500, dropChance: 0.8, glowColor: RARITY_CONFIG.epic.glowColor, description: 'Forged in the darkest depths of the ocean. Crushes with extreme pressure.', image: '/assets/swords/epic.png', tags: ['water', 'abyss'] },
  { id: 'cyberpunk-plasma', name: 'Cyberpunk Plasma', rarity: 'epic', value: 2400, dropChance: 1.0, glowColor: RARITY_CONFIG.epic.glowColor, description: 'A futuristic hilt emitting a bright neon-pink energy plasma blade.', image: '/assets/swords/cyberpunk-plasma.png', tags: ['plasma', 'cyber', 'fire'] },

  // === LEGENDARY (2% / 5) ===
  { id: 'dragon-slayer', name: 'Dragon Slayer', rarity: 'legendary', value: 10000, dropChance: 0.4, glowColor: RARITY_CONFIG.legendary.glowColor, description: 'Forged to slay the ancient dragon Kaelthas. Still burns with draconic fire.', image: '/assets/swords/legendary.png', tags: ['dragon', 'fire', 'ancient'] },
  { id: 'void-katana', name: 'Void Katana', rarity: 'legendary', value: 12000, dropChance: 0.4, glowColor: RARITY_CONFIG.legendary.glowColor, description: 'A blade folded from collapsed star matter. Cuts through dimensions.', image: '/assets/swords/legendary.png', tags: ['void', 'cosmic', 'ancient'] },
  { id: 'moonblade', name: 'Moonblade', rarity: 'legendary', value: 14000, dropChance: 0.4, glowColor: RARITY_CONFIG.legendary.glowColor, description: 'Empowered by lunar cycles. Strongest at full moon.', image: '/assets/swords/legendary.png', tags: ['lunar', 'cycle'] },
  { id: 'sunfire-greatsword', name: 'Sunfire Greatsword', rarity: 'legendary', value: 15000, dropChance: 0.4, glowColor: RARITY_CONFIG.legendary.glowColor, description: 'Radiates the blinding heat of a miniature sun. Blinds enemies on draw.', image: '/assets/swords/legendary.png', tags: ['sun', 'fire', 'holy'] },
  { id: 'nebula-rapier', name: 'Nebula Rapier', rarity: 'legendary', value: 16000, dropChance: 0.4, glowColor: RARITY_CONFIG.legendary.glowColor, description: 'A slender elegant rapier forged from stardust, trailing cosmic stardust.', image: '/assets/swords/legendary.png', tags: ['cosmic', 'light', 'fast'] },

  // === MYTHIC (0.9% / 4 = 0.225%) ===
  { id: 'celestial-blade', name: 'Celestial Blade', rarity: 'mythic', value: 50000, dropChance: 0.225, glowColor: RARITY_CONFIG.mythic.glowColor, description: 'Descended from the heavens. Angels weep when it is drawn.', image: '/assets/swords/mythic.png', tags: ['divine', 'holy', 'celestial'] },
  { id: 'phantom-excalibur', name: 'Phantom Excalibur', rarity: 'mythic', value: 65000, dropChance: 0.225, glowColor: RARITY_CONFIG.mythic.glowColor, description: 'The legendary sword of the phantom king. Only the worthy may hold it.', image: '/assets/swords/mythic.png', tags: ['royal', 'phantom', 'legendary'] },
  { id: 'stormcaller', name: 'Stormcaller', rarity: 'mythic', value: 80000, dropChance: 0.225, glowColor: RARITY_CONFIG.mythic.glowColor, description: 'Commands the fury of storms. Brings hurricanes with each swing.', image: '/assets/swords/mythic.png', tags: ['storm', 'wind', 'chaos'] },
  { id: 'soul-harvester', name: 'Soul Harvester', rarity: 'mythic', value: 100000, dropChance: 0.225, glowColor: RARITY_CONFIG.mythic.glowColor, description: 'Reaps the souls of the fallen, growing endlessly sharper.', image: '/assets/swords/mythic.png', tags: ['soul', 'reaper', 'dark'] },

  // === SECRET (0.1% / 3) ===
  { id: 'godbreaker-sword', name: 'Godbreaker Sword', rarity: 'secret', value: 1000000, dropChance: 0.033, glowColor: RARITY_CONFIG.secret.glowColor, description: 'A weapon that ended the Age of Gods. Its mere existence distorts reality.', image: '/assets/swords/secret.png', tags: ['forbidden', 'godkiller', 'reality-warper'] },
  { id: 'infinity-edge', name: 'Infinity Edge', rarity: 'secret', value: 5000000, dropChance: 0.033, glowColor: RARITY_CONFIG.secret.glowColor, description: 'Contains the power of all elements and dimensions combined into a single edge.', image: '/assets/swords/secret.png', tags: ['infinite', 'ultimate', 'creator'] },
  { id: 'glitch-blade', name: 'Glitch Blade', rarity: 'secret', value: 6000000, dropChance: 0.034, glowColor: RARITY_CONFIG.secret.glowColor, description: 'A sword that flickers in and out of reality, leaving floating RGB digital pixel trails.', image: '/assets/swords/secret.png', tags: ['glitch', 'forbidden', 'reality-warper'] },
];

// Only swords with dropChance > 0 are rollable
export const ROLLABLE_SWORDS = SWORDS.filter(s => s.dropChance > 0);

export function getSwordById(id: string): Sword | undefined {
  return SWORDS.find(s => s.id === id);
}
