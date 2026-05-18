'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressChart } from '@/components/progress/progress-chart';
import { WeakTopicsList } from '@/components/progress/weak-topics-list';
import { useProgress } from '@/hooks/use-progress';
import { 
  Sparkles, 
  BookOpen, 
  Calendar, 
  ArrowUpRight, 
  MessageSquare, 
  FileText,
  Video,
  Award
} from 'lucide-react';
import Link from 'next/link';

export const unstable_instant = { prefetch: 'static' };

export default function DashboardOverviewPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  const { records, weakAreas, loading } = useProgress(userId);

  const quickActions = [
    {
      title: 'Topic Tutor',
      desc: 'Learn general educational topics instantly without uploading materials.',
      href: '/tutor',
      icon: MessageSquare,
      color: 'text-sky-400 bg-sky-500/5 border-sky-500/20'
    },
    {
      title: 'Study Library',
      desc: 'Upload textbook PDFs and let AI answer questions and build lessons.',
      href: '/documents',
      icon: FileText,
      color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20'
    },
    {
      title: 'Study Planner',
      desc: 'Set up your weekly timetable to log study reminders and schedules.',
      href: '/schedule',
      icon: Calendar,
      color: 'text-amber-400 bg-amber-500/5 border-amber-500/20'
    },
    {
      title: 'Virtual Classroom',
      desc: 'Launch Zoom sessions or study corridors directly with peers.',
      href: '/classroom',
      icon: Video,
      color: 'text-fuchsia-400 bg-fuchsia-500/5 border-fuchsia-500/20'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Premium Hero Welcome Banner */}
      <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 md:p-8 overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-[180px] w-[180px] rounded-full bg-emerald-500/5 blur-[50px]" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <Sparkles className="h-4 w-4" />
            <span>EduAgent Personalized Study Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back, {session?.user?.name || 'Academic Learner'}!
          </h1>
          <p className="text-sm text-neutral-450 leading-relaxed max-w-xl">
            Ready to tackle your academic milestones? Review your study timeline metrics, log schedule planners, or initialize AI tutoring streams below.
          </p>
        </div>
      </div>

      {/* Quick Action Activity Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Quick Study Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((act) => (
            <Card 
              key={act.title}
              className="hover:border-emerald-500/30 transition-all duration-200 group active:scale-[0.98]"
            >
              <Link href={act.href} className="flex flex-col h-full justify-between p-5">
                <div className="space-y-4">
                  <div className={`inline-flex rounded-lg p-2.5 border ${act.color}`}>
                    <act.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-200 group-hover:text-white transition-colors">
                      {act.title}
                    </h4>
                    <p className="mt-1 text-xs text-neutral-450 leading-normal">
                      {act.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-xs font-bold text-emerald-400 group-hover:underline gap-0.5">
                  Launch
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Analytics & Performance grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sparkline timeline */}
        <div className="lg:col-span-2 space-y-4">
          <ProgressChart records={records} />
        </div>

        {/* Weak spots list */}
        <div className="space-y-4">
          <WeakTopicsList weakAreas={weakAreas} />
        </div>
      </div>
    </div>
  );
}
