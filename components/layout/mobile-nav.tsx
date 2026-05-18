'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, FileText, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tutor', href: '/tutor', icon: MessageSquare },
    { name: 'Files', href: '/documents', icon: FileText },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 border-t border-neutral-900 bg-neutral-950/90 backdrop-blur-lg px-4 lg:hidden">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
              isActive ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-100'
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
