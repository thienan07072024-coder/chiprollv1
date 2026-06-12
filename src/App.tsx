import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Package, BarChart2, ShoppingCart, CheckSquare, Settings, Coins, Star, Zap, Menu, X, ChevronDown } from 'lucide-react';
import { RollPanel } from './components/roll/RollPanel';
import { InventoryPanel } from './components/inventory/InventoryPanel';
import { StatsPanel } from './components/stats/StatsPanel';
import { MissionsPanel } from './components/missions/MissionsPanel';
import { ShopModal } from './components/shop/ShopModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { Particles } from './components/fx/Particles';
import { ToastProvider, useToast } from './components/fx/Toast';
import { useGameStore } from './stores/gameStore';
import type { ActiveView } from './types';

const LOADING_TIPS = [
  '✨ Pity tích lũy giúp bạn tăng cơ hội ra kiếm hiếm!',
  '⚔️ Mỗi kiếm đều có câu chuyện riêng của nó...',
  '🎲 May mắn không phải ngẫu nhiên — hãy mua Luck Boost!',
  '🏆 Hoàn thành nhiệm vụ hàng ngày để nhận thêm coins!',
  '💎 SECRET item có xác suất 0.1% — rất hiếm, rất xịn!',
  '🌙 Moonblade mạnh nhất vào đêm trăng tròn...',
];

function Starfield() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.1,
            animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
            animationDelay: Math.random() * 4 + 's',
          }}
        />
      ))}
      {/* Nebula layers */}
      <div className="absolute top-0 left-0 w-[600px] h-[400px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[350px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent)', filter: 'blur(80px)' }} />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[300px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse, #ec4899, transparent)', filter: 'blur(100px)' }} />
    </div>
  );
}

function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [tipIdx] = useState(() => Math.floor(Math.random() * LOADING_TIPS.length));

  useEffect(() => {
    const steps = [10, 25, 45, 65, 80, 95, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
        setTimeout(tick, 200 + Math.random() * 150);
      }
    };
    setTimeout(tick, 100);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #050714 0%, #0a0d2e 50%, #050714 100%)' }}>
      <Starfield />

      {/* Logo area */}
      <div className="relative mb-8 z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32"
        >
          <img src="/assets/swords/legendary.png" alt="Logo"
            className="w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.8)) drop-shadow(0 0 40px rgba(217,119,6,0.4))' }}
          />
        </motion.div>
        {/* Orbit dots */}
        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-400 top-1/2 left-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
            style={{
              transformOrigin: `${50 + 50 * Math.cos(deg * Math.PI / 180)}% ${50 + 50 * Math.sin(deg * Math.PI / 180)}%`,
              boxShadow: '0 0 8px rgba(167,139,250,0.8)',
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center z-10 mb-8"
      >
        <h1 className="text-5xl font-bold text-white mb-1 glow-text-purple"
          style={{ fontFamily: '"Cinzel Decorative", serif' }}>
          CHIP ROLL
        </h1>
        <p className="text-purple-300 tracking-[0.4em] text-xs uppercase">
          Fantasy Sword Simulator
        </p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-64 z-10"
      >
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Đang tải...</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-purple-950/60 rounded-full overflow-hidden border border-purple-900/30">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #4c1d95, #7c3aed, #a78bfa)',
              boxShadow: '0 0 10px rgba(124,58,237,0.6)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <motion.p
          key={tipIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-500 text-xs mt-4 text-center leading-relaxed"
        >
          {LOADING_TIPS[tipIdx]}
        </motion.p>
      </motion.div>
    </div>
  );
}

interface NavItemDef {
  view: ActiveView;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

const NAV_ITEMS: NavItemDef[] = [
  { view: 'roll', label: 'Roll Kiếm', icon: <Sword className="w-5 h-5" /> },
  { view: 'inventory', label: 'Kho Báu', icon: <Package className="w-5 h-5" /> },
  { view: 'missions', label: 'Nhiệm Vụ', icon: <CheckSquare className="w-5 h-5" />, color: '#22d3ee' },
  { view: 'stats', label: 'Thống Kê', icon: <BarChart2 className="w-5 h-5" /> },
];

function Sidebar({ activeView, onViewChange, onShop, onSettings }: {
  activeView: ActiveView;
  onViewChange: (v: ActiveView) => void;
  onShop: () => void;
  onSettings: () => void;
}) {
  const { coins, level, xp, dailyMissions, adminMode } = useGameStore();
  const XP_PER_LEVEL = 500;
  const xpProgress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
  const hasMissionReady = dailyMissions.some(m => m.completed && !m.claimed);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <img src="/assets/swords/legendary.png" alt="Logo"
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.7))' }}
            />
          </div>
          <div>
            <h1 className="text-white font-bold leading-none"
              style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: '1rem' }}>
              CHIP ROLL
            </h1>
            <p className="text-[10px] text-slate-500 tracking-widest">SIMULATOR</p>
          </div>
        </div>

        {/* Coins display */}
        <div className="mt-4 coin-display">
          <Coins className="w-4 h-4" />
          <span>{coins.toLocaleString()}</span>
          {adminMode && <span className="text-xs text-yellow-300 ml-1">∞</span>}
        </div>

        {/* Level + XP */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-purple-300 font-medium flex items-center gap-1">
              <Star className="w-3 h-3" /> Lv.{level}
            </span>
            <span className="text-slate-500">{Math.round(xp % XP_PER_LEVEL)}/{XP_PER_LEVEL}</span>
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="text-[10px] text-slate-600 uppercase tracking-widest px-2 mb-2">Menu</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`nav-item ${activeView === item.view ? 'active' : ''} relative`}
            style={activeView === item.view && item.color ? { color: item.color } : {}}
          >
            <span style={item.color && activeView !== item.view ? { color: item.color + '80' } : {}}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            {item.view === 'missions' && hasMissionReady && <span className="notif-dot" />}
          </button>
        ))}

        <div className="text-[10px] text-slate-600 uppercase tracking-widest px-2 mb-2 mt-4">Hệ thống</div>
        <button onClick={onShop} className="nav-item" style={{ color: '#fbbf24' }}>
          <ShoppingCart className="w-5 h-5" />
          <span>Cửa Hàng</span>
        </button>
        <button onClick={onSettings} className="nav-item">
          <Settings className="w-5 h-5" />
          <span>Cài Đặt</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="text-[10px] text-slate-600 text-center">
          Chip Roll v2.0 • Fantasy Gacha
        </div>
        <div className="text-[10px] text-slate-700 text-center mt-0.5">
          All items are virtual
        </div>
      </div>
    </aside>
  );
}

function MobileTopBar({ onMenuToggle, menuOpen }: { onMenuToggle: () => void; menuOpen: boolean }) {
  const { coins, level } = useGameStore();
  return (
    <div className="topbar fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-4 h-14">
      <div className="flex items-center gap-2">
        <img src="/assets/swords/legendary.png" alt="logo" className="w-7 h-7 object-contain"
          style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.7))' }} />
        <span className="text-white font-bold text-sm" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
          CHIP ROLL
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="coin-display text-xs py-1 px-2">
          <Coins className="w-3 h-3" />{coins.toLocaleString()}
        </div>
        <span className="text-purple-300 text-xs">Lv.{level}</span>
      </div>
    </div>
  );
}

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('roll');
  const [loading, setLoading] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { settings, checkAndResetMissions } = useGameStore();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    checkAndResetMissions();
  }, []);

  return (
    <div className={`relative min-h-screen bg-[#050714] ${settings.reduceMotion ? 'reduce-motion' : ''}`}>
      <Starfield />
      <Particles />

      <AnimatePresence>
        {loading && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="app-layout">
          {/* Sidebar (desktop) */}
          <div className="hidden md:block">
            <Sidebar
              activeView={activeView}
              onViewChange={setActiveView}
              onShop={() => setShowShop(true)}
              onSettings={() => setShowSettings(true)}
            />
          </div>

          {/* Mobile top bar */}
          <MobileTopBar onMenuToggle={() => setMobileMenu(!mobileMenu)} menuOpen={mobileMenu} />

          {/* Main content */}
          <main className="main-content">
            {/* Desktop header bar */}
            <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-[#1e2250]"
              style={{ background: 'rgba(5,7,20,0.5)', backdropFilter: 'blur(8px)' }}>
              <div>
                <h2 className="section-title">
                  {NAV_ITEMS.find(n => n.view === activeView)?.label ?? 'Roll Kiếm'}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="coin-display"
                >
                  <Coins className="w-4 h-4" />
                  <span>{useGameStore.getState().coins.toLocaleString()}</span>
                </motion.div>
              </div>
            </div>

            {/* Page content */}
            <div className="p-4 md:p-6 lg:p-8 mt-14 md:mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  variants={PAGE_VARIANTS}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {activeView === 'roll' && <RollPanel />}
                  {activeView === 'inventory' && <InventoryPanel />}
                  {activeView === 'missions' && <MissionsPanel />}
                  {activeView === 'stats' && <StatsPanel />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Mobile bottom nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
            style={{ background: 'rgba(5,7,20,0.97)', borderTop: '1px solid #1e2250', backdropFilter: 'blur(12px)' }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${activeView === item.view ? 'text-purple-300' : 'text-slate-500'}`}
              >
                {item.view === 'missions' && useGameStore.getState().dailyMissions.some(m => m.completed && !m.claimed) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
                {item.icon}
                <span className="text-[10px]">{item.label.split(' ')[0]}</span>
              </button>
            ))}
            <button onClick={() => setShowShop(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-amber-500 transition-all">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px]">Shop</span>
            </button>
            <button onClick={() => setShowSettings(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-slate-500 transition-all">
              <Settings className="w-5 h-5" />
              <span className="text-[10px]">Cài đặt</span>
            </button>
          </div>
        </div>
      )}

      {showShop && <ShopModal onClose={() => setShowShop(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

function AppWrapper() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}

export default AppWrapper;
