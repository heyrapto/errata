import { useState } from 'react';
import { Quiz, QuizGradingResult } from '@/types/quiz';

export function useQuiz() {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [gradingResult, setGradingResult] = useState<QuizGradingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setUserAnswers({});
    setGradingResult(null);
    setError(null);
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitAnswers = async (answers?: Record<string, string>): Promise<QuizGradingResult | null> => {
    if (!activeQuiz) return null;
    
    setSubmitting(true);
    setError(null);
    
    const finalAnswers = answers || userAnswers;
    
    try {
      const response = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          answers: finalAnswers,
        }),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit quiz answers.');
      }

      setGradingResult(result.result);
      
      // Update local quiz object to reflect score
      setActiveQuiz(prev => prev ? { ...prev, score: result.result.score } : null);
      
      return result.result;
    } catch (err: any) {
      console.error('Error grading quiz:', err);
      setError(err.message || 'Error grading your quiz. Please try again.');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    activeQuiz,
    userAnswers,
    isSubmitting,
    gradingResult,
    error,
    startQuiz,
    selectAnswer,
    submitAnswers,
    resetQuiz: () => {
      setUserAnswers({});
      setGradingResult(null);
    }
  };
}
