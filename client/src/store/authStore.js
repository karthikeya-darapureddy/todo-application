import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user:      null,
      token:     null,
      isLoading: false,
      isLoggedIn: false,

      // ── Login ────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          const { token, user } = res.data.data;
          set({ token, user, isLoggedIn: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          const msg = err.response?.data?.message || 'Login failed';
          toast.error(msg);
          return { success: false, message: msg };
        }
      },

      // ── Register ─────────────────────────────────────────────────────
      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', { name, email, password });
          const { token, user } = res.data.data;
          set({ token, user, isLoggedIn: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          toast.success('Account created successfully! 🎉');
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          const msg = err.response?.data?.message || 'Registration failed';
          toast.error(msg);
          return { success: false, message: msg };
        }
      },

      // ── Logout ───────────────────────────────────────────────────────
      logout: async () => {
        try { await api.post('/auth/logout'); } catch {}
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null, isLoggedIn: false });
        toast.success('Logged out successfully.');
      },

      // ── Refresh Profile ───────────────────────────────────────────────
      fetchProfile: async () => {
        try {
          const { token } = get();
          if (!token) return;
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get('/auth/profile');
          set({ user: res.data.data.user, isLoggedIn: true });
        } catch {
          set({ user: null, token: null, isLoggedIn: false });
        }
      },

      // ── Update Profile ────────────────────────────────────────────────
      updateProfile: async (formData) => {
        set({ isLoading: true });
        try {
          const res = await api.put('/auth/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          set({ user: res.data.data.user, isLoading: false });
          toast.success('Profile updated!');
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Update failed');
          return { success: false };
        }
      },

      // ── Change Password ───────────────────────────────────────────────
      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true });
        try {
          await api.put('/auth/change-password', { currentPassword, newPassword });
          set({ isLoading: false });
          toast.success('Password changed successfully!');
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Password change failed');
          return { success: false };
        }
      },

      // ── Forgot Password ───────────────────────────────────────────────
      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/forgot-password', { email });
          set({ isLoading: false });
          toast.success('Reset link sent! Check the server console.');
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Request failed');
          return { success: false };
        }
      },

      // ── Reset Password ────────────────────────────────────────────────
      resetPassword: async (token, password) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/reset-password', { token, password });
          set({ isLoading: false });
          toast.success('Password reset! You can now log in.');
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Reset failed');
          return { success: false };
        }
      },

      // ── Verify Email ──────────────────────────────────────────────────
      verifyEmail: async (token) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/verify-email', { token });
          const { token: jwt, user } = res.data.data;
          set({ token: jwt, user, isLoggedIn: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
          toast.success('Email verified! 🎉');
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Verification failed');
          return { success: false };
        }
      },

      // ── Init (restore token) ──────────────────────────────────────────
      init: () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }),
    {
      name: 'taskflow_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isLoggedIn: state.isLoggedIn }),
    }
  )
);

export default useAuthStore;
