import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Zap, Eye, EyeOff, RotateCcw, Palette, Clock, Key } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { useToast } from '../fx/Toast';
import type { Settings } from '../../types';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { addToast } = useToast();
  const { settings, updateSettings, resetGame, enableAdminMode } = useGameStore();
  const [cheatCode, setCheatCode] = useState('');

  const handleCheatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cheatCode.toLowerCase() === 'admin123') {
      enableAdminMode();
      addToast({
        type: 'mythic',
        title: 'GOD MODE ACTIVATED',
        message: 'Max Luck + 9,999,999 Coins!',
        duration: 5000,
      });
      setCheatCode('');
      onClose();
    } else {
      addToast({ type: 'error', title: 'Thất bại', message: 'Mã không hợp lệ' });
    }
  };

  const handleReset = () => {
    if (window.confirm('⚠️ Đặt lại toàn bộ data? Không thể hoàn tác!')) {
      resetGame();
      addToast({ type: 'info', title: 'Đã đặt lại game!', message: 'Tất cả dữ liệu đã được xóa.' });
      onClose();
    }
  };

  const themes: Array<{ value: Settings['theme']; label: string; color: string }> = [
    { value: 'purple', label: 'Purple', color: '#7c3aed' },
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'red', label: 'Red', color: '#dc2626' },
    { value: 'gold', label: 'Gold', color: '#d97706' },
  ];

  const speeds = [
    { value: 2000, label: 'Chậm (2s)' },
    { value: 1500, label: 'Bình thường (1.5s)' },
    { value: 1000, label: 'Nhanh (1s)' },
    { value: 500, label: 'Rất nhanh (0.5s)' },
  ];

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
          className="relative w-full max-w-md mx-4 card-game overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-game-border flex items-center justify-between">
            <div>
              <h2 className="section-title">Cài Đặt</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Toggle: Sound */}
            <SettingToggle
              icon={settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              label="Âm thanh"
              description="Bật/tắt hiệu ứng âm thanh"
              value={settings.soundEnabled}
              onChange={v => updateSettings({ soundEnabled: v })}
            />

            {/* Toggle: Flash */}
            <SettingToggle
              icon={settings.flashEffects ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              label="Hiệu ứng Flash"
              description="Hiệu ứng sáng khi ra item hiếm"
              value={settings.flashEffects}
              onChange={v => updateSettings({ flashEffects: v })}
            />

            {/* Toggle: Reduce Motion */}
            <SettingToggle
              icon={<Zap className="w-5 h-5" />}
              label="Giảm Animation"
              description="Tắt animation phức tạp (tăng hiệu suất)"
              value={settings.reduceMotion}
              onChange={v => updateSettings({ reduceMotion: v })}
            />

            {/* Auto-roll speed */}
            <div className="p-4 rounded-xl bg-game-surface border border-game-border">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-purple-400"><Clock className="w-5 h-5" /></span>
                <div>
                  <p className="text-white font-medium">Tốc độ Auto-Roll</p>
                  <p className="text-slate-500 text-xs">Khoảng thời gian giữa các roll</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {speeds.map(speed => (
                  <button
                    key={speed.value}
                    onClick={() => updateSettings({ autoRollSpeed: speed.value })}
                    className={`py-2 px-3 rounded-lg text-sm border transition-all ${
                      settings.autoRollSpeed === speed.value
                        ? 'border-purple-500 bg-purple-900/50 text-purple-300'
                        : 'border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="p-4 rounded-xl bg-game-surface border border-game-border">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-purple-400"><Palette className="w-5 h-5" /></span>
                <div>
                  <p className="text-white font-medium">Màu chủ đạo</p>
                  <p className="text-slate-500 text-xs">Thay đổi màu accent của UI</p>
                </div>
              </div>
              <div className="flex gap-3">
                {themes.map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => updateSettings({ theme: theme.value })}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      settings.theme === theme.value ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ background: theme.color }}
                    title={theme.label}
                  />
                ))}
              </div>
            </div>

            {/* Cheat Code */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-purple-400"><Key className="w-5 h-5" /></span>
                <div>
                  <p className="text-purple-300 font-medium">Nhập mã bí mật</p>
                </div>
              </div>
              <form onSubmit={handleCheatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={cheatCode}
                  onChange={e => setCheatCode(e.target.value)}
                  placeholder="Nhập mã..."
                  className="flex-1 bg-black/40 border border-purple-900/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button type="submit" className="btn-primary px-4 py-2 text-sm">
                  Kích hoạt
                </button>
              </form>
            </div>

            {/* Reset */}
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 font-medium">Đặt lại Game</p>
                  <p className="text-red-500/70 text-xs">Xóa toàn bộ dữ liệu không thể hoàn tác</p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/50 border border-red-700/60 text-red-400 hover:bg-red-900 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SettingToggle({
  icon,
  label,
  description,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-game-surface border border-game-border">
      <div className="flex items-center gap-3">
        <span className="text-purple-400">{icon}</span>
        <div>
          <p className="text-white font-medium">{label}</p>
          <p className="text-slate-500 text-xs">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 border ${
          value ? 'bg-purple-600 border-purple-500' : 'bg-slate-700 border-slate-600'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
            value ? 'left-[26px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
