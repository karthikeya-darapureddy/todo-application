'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, CheckCircle, BarChart2, Calendar, Shield, Smartphone,
  ArrowRight, Star, Sparkles, Play,
} from 'lucide-react';

const FEATURES = [
  { icon: CheckCircle, title: 'Smart Task Management',    desc: 'Create, organize and track tasks with priorities, categories, tags, and due dates.', color: 'text-primary-400', bg: 'bg-primary-500/10' },
  { icon: BarChart2,   title: 'Analytics Dashboard',      desc: 'Visualize your productivity with interactive charts, completion rates, and activity trends.', color: 'text-secondary-400', bg: 'bg-secondary-500/10' },
  { icon: Calendar,    title: 'Calendar View',            desc: 'See all your tasks on a beautiful interactive calendar with due date tracking.', color: 'text-accent-400', bg: 'bg-accent-500/10' },
  { icon: Shield,      title: 'Secure Authentication',    desc: 'JWT-powered auth with email verification, password reset, and secure sessions.', color: 'text-success', bg: 'bg-success/10' },
  { icon: Sparkles,    title: 'Archive & Restore',        desc: 'Archive completed tasks and restore them anytime. Keep your workspace clean.', color: 'text-warning', bg: 'bg-warning/10' },
  { icon: Smartphone,  title: 'Mobile Responsive',        desc: 'Fully responsive design that works perfectly on phones, tablets, and desktops.', color: 'text-danger', bg: 'bg-danger/10' },
];

const STATS = [
  { value: '20+', label: 'Task Types Supported' },
  { value: '100%', label: 'Mobile Responsive' },
  { value: '∞', label: 'Tasks You Can Create' },
  { value: 'Free', label: 'Forever' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900 bg-mesh overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-black text-white text-xl tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary text-sm px-5 py-2.5">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-20 pb-16 text-center">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-sm font-medium mb-8"
          >
            <Sparkles size={14} className="animate-pulse-slow" />
            Modern Task Management · Built with MERN Stack
            <Star size={12} className="fill-current" />
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Manage Tasks{' '}
            <span className="text-gradient">Beautifully</span>
            <br />& Effortlessly
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskFlow is your all-in-one productivity companion. Track tasks, visualize progress,
            stay organized — with a stunning interface that adapts to your workflow.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4 btn-glow">
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-4">
              <Play size={16} className="text-primary-400" /> Demo Login
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Demo: <code className="text-slate-400">demo@taskflow.io</code> / <code className="text-slate-400">Demo@1234</code>
          </p>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 md:px-12 py-10 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
              className="text-center"
            >
              <p className="text-3xl font-black text-gradient mb-1">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Everything you need to{' '}
              <span className="text-gradient">stay productive</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete suite of task management tools designed to supercharge your workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 card-hover border border-white/5 hover:border-primary-500/20"
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon size={22} className={f.color} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass rounded-3xl p-10 md:p-16 text-center border border-primary-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 pointer-events-none" />
          <Zap size={40} className="text-primary-400 mx-auto mb-6 animate-pulse-slow relative z-10" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
            Ready to boost your productivity?
          </h2>
          <p className="text-slate-400 mb-8 text-lg relative z-10">
            Join TaskFlow and start managing your tasks like a pro — completely free, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-4">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap size={12} className="text-white" />
          </div>
          <span className="font-bold text-white">TaskFlow</span>
        </div>
        <p className="text-slate-500 text-sm">Built with Next.js + Express · Data stored locally · No database required</p>
      </footer>
    </div>
  );
}
