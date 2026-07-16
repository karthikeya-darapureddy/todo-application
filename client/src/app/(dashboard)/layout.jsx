'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import { PageLoader } from '../../components/common/Loader';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading, fetchProfile } = useAuthStore();
  const { applyTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    applyTheme();
    setMounted(true);
    fetchProfile(); // refresh token/profile on load
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [mounted, authLoading, isLoggedIn, router]);

  if (!mounted || authLoading || !isLoggedIn) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-mesh flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
