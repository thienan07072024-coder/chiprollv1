import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Lock, Unlock, DollarSign, Trash2, LayoutGrid, List, Search, SortAsc } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { getSwordById, RARITY_CONFIG, SWORDS } from '../../data/swords';
import { getRarityColor, getRarityBorder, calculateItemValue } from '../../lib/random';
import { useToast } from '../fx/Toast';
import type { Rarity } from '../../types';

const RARITY_ORDER: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'secret'];

export function InventoryPanel() {
  const { addToast } = useToast();
  const { inventory, lockItem, unlockItem, sellItem, sellAll, getUpgradeLevel } = useGameStore();
  const [filterRarity, setFilterRarity] = useState<Rarity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rarity' | 'value'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const coinMultiplierLevel = getUpgradeLevel('coin-multiplier');

  const activeItems = useMemo(() => inventory.filter(i => !i.sold), [inventory]);

  const filtered = useMemo(() => {
    let items = activeItems;
    if (filterRarity !== 'all') {
      items = items.filter(i => getSwordById(i.swordId)?.rarity === filterRarity);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i => {
        const s = getSwordById(i.swordId);
        return s && (s.name.toLowerCase().includes(q) || s.tags?.some(t => t.includes(q)));
      });
    }
    return [...items].sort((a, b) => {
      const sa = getSwordById(a.swordId);
      const sb = getSwordById(b.swordId);
      if (!sa || !sb) return 0;
      if (sortBy === 'newest') return b.obtainedAt - a.obtainedAt;
      if (sortBy === 'rarity') return RARITY_ORDER.indexOf(sb.rarity) - RARITY_ORDER.indexOf(sa.rarity);
      return sb.value - sa.value;
    });
  }, [activeItems, filterRarity, sortBy, search]);

  // Collection progress
  const uniqueIds = new Set(activeItems.map(i => i.swordId));
  const collectionPct = Math.round((uniqueIds.size / SWORDS.length) * 100);

  const handleSell = (instanceId: string) => {
    const item = inventory.find(i => i.instanceId === instanceId);
    const sword = item ? getSwordById(item.swordId) : null;
    const value = sword ? calculateItemValue(sword.value, coinMultiplierLevel) : 0;
    sellItem(instanceId);
    if (sword) addToast({ type: 'success', title: `Đã bán ${sword.name}`, message: `+${value.toLocaleString()} xu` });
  };

  const handleSellAll = () => {
    const count = activeItems.filter(i => !i.locked).length;
    if (count === 0) return;
    sellAll();
    addToast({ type: 'success', title: `Đã bán ${count} kiếm!`, message: 'Coins đã được cộng vào túi.' });
  };

  const handleSellByRarity = (rarity: Rarity) => {
    const count = activeItems.filter(i => !i.locked && getSwordById(i.swordId)?.rarity === rarity).length;
    if (count === 0) return;
    sellAll(rarity);
    addToast({ type: 'success', title: `Đã bán ${count} ${RARITY_CONFIG[rarity].label}!` });
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4">
      {/* Header + Collection */}
      <div className="card-game p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="section-title mb-1">Kho Báu</h2>
            <p className="text-slate-500 text-xs">
              {activeItems.length} kiếm • {activeItems.filter(i => i.locked).length} khóa •{' '}
              <span className="text-purple-400">{uniqueIds.size}/{SWORDS.length} bộ sưu tập</span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSellAll}
              disabled={activeItems.filter(i => !i.locked).length === 0}
              className="btn-danger flex items-center gap-1.5 px-3 py-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Bán tất cả
            </motion.button>
          </div>
        </div>

        {/* Collection progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Bộ sưu tập</span>
            <span className="text-purple-300 font-mono">{collectionPct}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${collectionPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', boxShadow: '0 0 8px rgba(124,58,237,0.5)' }}
            />
          </div>
        </div>

        {/* Filters + Controls row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="input-game w-full pl-9 py-2 text-sm"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 text-slate-500">
            <SortAsc className="w-4 h-4" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="input-game text-sm py-2 px-2 bg-transparent"
            >
              <option value="newest">Mới nhất</option>
              <option value="rarity">Độ hiếm</option>
              <option value="value">Giá trị</option>
            </select>
          </div>

          {/* View mode */}
          <div className="flex rounded-lg overflow-hidden border border-[#1e2250]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-all ${viewMode === 'grid' ? 'bg-purple-900/50 text-purple-300' : 'text-slate-600 hover:text-slate-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-all ${viewMode === 'list' ? 'bg-purple-900/50 text-purple-300' : 'text-slate-600 hover:text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rarity filter pills */}
        <div className="flex gap-2 flex-wrap mt-3">
          <button
            onClick={() => setFilterRarity('all')}
            className={`rarity-badge border transition-all text-xs ${filterRarity === 'all'
              ? 'border-purple-500 bg-purple-900/50 text-purple-300'
              : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}
          >
            Tất cả ({activeItems.length})
          </button>
          {RARITY_ORDER.map(rarity => {
            const count = activeItems.filter(i => getSwordById(i.swordId)?.rarity === rarity).length;
            if (count === 0) return null;
            const cfg = RARITY_CONFIG[rarity];
            return (
              <button
                key={rarity}
                onClick={() => setFilterRarity(rarity)}
                className="rarity-badge border transition-all text-xs"
                style={{
                  borderColor: filterRarity === rarity ? cfg.color : `${cfg.color}35`,
                  color: cfg.color,
                  background: filterRarity === rarity ? `${cfg.color}18` : 'transparent',
                  boxShadow: filterRarity === rarity ? `0 0 10px ${cfg.glowColor}` : 'none',
                }}
              >
                {cfg.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Quick sell by rarity */}
        {filterRarity !== 'all' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3"
          >
            <button
              onClick={() => handleSellByRarity(filterRarity as Rarity)}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-800/50 text-red-400 hover:bg-red-900/20 transition-all"
            >
              Bán tất cả {RARITY_CONFIG[filterRarity as Rarity]?.label}
            </button>
          </motion.div>
        )}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="card-game p-16 text-center">
          <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">Không có kiếm nào</p>
          <p className="text-slate-600 text-sm mt-1">
            {search ? 'Thử từ khóa khác nhé!' : 'Hãy roll để nhận kiếm!'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const sword = getSwordById(item.swordId);
              if (!sword) return null;
              const rarityColor = getRarityColor(sword.rarity);
              const cfg = RARITY_CONFIG[sword.rarity];
              const displayValue = calculateItemValue(sword.value, coinMultiplierLevel);

              return (
                <motion.div
                  key={item.instanceId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                  className="inventory-card relative rounded-xl border-2 overflow-hidden group"
                  style={{
                    borderColor: item.locked ? `${rarityColor}90` : `${rarityColor}40`,
                    background: cfg.bgGradient,
                    boxShadow: item.locked ? `0 0 20px ${cfg.glowColor}` : `0 2px 8px rgba(0,0,0,0.3)`,
                  }}
                >
                  {/* Lock indicator */}
                  {item.locked && (
                    <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-yellow-900/60 flex items-center justify-center border border-yellow-500/50">
                      <Lock className="w-3 h-3 text-yellow-400" />
                    </div>
                  )}

                  <div className="p-3 flex flex-col items-center gap-2">
                    <div className="flex justify-center items-center h-16 w-full">
                      <img src={sword.image} alt={sword.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: `drop-shadow(0 0 8px ${rarityColor}70)` }}
                      />
                    </div>
                    <div className="text-center w-full">
                      <p className="text-xs font-semibold leading-tight text-white truncate w-full">{sword.name}</p>
                      <p className="text-[10px] mt-0.5 font-bold" style={{ color: rarityColor, fontFamily: '"Cinzel", serif' }}>
                        {cfg.label}
                      </p>
                    </div>
                    <p className="text-amber-400 font-mono text-[10px] font-bold">
                      💰 {displayValue.toLocaleString()}
                    </p>
                  </div>

                  {/* Bottom rarity strip */}
                  <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)` }} />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => item.locked ? unlockItem(item.instanceId) : lockItem(item.instanceId)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-yellow-500/40 text-yellow-400 hover:bg-yellow-900/30 transition-colors text-xs"
                    >
                      {item.locked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {item.locked ? 'Mở khóa' : 'Khóa'}
                    </button>
                    {!item.locked && (
                      <button
                        onClick={() => handleSell(item.instanceId)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-900/30 transition-colors text-xs"
                      >
                        <DollarSign className="w-3 h-3" />
                        Bán ({displayValue.toLocaleString()})
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* List view */
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const sword = getSwordById(item.swordId);
              if (!sword) return null;
              const rarityColor = getRarityColor(sword.rarity);
              const cfg = RARITY_CONFIG[sword.rarity];
              const displayValue = calculateItemValue(sword.value, coinMultiplierLevel);

              return (
                <motion.div
                  key={item.instanceId}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                  className="flex items-center gap-4 p-3 rounded-xl border group hover:border-opacity-60 transition-all"
                  style={{
                    borderColor: `${rarityColor}30`,
                    background: `linear-gradient(135deg, ${rarityColor}06, rgba(13,16,40,0.8))`,
                  }}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0"
                    style={{ background: cfg.bgGradient }}>
                    <img src={sword.image} alt={sword.name}
                      className="w-10 h-10 object-contain"
                      style={{ filter: `drop-shadow(0 0 5px ${rarityColor}70)` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{sword.name}</span>
                      {item.locked && <Lock className="w-3 h-3 text-yellow-400" />}
                    </div>
                    <span className="text-xs font-bold" style={{ color: rarityColor, fontFamily: '"Cinzel", serif' }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="text-amber-400 font-mono text-sm font-bold shrink-0">
                    {displayValue.toLocaleString()} xu
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => item.locked ? unlockItem(item.instanceId) : lockItem(item.instanceId)}
                      className="p-1.5 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-900/20 transition-colors"
                    >
                      {item.locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                    {!item.locked && (
                      <button
                        onClick={() => handleSell(item.instanceId)}
                        className="p-1.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-900/20 transition-colors"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
