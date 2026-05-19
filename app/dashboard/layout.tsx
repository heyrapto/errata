'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-neutral-400 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
        <span className="text-sm font-medium">Authorizing study session...</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // redirecting
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950">
      {/* Navigation sidebar */}
      <Sidebar />

      {/* Main dashboard viewport */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topheader details */}
        <Topbar />

        {/* Content body layout */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>

        {/* Mobile footer navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
