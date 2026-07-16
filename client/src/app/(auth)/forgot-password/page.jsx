'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Loader2, Zap, ArrowLeft } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuthStore();
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const result = await forgotPassword(data.email);
    if (result.success) setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-black text-white text-2xl">TaskFlow</span>
          </Link>
          <p className="text-slate-400 mt-2 text-sm">Recover your account</p>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-8 shadow-glass">
          {isSent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-success/30">
                <Mail size={24} className="text-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
              <p className="text-slate-400 text-sm mb-6">
                We've sent a password reset link to your email address. (Or check the server console if running locally!)
              </p>
              <Link href="/login" className="btn-secondary w-full flex items-center justify-center">
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <p className="text-sm text-slate-400 text-center mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="input-field pl-10"
                  />
                </div>
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                {isLoading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {!isSent && (
            <div className="mt-5 text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary-300 transition-colors">
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
