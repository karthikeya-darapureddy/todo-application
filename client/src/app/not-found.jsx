'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 bg-mesh flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass rounded-3xl p-10 border border-white/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 pointer-events-none" />
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary mx-auto mb-8 relative z-10">
          <Zap size={32} className="text-white" />
        </div>
        
        <h1 className="text-6xl font-black text-white mb-4 relative z-10">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Page Not Found</h2>
        
        <p className="text-slate-400 mb-8 relative z-10">
          Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
        </p>
        
        <Link href="/" className="btn-primary inline-flex items-center gap-2 relative z-10">
          <ArrowLeft size={18} /> Return Home
        </Link>
      </motion.div>
    </div>
  );
}
