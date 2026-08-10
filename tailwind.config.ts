import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        navy: 'rgb(var(--rgb-navy) / <alpha-value>)',
        'metro-blue': 'rgb(var(--rgb-metro-blue) / <alpha-value>)',
        'metro-light': 'rgb(var(--rgb-metro-light) / <alpha-value>)',
        accent: 'rgb(var(--rgb-accent) / <alpha-value>)',
        surface: 'rgb(var(--rgb-surface) / <alpha-value>)',
        card: 'rgb(var(--rgb-card) / <alpha-value>)',
        ink: 'rgb(var(--rgb-ink) / <alpha-value>)',
        muted: 'rgb(var(--rgb-muted) / <alpha-value>)',
        appBorder: 'var(--color-border)',
        operational: 'rgb(var(--rgb-operational) / <alpha-value>)',
        delayed: 'rgb(var(--rgb-delayed) / <alpha-value>)',
        disruption: 'rgb(var(--rgb-disruption) / <alpha-value>)',
        upcoming: 'rgb(var(--rgb-upcoming) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.08)',
        elevated: '0 4px 12px rgba(15, 23, 42, 0.12)',
      },
      transitionDuration: { micro: '150', expand: '250' },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'draw-line': {
          from: { strokeDashoffset: 'var(--line-len, 300)' },
          to: { strokeDashoffset: '0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms ease',
        'slide-up': 'slide-up 250ms ease',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
