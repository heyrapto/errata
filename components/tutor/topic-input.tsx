'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ModeSelector } from './mode-selector';
import { TutorMode } from '@/types/lesson';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface TopicInputProps {
  onSubmit: (topic: string, mode: TutorMode) => void;
  isLoading: boolean;
}

export function TopicInput({ onSubmit, isLoading }: TopicInputProps) {
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<TutorMode>('beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSubmit(topic.trim(), mode);
  };

  const suggestions = [
    'Explain calculus limits from first principles',
    'How do logic gates work in computer science?',
    'Analyse photosythesis reactions step-by-step',
    'Explain wave-particle duality with analogies',
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 md:p-8 shadow-2xl backdrop-blur-md max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-emerald-400" />
        <h2 className="text-xl font-bold tracking-tight text-white">Start Topic Learning Mode</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input Box */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">What do you want to learn today?</label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder='e.g., "Explain calculus limits", "Newtonian physics", "React State Lifecycle"...'
            className="h-12 bg-neutral-950 border-neutral-800 text-base"
            disabled={isLoading}
          />
        </div>

        {/* Mode Selector */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-neutral-300">Select Learning Mode Depth</label>
          <ModeSelector selectedMode={mode} onChange={setMode} disabled={isLoading} />
        </div>

        {/* Action Button */}
        <Button 
          type="submit" 
          disabled={!topic.trim() || isLoading}
          className="w-full h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              EduAgent is preparing your curriculum...
            </>
          ) : (
            <>
              Initialize AI Tutor
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Suggestion tags */}
      <div className="mt-8 border-t border-neutral-850 pt-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Popular study topics</span>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {suggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => !isLoading && setTopic(sug)}
              className="rounded-full border border-neutral-800 bg-neutral-950/30 px-3.5 py-1.5 text-xs text-neutral-400 transition-all hover:border-emerald-500/30 hover:text-emerald-400 active:scale-95"
              disabled={isLoading}
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
