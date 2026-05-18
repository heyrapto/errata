import { supabaseAdmin } from './supabase';
import { Lesson, TutorMode } from '@/types/lesson';

export async function getLessonsByUserId(userId: string): Promise<Lesson[]> {
  const { data, error } = await supabaseAdmin
    .from('lessons')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lessons:', error.message);
    return [];
  }
  return data || [];
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const { data, error } = await supabaseAdmin
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching lesson:', error.message);
    return null;
  }
  return data;
}

export async function createLesson(lesson: Omit<Lesson, 'id' | 'created_at'>): Promise<Lesson | null> {
  const { data, error } = await supabaseAdmin
    .from('lessons')
    .insert({
      user_id: lesson.user_id,
      document_id: lesson.document_id || null,
      topic: lesson.topic,
      mode: lesson.mode,
      content: lesson.content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating lesson:', error.message);
    return null;
  }
  return data;
}
