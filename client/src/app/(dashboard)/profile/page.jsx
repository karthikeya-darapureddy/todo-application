'use client';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Camera, Lock, Loader2, Mail } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { avatarUrl, cn } from '../../../utils/helpers';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  bio:  z.string().max(200, 'Bio too long').optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function ProfilePage() {
  const { user, updateProfile, changePassword, isLoading } = useAuthStore();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', bio: user?.bio || '' },
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.bio)  formData.append('bio', data.bio);
    if (avatarFile) formData.append('avatar', avatarFile);

    const res = await updateProfile(formData);
    if (res.success) {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const onPasswordSubmit = async (data) => {
    const res = await changePassword(data.currentPassword, data.newPassword);
    if (res.success) resetPasswordForm();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <User className="text-primary-400" /> My Profile
        </h1>
        <p className="text-sm text-slate-400">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Avatar & Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1 space-y-6">
          <div className="glass rounded-2xl border border-white/5 p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img
                src={avatarPreview || avatarUrl(user)}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-white/5 group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                <Camera size={24} className="text-white" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-sm text-slate-400 flex items-center justify-center gap-1.5 mb-4">
              <Mail size={13} /> {user.email}
            </p>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-medium text-slate-300">
              <div className={cn("w-2 h-2 rounded-full", user.isVerified ? "bg-success" : "bg-warning")} />
              {user.isVerified ? 'Verified Account' : 'Unverified Account'}
            </div>
          </div>
        </motion.div>

        {/* Right Col: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Profile Details</h3>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input {...registerProfile('name')} className="input-field" placeholder="John Doe" />
                {profileErrors.name && <p className="text-danger text-xs mt-1">{profileErrors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
                <textarea {...registerProfile('bio')} rows={3} className="input-field resize-none" placeholder="Tell us a bit about yourself..." />
                {profileErrors.bio && <p className="text-danger text-xs mt-1">{profileErrors.bio.message}</p>}
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={isLoading} className="btn-primary px-6 py-2 flex items-center gap-2">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>

          {/* Password Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lock size={18} className="text-primary-400" /> Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Password</label>
                <input type="password" {...registerPassword('currentPassword')} className="input-field" placeholder="••••••••" />
                {passwordErrors.currentPassword && <p className="text-danger text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                  <input type="password" {...registerPassword('newPassword')} className="input-field" placeholder="••••••••" />
                  {passwordErrors.newPassword && <p className="text-danger text-xs mt-1">{passwordErrors.newPassword.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                  <input type="password" {...registerPassword('confirmPassword')} className="input-field" placeholder="••••••••" />
                  {passwordErrors.confirmPassword && <p className="text-danger text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={isLoading} className="btn-secondary px-6 py-2 flex items-center gap-2">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
