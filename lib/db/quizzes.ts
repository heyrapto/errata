import { supabaseAdmin } from './supabase';
import { Quiz } from '@/types/quiz';

export async function getQuizzesByUserId(userId: string): Promise<Quiz[]> {
  const { data, error } = await supabaseAdmin
    .from('quizzes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quizzes:', error.message);
    return [];
  }
  return data || [];
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  const { data, error } = await supabaseAdmin
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching quiz:', error.message);
    return null;
  }
  return data;
}

export async function createQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>): Promise<Quiz | null> {
  const { data, error } = await supabaseAdmin
    .from('quizzes')
    .insert({
      user_id: quiz.user_id,
      lesson_id: quiz.lesson_id,
      questions: quiz.questions,
      score: quiz.score || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating quiz:', error.message);
    return null;
  }
  return data;
}

export async function updateQuizScore(id: string, score: number): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('quizzes')
    .update({ score })
    .eq('id', id);

  if (error) {
    console.error('Error updating quiz score:', error.message);
    return false;
  }
  return true;
}
