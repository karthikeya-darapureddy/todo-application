'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Menu, X, LogOut, User, Settings, ChevronDown, Zap } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import ThemeToggle from './ThemeToggle';
import { avatarUrl } from '../../utils/helpers';

export default function Navbar() {
  const router             = useRouter();
  const { user, logout }   = useAuthStore();
  const { toggleSidebar }  = useThemeStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">TaskFlow</span>
        </Link>
      </div>

      {/* Center: Search bar (desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary-500/50 focus:bg-white/8 transition-all"
            onFocus={() => router.push('/tasks')}
            readOnly
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-1 pr-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            <img
              src={avatarUrl(user)}
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary-500/30"
            />
            <span className="hidden md:block text-sm font-medium text-white">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0,  scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 glass rounded-xl border border-white/10 shadow-glass z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link href="/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors">
                      <User size={15} /> Profile
                    </Link>
                    <Link href="/settings" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors">
                      <Settings size={15} /> Settings
                    </Link>
                    <hr className="border-white/10 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-danger/10 text-sm text-danger transition-colors">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
