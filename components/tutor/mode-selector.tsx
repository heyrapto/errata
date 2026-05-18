'use client';

import { TutorMode } from '@/types/lesson';
import { cn } from '@/lib/utils';
import { Eye, GraduationCap, Flame, Shuffle } from 'lucide-react';

interface ModeSelectorProps {
  selectedMode: TutorMode;
  onChange: (mode: TutorMode) => void;
  disabled?: boolean;
}

export function ModeSelector({ selectedMode, onChange, disabled }: ModeSelectorProps) {
  const modes = [
    {
      id: 'beginner' as TutorMode,
      name: 'Beginner Mode',
      desc: 'Simple terms, clear analogies, assumes no prior experience.',
      icon: Eye,
      color: 'text-sky-400 border-sky-500/20 bg-sky-500/5',
      glow: 'shadow-sky-500/5 hover:border-sky-500/40',
      activeGlow: 'border-sky-500 shadow-sky-500/10 ring-1 ring-sky-500/30'
    },
    {
      id: 'deep' as TutorMode,
      name: 'Deep Study',
      desc: 'Comprehensive coverage, sub-topics, academic first principles.',
      icon: Flame,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      glow: 'shadow-amber-500/5 hover:border-amber-500/40',
      activeGlow: 'border-amber-500 shadow-amber-500/10 ring-1 ring-amber-500/30'
    },
    {
      id: 'exam' as TutorMode,
      name: 'Exam Prep',
      desc: 'Syllabus alignment, exam questions, detailed mark schemes.',
      icon: GraduationCap,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      glow: 'shadow-emerald-500/5 hover:border-emerald-500/40',
      activeGlow: 'border-emerald-500 shadow-emerald-500/10 ring-1 ring-emerald-500/30'
    },
    {
      id: 'revision' as TutorMode,
      name: 'Revision Mode',
      desc: 'High-yield summaries, key formulas, flashcard bullet points.',
      icon: Shuffle,
      color: 'text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5',
      glow: 'shadow-fuchsia-500/5 hover:border-fuchsia-500/40',
      activeGlow: 'border-fuchsia-500 shadow-fuchsia-500/10 ring-1 ring-fuchsia-500/30'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {modes.map((mode) => {
        const isSelected = selectedMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(mode.id)}
            className={cn(
              'flex items-start gap-4 rounded-xl border p-4 text-left shadow-lg transition-all duration-200 group active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
              mode.color,
              mode.glow,
              isSelected ? mode.activeGlow : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:bg-neutral-900/40'
            )}
          >
            <div className="rounded-lg p-2 bg-neutral-900 border border-neutral-800 shrink-0">
              <mode.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className={cn(
                'font-bold text-sm leading-tight transition-colors',
                isSelected ? 'text-white' : 'text-neutral-300 group-hover:text-neutral-200'
              )}>
                {mode.name}
              </h4>
              <p className="mt-1 text-xs text-neutral-400 group-hover:text-neutral-300 leading-normal">
                {mode.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
