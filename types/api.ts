import { TutorMode } from './lesson';

export interface LessonGenerationRequest {
  topic?: string;
  documentId?: string;
  mode: TutorMode;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatSessionRequest {
  sessionId: string;
  message: string;
  mode: TutorMode;
}

export interface Schedule {
  id: string;
  user_id: string;
  subject: string;
  day_of_week: number; // 0-6
  start_time: string; // "HH:MM:SS"
  duration_mins: number;
  active: boolean;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  topic: string;
  score: number;
  weak_areas: string[];
  recorded_at: string;
}
