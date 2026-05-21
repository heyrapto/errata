import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, BrainCircuit, Mic, CalendarClock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'Document tutoring',
    description: 'Upload PDFs and study from semantic chunks with contextual answers.',
    icon: BookOpen,
  },
  {
    title: 'Topic tutoring',
    description: 'Ask for explanations on any subject, even without uploaded materials.',
    icon: BrainCircuit,
  },
  {
    title: 'Voice lessons',
    description: 'Use speech input and spoken explanations for hands-free study sessions.',
    icon: Mic,
  },
  {
    title: 'Scheduling',
    description: 'Plan recurring lessons, reminders, and weekly study blocks in one place.',
    icon: CalendarClock,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.12),_transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              <Sparkles className="h-4 w-4" />
              EduAgent AI
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                A premium AI tutoring workspace for documents, topics, quizzes, and voice lessons.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
                Start with a polished study dashboard, then move into upload-based tutoring, topic explanations, progress tracking, and adaptive lesson flows.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110"
              >
                Open app
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/40 px-6 text-sm font-semibold text-neutral-100 transition-all hover:bg-neutral-900"
              >
                View dashboard
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="border-neutral-800 bg-neutral-900/50 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-100">{feature.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-neutral-400">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <aside className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 blur-2xl" />
            <Card className="border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Study command center</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Built for a focused study flow</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    'Upload PDFs and notes',
                    'Ask questions in real time',
                    'Generate quizzes and summaries',
                    'Track weak topics over time',
                  ].map((item) => (
                    <div key={item} className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-3 text-sm text-neutral-300">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                  <p className="text-sm font-medium text-neutral-200">Phase 2 focus</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-400">
                    Finish the dashboard shell, refine the navigation, and add motion and accessibility polish before moving deeper into AI services.
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
