/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['"Cinzel"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Base dark
        'game-bg': '#07071a',
        'game-surface': '#0f0f2e',
        'game-card': '#12122a',
        'game-border': '#1e1e4a',
        // Rarity colors
        'rarity-common': '#9ca3af',
        'rarity-uncommon': '#4ade80',
        'rarity-rare': '#60a5fa',
        'rarity-epic': '#c084fc',
        'rarity-legendary': '#fbbf24',
        'rarity-mythic': '#f87171',
        'rarity-secret': '#e0e7ff',
        // Accent
        'accent-purple': '#7c3aed',
        'accent-gold': '#d97706',
        'accent-neon': '#a78bfa',
      },
      boxShadow: {
        'glow-common': '0 0 15px rgba(156,163,175,0.4)',
        'glow-uncommon': '0 0 20px rgba(74,222,128,0.5)',
        'glow-rare': '0 0 25px rgba(96,165,250,0.6)',
        'glow-epic': '0 0 30px rgba(192,132,252,0.7)',
        'glow-legendary': '0 0 40px rgba(251,191,36,0.8)',
        'glow-mythic': '0 0 50px rgba(248,113,113,0.9)',
        'glow-secret': '0 0 60px rgba(255,255,255,1), 0 0 100px rgba(167,139,250,0.8)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.6)',
        'glow-gold': '0 0 20px rgba(217,119,6,0.6)',
        'neon': '0 0 10px currentColor, 0 0 20px currentColor',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient-x': 'gradientX 4s ease infinite',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)',
        'flash': 'flash 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        gradientX: {
          '0%, 100%': { backgroundSize: '200% 200%', backgroundPosition: 'left center' },
          '50%': { backgroundSize: '200% 200%', backgroundPosition: 'right center' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flash: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0.4' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'game-grid': `
          linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)
        `,
        'radial-game': 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      }
    },
  },
  plugins: [],
  safelist: [
    'shadow-glow-common',
    'shadow-glow-uncommon',
    'shadow-glow-rare',
    'shadow-glow-epic',
    'shadow-glow-legendary',
    'shadow-glow-mythic',
    'shadow-glow-secret',
    'text-rarity-common',
    'text-rarity-uncommon',
    'text-rarity-rare',
    'text-rarity-epic',
    'text-rarity-legendary',
    'text-rarity-mythic',
    'text-rarity-secret',
    'border-rarity-common',
    'border-rarity-uncommon',
    'border-rarity-rare',
    'border-rarity-epic',
    'border-rarity-legendary',
    'border-rarity-mythic',
    'border-rarity-secret',
  ]
}
