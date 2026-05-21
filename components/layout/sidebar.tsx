'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Award, 
  Calendar, 
  TrendingUp, 
  Settings, 
  LogOut,
  X,
  GraduationCap
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Topic Tutor', href: '/tutor', icon: MessageSquare },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Revision Notes', href: '/notes', icon: BookOpen },
    { name: 'Quizzes', href: '/quizzes', icon: Award },
    { name: 'Study Schedule', href: '/schedule', icon: Calendar },
    { name: 'Progress Tracker', href: '/progress', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Sidebar */}
      <aside
        id="primary-sidebar"
        role="navigation"
        aria-label="Primary navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-800 bg-neutral-950/80 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-900">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <GraduationCap className="h-7 w-7 text-emerald-400" />
            <span className="text-lg font-bold tracking-tight text-white">
              EduAgent <span className="text-emerald-400">AI</span>
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-1 text-neutral-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group active:scale-[0.98]',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-400 border border-emerald-500/20'
                    : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-100 border border-transparent'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn(
                  'h-5 w-5 transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-emerald-400' : 'text-neutral-400 group-hover:text-neutral-200'
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Log out */}
        <div className="p-4 border-t border-neutral-900">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 border border-transparent transition-all hover:border-red-500/20 active:scale-[0.98]"
          >
            <LogOut className="h-5 w-5 text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
