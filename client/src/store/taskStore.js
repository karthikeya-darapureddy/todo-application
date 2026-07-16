import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks:       [],
      stats:       null,
      isLoading:   false,
      currentTask: null,
      filters: {
        search:   '',
        status:   '',
        priority: '',
        category: '',
        sort:     'createdAt',
        order:    'desc',
        page:     1,
        limit:    20,
      },
      pagination: { total: 0, pages: 1, page: 1 },

      setFilters: (filters) => set(s => ({ filters: { ...s.filters, ...filters, page: 1 } })),
      resetFilters: () => set({ filters: { search: '', status: '', priority: '', category: '', sort: 'createdAt', order: 'desc', page: 1, limit: 20 } }),

      // ── Fetch Tasks ──────────────────────────────────────────────────
      fetchTasks: async (extraFilters = {}) => {
        set({ isLoading: true });
        try {
          const f = { ...get().filters, ...extraFilters };
          const params = new URLSearchParams();
          Object.entries(f).forEach(([k, v]) => { if (v !== '') params.set(k, v); });
          const res = await api.get(`/tasks?${params.toString()}`);
          const { data, total, page, pages } = res.data.data;
          set({ tasks: data, pagination: { total, page, pages }, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Failed to load tasks');
        }
      },

      // ── Fetch Stats ──────────────────────────────────────────────────
      fetchStats: async () => {
        try {
          const res = await api.get('/tasks/stats');
          set({ stats: res.data.data });
        } catch (err) {
          console.error('Stats fetch error:', err.message);
        }
      },

      // ── Create Task ──────────────────────────────────────────────────
      createTask: async (data) => {
        set({ isLoading: true });
        try {
          const formData = new FormData();
          Object.entries(data).forEach(([k, v]) => {
            if (k === 'attachments' && Array.isArray(v)) {
              v.forEach(f => formData.append('attachments', f));
            } else if (v !== undefined && v !== null) {
              formData.append(k, Array.isArray(v) ? v.join(',') : v);
            }
          });
          const res = await api.post('/tasks', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
          const task = res.data.data.task;
          set(s => ({ tasks: [task, ...s.tasks], isLoading: false }));
          toast.success('Task created! ✅');
          get().fetchStats();
          return { success: true, task };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Failed to create task');
          return { success: false };
        }
      },

      // ── Update Task ──────────────────────────────────────────────────
      updateTask: async (id, data) => {
        set({ isLoading: true });
        try {
          const res = await api.put(`/tasks/${id}`, data);
          const updated = res.data.data.task;
          set(s => ({ tasks: s.tasks.map(t => t.id === id ? updated : t), currentTask: updated, isLoading: false }));
          toast.success('Task updated!');
          get().fetchStats();
          return { success: true, task: updated };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Update failed');
          return { success: false };
        }
      },

      // ── Delete Task ──────────────────────────────────────────────────
      deleteTask: async (id) => {
        try {
          await api.delete(`/tasks/${id}`);
          set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
          toast.success('Task deleted.');
          get().fetchStats();
          return { success: true };
        } catch (err) {
          toast.error(err.response?.data?.message || 'Delete failed');
          return { success: false };
        }
      },

      // ── Change Status ────────────────────────────────────────────────
      updateStatus: async (id, status) => {
        try {
          const res = await api.patch(`/tasks/${id}/status`, { status });
          const updated = res.data.data.task;
          set(s => ({ tasks: s.tasks.map(t => t.id === id ? updated : t) }));
          get().fetchStats();
          return { success: true };
        } catch (err) {
          toast.error(err.response?.data?.message || 'Status update failed');
          return { success: false };
        }
      },

      // ── Archive Task ─────────────────────────────────────────────────
      archiveTask: async (id) => {
        try {
          const res = await api.patch(`/tasks/${id}/archive`);
          const updated = res.data.data.task;
          set(s => ({ tasks: s.tasks.map(t => t.id === id ? updated : t) }));
          toast.success('Task archived.');
          get().fetchStats();
          return { success: true };
        } catch (err) {
          toast.error(err.response?.data?.message || 'Archive failed');
          return { success: false };
        }
      },

      // ── Restore Task ─────────────────────────────────────────────────
      restoreTask: async (id) => {
        try {
          const res = await api.patch(`/tasks/${id}/restore`);
          const updated = res.data.data.task;
          set(s => ({ tasks: s.tasks.map(t => t.id === id ? updated : t) }));
          toast.success('Task restored!');
          get().fetchStats();
          return { success: true };
        } catch (err) {
          toast.error(err.response?.data?.message || 'Restore failed');
          return { success: false };
        }
      },

      // ── Duplicate Task ───────────────────────────────────────────────
      duplicateTask: async (id) => {
        try {
          const res = await api.post(`/tasks/${id}/duplicate`);
          const copy = res.data.data.task;
          set(s => ({ tasks: [copy, ...s.tasks] }));
          toast.success('Task duplicated!');
          get().fetchStats();
          return { success: true };
        } catch (err) {
          toast.error(err.response?.data?.message || 'Duplicate failed');
          return { success: false };
        }
      },

      setCurrentTask: (task) => set({ currentTask: task }),
      clearCurrentTask: ()   => set({ currentTask: null }),
    }),
    {
      name: 'taskflow_tasks',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);

export default useTaskStore;
