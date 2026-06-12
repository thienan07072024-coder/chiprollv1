import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, Sparkles } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'rare' | 'legendary' | 'mythic';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onRemove]);

  const config: Record<ToastType, any> = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      border: 'border-green-500/50',
      bg: 'bg-green-900/80',
      text: 'text-green-400',
    },
    error: {
      icon: <AlertTriangle className="w-5 h-5" />,
      border: 'border-red-500/50',
      bg: 'bg-red-900/80',
      text: 'text-red-400',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      border: 'border-purple-500/50',
      bg: 'bg-purple-900/80',
      text: 'text-purple-400',
    },
    rare: {
      icon: <Sparkles className="w-5 h-5" />,
      border: 'border-blue-500/50',
      bg: 'bg-blue-900/80',
      text: 'text-blue-400',
    },
    legendary: {
      icon: <Sparkles className="w-5 h-5" />,
      border: 'border-yellow-500/50',
      bg: 'bg-yellow-900/80',
      text: 'text-yellow-400',
    },
    mythic: {
      icon: <Sparkles className="w-5 h-5" />,
      border: 'border-red-500/50',
      bg: 'bg-red-900/80',
      text: 'text-red-400',
    },
  };

  const c = config[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`
        flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md min-w-[280px] max-w-[360px]
        ${c.bg} ${c.border} shadow-xl
      `}
    >
      <span className={c.text}>{c.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${c.text}`}>{toast.title}</p>
        {toast.message && (
          <p className="text-slate-300 text-xs mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-500 hover:text-white transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev.slice(-4), { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 items-end">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
