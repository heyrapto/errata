'use client';

import { ChatMessage } from '@/types/api';
import { cn } from '@/lib/utils';
import { Bot, User, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';

interface MessageBubbleProps {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
}

export function MessageBubble({ message, onSpeak }: MessageBubbleProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex w-full items-start gap-3.5',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      {/* Icon Indicator */}
      {isAssistant && (
        <div className="flex h-8.5 w-8.5 shrink-0 select-none items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-inner">
          <Bot className="h-5 w-5" />
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={cn(
          'relative max-w-[80%] rounded-2xl px-4.5 py-3 text-sm shadow-md transition-all duration-200',
          isAssistant
            ? 'rounded-tl-none border border-neutral-800 bg-neutral-950/60 text-neutral-200'
            : 'rounded-tr-none bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-emerald-950/20'
        )}
      >
        {/* Message Text content */}
        <div className="whitespace-pre-line leading-relaxed">{message.content}</div>

        {/* Text-To-Speech button for assistant responses */}
        {isAssistant && onSpeak && (
          <div className="mt-2.5 flex items-center justify-end border-t border-neutral-900/60 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onSpeak(message.content)}
              className="h-6 w-6 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-emerald-400"
              title="Speak message aloud"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="flex h-8.5 w-8.5 shrink-0 select-none items-center justify-center rounded-lg border border-neutral-850 bg-neutral-900 text-neutral-400">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
