import { useState } from 'react';
import { useSessionStore } from '@/store/session-store';
import { TutorMode, Lesson } from '@/types/lesson';

export function useLesson() {
  const { currentLesson, setLesson, setLoading, isLoading } = useSessionStore();
  const [error, setError] = useState<string | null>(null);

  const generateLesson = async (topic: string, mode: TutorMode, documentId?: string): Promise<Lesson | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tutor/lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, mode, documentId }),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate lesson.');
      }

      setLesson(result.lesson);
      return result.lesson;
    } catch (err: any) {
      console.error('Error generating lesson:', err);
      setError(err.message || 'Error occurred while creating study material.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentLesson,
    generateLesson,
    isLoading,
    error,
  };
}
