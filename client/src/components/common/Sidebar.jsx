'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, Calendar, User,
  Settings, Zap, ChevronLeft, ChevronRight, Archive, Star,
} from 'lucide-react';
import useThemeStore from '../../store/themeStore';
import useTaskStore  from '../../store/taskStore';
import { cn } from '../../utils/helpers';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/tasks',     icon: CheckSquare,     label: 'My Tasks'   },
  { href: '/calendar',  icon: Calendar,        label: 'Calendar'   },
  { href: '/profile',   icon: User,            label: 'Profile'    },
  { href: '/settings',  icon: Settings,        label: 'Settings'   },
];

export default function Sidebar() {
  const pathname   = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useThemeStore();
  const { stats }  = useTaskStore();

  const collapsed  = sidebarCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          'fixed left-0 top-0 h-full glass border-r border-white/5 z-40 flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
        animate={{ x: 0 }}
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 px-4 border-b border-white/5', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-black text-white text-lg tracking-tight">TaskFlow</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard">
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                <Zap size={16} className="text-white" />
              </div>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className={cn('p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors', collapsed && 'hidden')}
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Collapsed expand button */}
        {collapsed && (
          <button onClick={toggleSidebar} className="mt-2 mx-auto p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <ChevronRight size={16} />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 mt-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'sidebar-link group relative',
                  active && 'active',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className={cn('shrink-0', active ? 'text-primary-400' : 'text-slate-400 group-hover:text-primary-400')} />
                {!collapsed && <span>{label}</span>}
                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-dark-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Stats */}
        {!collapsed && stats && (
          <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
            <p className="text-xs text-slate-400 mb-2 font-medium">Progress</p>
            <div className="flex justify-between text-xs text-white mb-1.5">
              <span>{stats.stats?.completed || 0} done</span>
              <span>{stats.stats?.completionRate || 0}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.stats?.completionRate || 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{stats.stats?.total || 0} total tasks</p>
          </div>
        )}
      </motion.aside>

      {/* Page offset spacer */}
      <div className={cn('shrink-0 transition-all duration-300', collapsed ? 'w-16' : 'w-64')} />
    </>
  );
}
