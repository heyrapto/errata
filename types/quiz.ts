export type QuestionType = 'mcq' | 'short-answer';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // Only for MCQ
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  lesson_id: string;
  questions: QuizQuestion[];
  score?: number;
  created_at: string;
}

export interface QuizAttempt {
  quizId: string;
  answers: Record<string, string>; // questionId -> user's typed or selected answer
}

export interface QuizFeedback {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface QuizGradingResult {
  score: number;
  feedback: Record<string, QuizFeedback>;
}
