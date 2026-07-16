'use client';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Moon, Sun, Monitor, Shield, Trash2, Check } from 'lucide-react';
import useThemeStore from '../../../store/themeStore';
import useAuthStore from '../../../store/authStore';
import { cn } from '../../../utils/helpers';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { theme, setTheme, notifications, toggleNotifications } = useThemeStore();
  const { user } = useAuthStore();

  const themes = [
    { id: 'dark',  label: 'Dark Mode',  icon: Moon },
    { id: 'light', label: 'Light Mode', icon: Sun },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <SettingsIcon className="text-primary-400" /> Settings
        </h1>
        <p className="text-sm text-slate-400">Manage your app preferences and workspace settings.</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/5 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Monitor size={18} className="text-primary-400" /> Appearance
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-300 mb-2">Theme</p>
            <div className="grid grid-cols-2 gap-4">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all',
                    theme === t.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-white/5 bg-white/5 hover:border-white/20'
                  )}
                >
                  <t.icon size={24} className={theme === t.id ? 'text-primary-400' : 'text-slate-400'} />
                  <span className={cn('text-sm font-medium', theme === t.id ? 'text-white' : 'text-slate-400')}>
                    {t.label}
                  </span>
                  {theme === t.id && (
                    <div className="absolute top-3 right-3 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl border border-white/5 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bell size={18} className="text-accent-400" /> Notifications
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
          <div>
            <p className="text-sm font-medium text-white mb-0.5">Push Notifications</p>
            <p className="text-xs text-slate-400">Receive alerts for due dates and reminders.</p>
          </div>
          <button
            onClick={toggleNotifications}
            className={cn(
              'relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50',
              notifications ? 'bg-primary-500' : 'bg-slate-600'
            )}
          >
            <span
              className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300',
                notifications ? 'left-7' : 'left-1'
              )}
            />
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl border border-danger/20 p-6 bg-danger/5">
        <h3 className="text-lg font-bold text-danger mb-4 flex items-center gap-2">
          <Shield size={18} /> Danger Zone
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-danger/10 rounded-xl border border-danger/20">
          <div>
            <p className="text-sm font-medium text-white mb-0.5">Delete Account</p>
            <p className="text-xs text-danger/80">Permanently delete your account and all associated data.</p>
          </div>
          <button
            onClick={() => toast.error('This action is disabled in the demo.')}
            className="btn-danger flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Trash2 size={16} /> Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
