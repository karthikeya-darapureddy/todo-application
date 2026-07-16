'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import useThemeStore from '../../store/themeStore';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${isDark ? 'bg-primary-500/30 border border-primary-500/50' : 'bg-slate-200 border border-slate-300'} ${className}`}
      aria-label="Toggle theme"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-lg ${isDark ? 'bg-primary-500' : 'bg-white'}`}
        animate={{ x: isDark ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Moon size={11} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Sun size={11} className="text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
