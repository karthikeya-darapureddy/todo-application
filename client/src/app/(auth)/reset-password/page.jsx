'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Zap, Lock, AlertCircle } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm:  z.string().min(6, 'Please confirm your password'),
}).refine(data => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isLoading } = useAuthStore();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    if (!token) return;
    const result = await resetPassword(token, data.password);
    if (result.success) router.push('/login');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-dark-900 bg-mesh flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mb-4 border border-danger/30">
          <AlertCircle size={24} className="text-danger" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Invalid Token</h2>
        <p className="text-slate-400 mb-6">No reset token found in the URL.</p>
        <Link href="/login" className="btn-secondary">Return to login</Link>
      </div>
    );
  }

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
          <p className="text-slate-400 mt-2 text-sm">Create a new password</p>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-8 shadow-glass">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('confirm')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
              </div>
              {errors.confirm && <p className="text-danger text-xs mt-1">{errors.confirm.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isLoading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
