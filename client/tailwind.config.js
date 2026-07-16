/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#6366F1', 50: '#EEEEFF', 100: '#E0E0FF', 200: '#C3C4FE', 300: '#A5A7FD', 400: '#8689FC', 500: '#6366F1', 600: '#4346E0', 700: '#3234C5', 800: '#2527A1', 900: '#1D1F7E' },
        secondary: { DEFAULT: '#8B5CF6', 50: '#F5F0FF', 100: '#EDE5FF', 200: '#D9CCFF', 300: '#C4B0FF', 400: '#AF94FB', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95' },
        accent:    { DEFAULT: '#06B6D4', 50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63' },
        success:   { DEFAULT: '#22C55E', 500: '#22C55E' },
        warning:   { DEFAULT: '#F59E0B', 500: '#F59E0B' },
        danger:    { DEFAULT: '#EF4444', 500: '#EF4444' },
        dark:      { DEFAULT: '#0F172A', 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 800: '#1E293B', 900: '#0F172A', 950: '#020617' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        'gradient-accent':  'linear-gradient(135deg, #06B6D4, #6366F1)',
        'gradient-hero':    'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-out',
        'slide-up':      'slideUp 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-slow':    'pulse 3s infinite',
        'spin-slow':     'spin 3s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'glow':          'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:      { from: { opacity: '0' },                  to: { opacity: '1' } },
        slideUp:     { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        glow:        { from: { boxShadow: '0 0 10px #6366F160' }, to: { boxShadow: '0 0 30px #6366F1A0' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(99,102,241,0.4)',
        'glow-accent':  '0 0 30px rgba(6,182,212,0.4)',
        'card':         '0 4px 24px rgba(0,0,0,0.12)',
        'card-hover':   '0 8px 40px rgba(0,0,0,0.2)',
        'glass':        '0 8px 32px rgba(0,0,0,0.37)',
      },
    },
  },
  plugins: [],
};
