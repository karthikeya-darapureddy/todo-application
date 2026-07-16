'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Zap, Mail, Lock, User } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
  const router     = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const result = await registerUser(data.name, data.email, data.password);
    if (result.success) router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-black text-white text-2xl">TaskFlow</span>
          </Link>
          <p className="text-slate-400 mt-2 text-sm">Create your free account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl border border-white/10 p-8 shadow-glass">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className="input-field pl-10"
                />
              </div>
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  autoComplete="new-password"
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

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
