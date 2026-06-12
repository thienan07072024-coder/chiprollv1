import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Package, ShoppingCart, BarChart2, Settings, Coins, Star, ChevronDown } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { ShopModal } from '../shop/ShopModal';
import { SettingsModal } from '../settings/SettingsModal';
import type { ActiveView } from '../../types';

const GAME_CONFIG_COST = 100;

interface TopBarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const NAV_ITEMS: Array<{ view: ActiveView; label: string; icon: React.ReactNode }> = [
  { view: 'roll', label: 'Roll', icon: <Sword className="w-4 h-4" /> },
  { view: 'inventory', label: 'Kho', icon: <Package className="w-4 h-4" /> },
  { view: 'stats', label: 'Thống kê', icon: <BarChart2 className="w-4 h-4" /> },
];

export function TopBar({ activeView, onViewChange }: TopBarProps) {
  const { coins, level, xp } = useGameStore();
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const XP_PER_LEVEL = 500;
  const xpProgress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-game-border bg-game-bg/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <img src="/assets/swords/legendary.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
                <div className="absolute inset-0 blur-md opacity-30 bg-amber-400 rounded-full"></div>
              </div>
              <div>
                <h1 className="font-game text-lg font-bold leading-none glow-text-purple text-white">
                  Chip Roll
                </h1>
                <p className="text-[10px] text-slate-500 leading-none tracking-widest">ROLL KIẾM • MỞ VẬN MAY</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.view}
                  onClick={() => onViewChange(item.view)}
                  className={activeView === item.view ? 'nav-tab-active' : 'nav-tab'}
                >
                  <span className="flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                </button>
              ))}
              <button
                onClick={() => setShowShop(true)}
                className="nav-tab flex items-center gap-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
              >
                <ShoppingCart className="w-4 h-4" />
                Shop
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="nav-tab flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                Cài đặt
              </button>
            </nav>

            {/* Right: Stats + Mobile */}
            <div className="flex items-center gap-3">
              {/* Coins */}
              <div className="coin-display">
                <Coins className="w-3.5 h-3.5" />
                <span className="font-mono">{coins.toLocaleString()}</span>
              </div>

              {/* Level + XP */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-sm font-bold text-purple-300">Lv.{level}</span>
                </div>
                <div className="w-16 xp-bar">
                  <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-game-border py-3 flex flex-wrap gap-2"
            >
              {NAV_ITEMS.map(item => (
                <button
                  key={item.view}
                  onClick={() => { onViewChange(item.view); setMobileMenuOpen(false); }}
                  className={activeView === item.view ? 'nav-tab-active' : 'nav-tab'}
                >
                  <span className="flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                </button>
              ))}
              <button
                onClick={() => { setShowShop(true); setMobileMenuOpen(false); }}
                className="nav-tab flex items-center gap-1.5 text-amber-400"
              >
                <ShoppingCart className="w-4 h-4" />
                Shop
              </button>
              <button
                onClick={() => { setShowSettings(true); setMobileMenuOpen(false); }}
                className="nav-tab flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                Cài đặt
              </button>
            </motion.div>
          )}
        </div>
      </header>

      {showShop && <ShopModal onClose={() => setShowShop(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
