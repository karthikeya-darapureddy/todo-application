'use client';
import { motion } from 'framer-motion';

export function Loader({ size = 'md', label = 'Loading…' }) {
  const s = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }[size] || 'w-10 h-10';
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${s} relative`}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ borderTopColor: '#6366F1' }}
        />
        <div className="absolute inset-2 rounded-full bg-gradient-primary opacity-20" />
      </div>
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center">
      <Loader size="lg" label="Loading TaskFlow…" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-5 w-14 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
