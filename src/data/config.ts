export const GAME_CONFIG = {
  // Starting state
  STARTING_COINS: 1000,
  ROLL_COST: 100,

  // Pity thresholds
  PITY_EPIC: 50,
  PITY_LEGENDARY: 200,
  PITY_MYTHIC: 500,
  PITY_SECRET: 1000,

  // Auto-roll
  AUTO_ROLL_BASE_SPEED: 1500, // ms
  AUTO_ROLL_MIN_SPEED: 200, // ms

  // Animation
  ROLL_STRIP_DURATION: 3500, // ms
  ROLL_ITEM_WIDTH: 120, // px
  ROLL_STRIP_COUNT: 40, // number of items in strip

  // XP
  XP_PER_ROLL: 10,
  XP_PER_LEVEL: 500,

  // Sound (placeholder keys)
  SOUNDS: {
    rollStart: 'roll_start',
    tick: 'tick',
    win: 'win',
    epicWin: 'epic_win',
    legendaryWin: 'legendary_win',
    secretWin: 'secret_win',
  },
} as const;
