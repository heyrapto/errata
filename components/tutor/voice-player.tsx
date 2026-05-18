'use client';

import { useSessionStore } from '@/store/session-store';
import { useVoice } from '@/hooks/use-voice';
import { Button } from '../ui/button';
import { Volume2, VolumeX, Loader } from 'lucide-react';

export function VoicePlayer() {
  const { isSpeaking } = useSessionStore();
  const { stopSpeaking } = useVoice();

  if (!isSpeaking) return null;

  return (
    <div className="fixed bottom-20 right-6 z-40 flex items-center gap-3.5 rounded-full border border-emerald-500/30 bg-neutral-950 px-4.5 py-2.5 shadow-2xl animate-bounce">
      <div className="flex items-center gap-2">
        <Loader className="h-4 w-4 animate-spin text-emerald-400" />
        <span className="text-xs font-semibold text-neutral-300">Tutor speaking...</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={stopSpeaking}
        className="h-7 w-7 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
        title="Stop speaking"
      >
        <VolumeX className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
