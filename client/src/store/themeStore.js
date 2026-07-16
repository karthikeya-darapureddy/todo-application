import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'dark' | 'light'
      notifications: true,
      sidebarCollapsed: false,

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        // Apply to document
        document.documentElement.classList.toggle('dark',  newTheme === 'dark');
        document.documentElement.classList.toggle('light', newTheme === 'light');
      },

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark',  theme === 'dark');
        document.documentElement.classList.toggle('light', theme === 'light');
      },

      toggleNotifications: () => set(s => ({ notifications: !s.notifications })),

      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebar:   (v)  => set({ sidebarCollapsed: v }),

      applyTheme: () => {
        const { theme } = get();
        document.documentElement.classList.toggle('dark',  theme === 'dark');
        document.documentElement.classList.toggle('light', theme === 'light');
      },
    }),
    { name: 'taskflow_theme' }
  )
);

export default useThemeStore;
