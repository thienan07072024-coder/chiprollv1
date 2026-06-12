import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Lock, Zap, Sparkles, Package } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { SHOP_ITEMS } from '../../data/shop';
import { useToast } from '../fx/Toast';

interface ShopModalProps {
  onClose: () => void;
}

const CATEGORY_ICONS = {
  luck: <Sparkles className="w-4 h-4" />,
  speed: <Zap className="w-4 h-4" />,
  unlock: <Lock className="w-4 h-4" />,
  cosmetic: <Package className="w-4 h-4" />,
};

const CATEGORY_LABELS = {
  luck: 'Vận may',
  speed: 'Tốc độ',
  unlock: 'Mở khóa',
  cosmetic: 'Ngoại hình',
};

export function ShopModal({ onClose }: ShopModalProps) {
  const { addToast } = useToast();
  const { coins, shopUpgrades, purchaseUpgrade } = useGameStore();

  const handleBuy = (upgradeId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === upgradeId);
    if (!item) return;

    const success = purchaseUpgrade(upgradeId);
    if (success) {
      addToast({ type: 'success', title: `Đã mua: ${item.name}!`, message: item.effect });
    } else {
      const currentLevel = shopUpgrades[upgradeId] ?? 0;
      if (currentLevel >= item.maxLevel) {
        addToast({ type: 'info', title: 'Đã nâng cấp tối đa!' });
      } else {
        addToast({ type: 'error', title: 'Không đủ coins!' });
      }
    }
  };

  const categories = ['luck', 'unlock', 'speed', 'cosmetic'] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl mx-4 card-game overflow-hidden max-h-[85vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-game-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="section-title">Shop</h2>
                <p className="text-slate-500 text-xs">Nâng cấp sức mạnh roll</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="coin-display">
                🪙 <span>{coins.toLocaleString()}</span>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-5 space-y-6">
            {categories.map(category => {
              const items = SHOP_ITEMS.filter(i => i.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-purple-400">{CATEGORY_ICONS[category]}</span>
                    <h3 className="text-sm font-bold text-purple-300 uppercase tracking-widest">
                      {CATEGORY_LABELS[category]}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map(item => {
                      const currentLevel = shopUpgrades[item.id] ?? 0;
                      const isMaxed = currentLevel >= item.maxLevel;
                      const cost = Math.floor(item.baseCost * Math.pow(item.costMultiplier, currentLevel));
                      const canAfford = coins >= cost;

                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl border transition-all ${
                            isMaxed
                              ? 'border-amber-500/50 bg-amber-900/10'
                              : canAfford
                              ? 'border-purple-500/40 bg-purple-900/20 hover:border-purple-400 hover:bg-purple-900/30'
                              : 'border-slate-700/50 bg-slate-800/20 opacity-70'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <p className="text-white font-semibold text-sm">{item.name}</p>
                                <p className="text-slate-400 text-xs">{item.description}</p>
                              </div>
                            </div>
                          </div>

                          {/* Level indicators */}
                          {item.maxLevel > 1 && (
                            <div className="flex gap-1 mb-3">
                              {Array.from({ length: item.maxLevel }).map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 h-1.5 rounded-full transition-all"
                                  style={{
                                    background: i < currentLevel
                                      ? (isMaxed ? '#fbbf24' : '#7c3aed')
                                      : '#1e1e4a',
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-slate-400">
                                Effect: <span className="text-green-400">{item.effect}</span>
                              </span>
                              {item.maxLevel > 1 && (
                                <p className="text-xs text-slate-500">
                                  Level {currentLevel}/{item.maxLevel}
                                </p>
                              )}
                            </div>

                            {isMaxed ? (
                              <span className="text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-900/30 border border-amber-500/40">
                                ✓ MAX
                              </span>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleBuy(item.id)}
                                disabled={!canAfford}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
                                  ${canAfford
                                    ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white border border-amber-500/50 hover:from-amber-500 hover:shadow-glow-legendary'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                                  }`}
                              >
                                🪙 {cost.toLocaleString()}
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
