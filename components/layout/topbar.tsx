'use client';

import { Menu, Bell, User } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export function Topbar() {
  const { toggleSidebar } = useUIStore();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-900 bg-neutral-950/70 px-6 backdrop-blur-md">
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Spacer or search bar */}
      <div className="hidden sm:flex items-center text-sm text-neutral-400">
        Study dashboard for {session?.user?.name || 'Academic Learner'}
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-neutral-850" />

        {/* User Info */}
        <div className="flex items-center gap-2.5">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-emerald-500/20 shadow-md shadow-emerald-500/5 object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
              <User className="h-4 w-4 text-neutral-400" />
            </div>
          )}
          <span className="hidden text-sm font-medium text-neutral-300 md:block">
            {session?.user?.name || 'Account'}
          </span>
        </div>
      </div>
    </header>
  );
}
