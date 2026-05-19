'use client';

import { useState } from 'react';
import { Quiz, QuizGradingResult } from '@/types/quiz';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Award, Compass, Loader2 } from 'lucide-react';
import { QuestionBlock } from './question-block';
import { ResultsSummary } from './results-summary';

interface QuizCardProps {
  quiz: Quiz;
  onSubmit: (answers: Record<string, string>) => Promise<QuizGradingResult | null>;
  isSubmitting: boolean;
}

export function QuizCard({ quiz, onSubmit, isSubmitting }: QuizCardProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [gradingResult, setGradingResult] = useState<QuizGradingResult | null>(null);

  const handleSelectAnswer = (qId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleSubmit = async () => {
    const result = await onSubmit(answers);
    if (result) {
      setGradingResult(result);
    }
  };

  // If quiz is graded, show results summary
  if (gradingResult) {
    return <ResultsSummary result={gradingResult} questions={quiz.questions} />;
  }

  const answeredCount = Object.values(answers).filter(val => val && val.trim() !== '').length;
  const isComplete = quiz.questions.every(q => answers[q.id] && answers[q.id].trim() !== '');

  return (
    <Card className="max-w-2xl mx-auto shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-850">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-400" />
          <CardTitle className="text-lg font-bold text-white">Active Quiz Session</CardTitle>
        </div>
        <span className="text-xs font-semibold text-neutral-400 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-850">
          Answered: {answeredCount} / {quiz.questions.length}
        </span>
      </CardHeader>

      <CardContent className="space-y-6 py-6">
        {quiz.questions.map((q, index) => (
          <QuestionBlock
            key={q.id}
            index={index + 1}
            question={q}
            selectedAnswer={answers[q.id]}
            onSelectAnswer={(ans) => handleSelectAnswer(q.id, ans)}
            disabled={isSubmitting}
          />
        ))}
      </CardContent>

      <CardFooter className="flex justify-end border-t border-neutral-850 pt-5">
        <Button
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className="w-full sm:w-auto px-8 font-semibold h-11"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Grading quiz responses...
            </>
          ) : (
            <>
              Submit Quiz
              <Compass className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
