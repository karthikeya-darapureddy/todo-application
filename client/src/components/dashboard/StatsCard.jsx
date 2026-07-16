'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient, trend, trendLabel, delay = 0 }) {
  const trendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const TrendIcon = trendIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass rounded-2xl p-5 card-hover border border-white/5 hover:border-white/10 relative overflow-hidden group"
    >
      {/* Glow */}
      <div className={cn('absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity', gradient)} />

      {/* Icon */}
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-4', gradient, 'bg-opacity-20')}>
        <Icon size={22} className="text-white" />
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <div>
          <motion.p
            className="text-3xl font-black text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          <p className="text-sm text-slate-400 mt-0.5">{title}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg',
            trend > 0 ? 'bg-success/10 text-success' : trend < 0 ? 'bg-danger/10 text-danger' : 'bg-white/5 text-slate-400'
          )}>
            <TrendIcon size={12} />
            <span>{trendLabel || `${Math.abs(trend)}%`}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
