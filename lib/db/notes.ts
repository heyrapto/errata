import { supabaseAdmin } from './supabase';
import { Note } from '@/types/lesson';

export async function getNotesByUserId(userId: string): Promise<Note[]> {
  const { data, error } = await supabaseAdmin
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error.message);
    return [];
  }
  return data || [];
}

export async function getNoteById(id: string): Promise<Note | null> {
  const { data, error } = await supabaseAdmin
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching note:', error.message);
    return null;
  }
  return data;
}

export async function createNote(note: Omit<Note, 'id' | 'created_at'>): Promise<Note | null> {
  const { data, error } = await supabaseAdmin
    .from('notes')
    .insert({
      user_id: note.user_id,
      lesson_id: note.lesson_id,
      content: note.content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating note:', error.message);
    return null;
  }
  return data;
}

export async function updateNoteContent(id: string, content: Note['content']): Promise<Note | null> {
  const { data, error } = await supabaseAdmin
    .from('notes')
    .update({ content })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating note:', error.message);
    return null;
  }
  return data;
}

export async function deleteNote(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting note:', error.message);
    return false;
  }
  return true;
}
