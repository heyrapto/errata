export interface LessonSection {
  title: string;
  body: string;
}

export interface LessonExample {
  concept: string;
  scenario: string;
  explanation: string;
}

export interface LessonContent {
  title: string;
  sections: LessonSection[];
  examples: LessonExample[];
  keyPoints: string[];
}

export type TutorMode = 'beginner' | 'deep' | 'exam' | 'revision';

export interface Lesson {
  id: string;
  user_id: string;
  document_id?: string;
  topic: string;
  mode: TutorMode;
  content: LessonContent;
  created_at: string;
}

export interface NoteContent {
  title: string;
  summary: string;
  bullets: string[];
  formulasOrDefinitions?: string[];
}

export interface Note {
  id: string;
  user_id: string;
  lesson_id: string;
  content: NoteContent;
  created_at: string;
}
