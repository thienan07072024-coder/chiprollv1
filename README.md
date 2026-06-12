# Chip Roll ⚔️

**Fantasy Neon Gacha Roll Simulator**

> Roll kiếm, mở vận may

A fully client-side, static web app — roll for fantasy swords with a gacha probability system, pity mechanics, inventory management, shop upgrades, and stunning visual effects.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested with v24)
- npm 9+

### Run locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → Open http://localhost:5173
```

### Build for production

```bash
npm run build
# Output: ./dist/
```

### Preview production build

```bash
npm run preview
# → Open http://localhost:4173
```

---

## ☁️ Deploy to Cloudflare Pages

### Option 1: Via Cloudflare Dashboard (Recommended)

1. Push this repository to GitHub/GitLab
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click **Create a project** → Connect your Git repository
4. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or `chip-roll/` if inside a monorepo)
5. Click **Save and Deploy**
6. Your app is live at `https://chip-roll.pages.dev`!

### Option 2: Direct Upload (Wrangler CLI)

```bash
# Install Wrangler
npm install -g wrangler

# Build
npm run build

# Deploy
wrangler pages deploy dist --project-name chip-roll
```

### Option 3: Drag & Drop

1. Run `npm run build`
2. Go to Cloudflare Pages Dashboard
3. Create a project → **Upload assets**
4. Drag the `./dist` folder

---

## 📁 Project Structure

```
chip-roll/
├── public/
│   └── favicon.svg              # App icon
├── src/
│   ├── types/
│   │   └── index.ts             # All TypeScript interfaces (Sword, InventoryItem, GameState...)
│   ├── data/
│   │   ├── swords.ts            # 20+ sword definitions + RARITY_CONFIG
│   │   ├── shop.ts              # Shop upgrade definitions
│   │   └── config.ts            # Game constants (roll cost, pity thresholds, speeds)
│   ├── lib/
│   │   └── random.ts            # Weighted random, pity update, strip generation
│   ├── stores/
│   │   └── gameStore.ts         # Zustand state (coins, inventory, stats, pity, settings)
│   ├── components/
│   │   ├── layout/
│   │   │   └── TopBar.tsx       # Header: logo, nav, coins, XP, shop/settings buttons
│   │   ├── roll/
│   │   │   ├── RollPanel.tsx    # Main roll area, auto-roll, x10, pity bar
│   │   │   ├── RollTrack.tsx    # Animated horizontal strip (Framer Motion)
│   │   │   ├── RollCard.tsx     # Individual sword card
│   │   │   └── RollResult.tsx   # Win result modal
│   │   ├── inventory/
│   │   │   └── InventoryPanel.tsx  # Grid inventory, filter, lock, sell
│   │   ├── stats/
│   │   │   └── StatsPanel.tsx   # Roll stats, rarity breakdown, achievements
│   │   ├── shop/
│   │   │   └── ShopModal.tsx    # Upgrade shop modal
│   │   ├── settings/
│   │   │   └── SettingsModal.tsx  # Toggle sound/effects/motion, theme, reset
│   │   └── fx/
│   │       ├── Particles.tsx    # Canvas background particles
│   │       ├── Confetti.tsx     # Canvas confetti for rare wins
│   │       └── Toast.tsx        # Toast notification system
│   ├── App.tsx                  # Root: loading screen, view routing, layout
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles, Tailwind, animations
├── index.html                   # HTML entry with font imports
├── vite.config.ts               # Vite config (base: './')
├── tailwind.config.js           # Tailwind with game theme
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## ⚙️ Game Mechanics

### Roll System
- Each roll costs **100 coins**
- Result is picked via **weighted random** based on `dropChance`
- Starting coins: **1000** (enough for 10 rolls)

### Rarity & Drop Rates

| Rarity    | Drop Rate | Base Value  | Color  |
|-----------|-----------|-------------|--------|
| Common    | 55%       | 10-15       | Gray   |
| Uncommon  | 25%       | 50-80       | Green  |
| Rare      | 12%       | 200-350     | Blue   |
| Epic      | 5%        | 1500-2200   | Purple |
| Legendary | 2%        | 10000-15000 | Gold   |
| Mythic    | 0.9%      | 75000-100000| Red    |
| Secret    | 0.1%      | 1,000,000   | White  |

### Pity System
- **Epic pity**: After 50 rolls without Epic+, drop rate starts increasing
- **Legendary pity**: After 200 rolls without Legendary+, drop rate increases
- Pity resets when you get the qualifying rarity

### Auto-Roll
- Runs continuously until you click **Stop Auto** or run out of coins
- Only shows toast notifications (not full modal) for Common/Uncommon results
- Always shows modal for Epic+ items
- Speed configurable in Settings (0.5s - 2s between rolls)

### Inventory
- All obtained swords are stored in localStorage
- **Lock** items to protect from bulk sell
- **Sell All** sells all unlocked items at once
- Filter by rarity, sort by date/rarity/value

### Shop Upgrades
- **Lucky Charm**: +5% Epic+ drop rate per level (max 5)
- **Pity Accelerator**: -5 rolls to pity threshold per level (max 3)
- **Gold Aura**: +10% sell value per level (max 5)
- **Auto-Roll Turbo**: -200ms delay per level (max 4)
- **x10 Roll**: Unlock batch roll (costs 5,000 coins)
- **x100 Roll**: Unlock mega batch roll (costs 50,000 coins)

---

## 🎨 Customization

### Edit drop rates — `src/data/swords.ts`
Change `dropChance` for each sword in `ROLLABLE_SWORDS`.

### Edit roll cost — `src/data/config.ts`
```ts
ROLL_COST: 100,       // cost per roll
STARTING_COINS: 1000, // initial coins
```

### Edit pity thresholds — `src/data/config.ts`
```ts
PITY_EPIC: 50,        // rolls without epic before boost
PITY_LEGENDARY: 200,  // rolls without legendary before boost
```

### Add new swords — `src/data/swords.ts`
Add to the `SWORDS` array with `dropChance > 0` to make it rollable.

---

## 🛠️ Tech Stack

- **Vite 5** + **React 18** + **TypeScript**
- **Tailwind CSS 3** — utility-first styling
- **Framer Motion 11** — animations
- **Zustand 4** — state management with localStorage persist
- **Lucide React** — icons
- **UUID** — unique IDs for inventory items

---

## 📝 License

MIT — Free to use, modify, and deploy.
