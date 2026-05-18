'use client';

import { QuizQuestion, QuizGradingResult } from '@/types/quiz';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface ResultsSummaryProps {
  result: QuizGradingResult;
  questions: QuizQuestion[];
}

export function ResultsSummary({ result, questions }: ResultsSummaryProps) {
  const isPass = result.score >= 70;

  return (
    <Card className="max-w-2xl mx-auto shadow-2xl overflow-hidden border border-neutral-800">
      {/* Dynamic Header Block based on pass/fail */}
      <div 
        className={cn(
          'h-2 bg-gradient-to-r',
          isPass ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-red-500'
        )}
      />
      
      <CardHeader className="text-center py-8 bg-neutral-950/20 border-b border-neutral-850">
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
          STUDY METRICS SUBMISSION
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1">Quiz Completed!</h2>
        
        {/* Large Score Indicator */}
        <div className="mt-6 flex items-center justify-center">
          <div 
            className={cn(
              'flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 shadow-xl font-bold bg-neutral-950/60',
              isPass 
                ? 'border-emerald-500/20 text-emerald-400 shadow-emerald-950/20' 
                : 'border-amber-500/20 text-amber-400 shadow-amber-950/20'
            )}
          >
            <span className="text-3xl font-black">{result.score}%</span>
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">
              {isPass ? 'PASSED' : 'RETRY'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 py-6">
        <h3 className="text-sm font-bold text-neutral-300">Detailed Feedback Breakdown</h3>
        
        {questions.map((q, idx) => {
          const fb = result.feedback[q.id];
          const isCorrect = fb ? fb.isCorrect : false;
          
          return (
            <div 
              key={q.id} 
              className={cn(
                'rounded-xl border p-4.5 space-y-3.5 transition-all',
                isCorrect 
                  ? 'border-emerald-500/10 bg-emerald-500/5' 
                  : 'border-red-500/10 bg-red-500/5'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-xs font-semibold text-neutral-200 flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 select-none items-center justify-center rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-400">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{q.question}</span>
                </h4>
                
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                )}
              </div>

              {/* Answers details */}
              <div className="text-xs pl-7.5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-neutral-400">
                  <span className="font-bold shrink-0">Your Answer:</span>
                  <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                    {fb?.userAnswer || '(No answer provided)'}
                  </span>
                </div>

                {!isCorrect && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-neutral-400">
                    <span className="font-bold text-neutral-300 shrink-0">Correct Answer:</span>
                    <span className="text-emerald-400 font-semibold">{fb?.correctAnswer}</span>
                  </div>
                )}

                {/* Explanation text */}
                {fb?.explanation && (
                  <div className="rounded-lg bg-neutral-950/60 p-3 mt-3 border border-neutral-850">
                    <div className="flex items-start gap-2 text-neutral-400">
                      <AlertCircle className="h-4 w-4 text-emerald-400/70 shrink-0 mt-0.5" />
                      <p className="leading-relaxed text-[11px]">{fb.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Retry button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex items-center gap-2 border-neutral-800"
          >
            <RefreshCw className="h-4 w-4" />
            Take Another Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
