import { supabaseAdmin } from './supabase';
import { Document } from '@/types/document';

export async function getDocumentsByUserId(userId: string): Promise<Document[]> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error.message);
    return [];
  }
  return data || [];
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching document:', error.message);
    return null;
  }
  return data;
}

export async function createDocument(doc: Omit<Document, 'id' | 'created_at' | 'indexed'>): Promise<Document | null> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .insert({
      user_id: doc.user_id,
      title: doc.title,
      storage_path: doc.storage_path,
      subject: doc.subject,
      indexed: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating document record:', error.message);
    return null;
  }
  return data;
}

export async function markDocumentAsIndexed(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('documents')
    .update({ indexed: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking document as indexed:', error.message);
    return false;
  }
  return true;
}

export async function deleteDocument(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting document record:', error.message);
    return false;
  }
  return true;
}
