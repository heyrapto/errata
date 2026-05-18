'use client';

import { QuizQuestion } from '@/types/quiz';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface QuestionBlockProps {
  index: number;
  question: QuizQuestion;
  selectedAnswer: string;
  onSelectAnswer: (ans: string) => void;
  disabled?: boolean;
}

export function QuestionBlock({ index, question, selectedAnswer, onSelectAnswer, disabled }: QuestionBlockProps) {
  const isMcq = question.type === 'mcq';

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/20 p-5 space-y-4">
      {/* Index & Question Title */}
      <h4 className="text-sm font-semibold text-neutral-100 flex items-start gap-2.5">
        <span className="flex h-5 w-5 shrink-0 select-none items-center justify-center rounded-md bg-emerald-500/10 text-xs font-bold text-emerald-400 border border-emerald-500/20">
          {index}
        </span>
        <span className="leading-relaxed">{question.question}</span>
      </h4>

      {/* MCQ options selection */}
      {isMcq && question.options ? (
        <div className="grid grid-cols-1 gap-2.5 pl-7.5">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onSelectAnswer(option)}
                className={cn(
                  'w-full text-left px-4 py-2.5 rounded-lg border text-xs font-medium transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none',
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-neutral-850 bg-neutral-950/40 text-neutral-450 hover:bg-neutral-900/50 hover:text-neutral-200'
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        // Short Answer text field
        <div className="pl-7.5">
          <Input
            value={selectedAnswer || ''}
            onChange={(e) => onSelectAnswer(e.target.value)}
            disabled={disabled}
            placeholder="Type your explanation or short answer..."
            className="bg-neutral-950 border-neutral-850 h-10 text-xs placeholder:text-neutral-600"
          />
        </div>
      )}
    </div>
  );
}
