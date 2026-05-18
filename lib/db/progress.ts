import { supabaseAdmin } from './supabase';
import { ProgressRecord } from '@/types/api';

export async function getProgressByUserId(userId: string): Promise<ProgressRecord[]> {
  const { data, error } = await supabaseAdmin
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error('Error fetching progress:', error.message);
    return [];
  }
  return data || [];
}

export async function createProgressRecord(record: Omit<ProgressRecord, 'id' | 'recorded_at'>): Promise<ProgressRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('progress')
    .insert({
      user_id: record.user_id,
      topic: record.topic,
      score: record.score,
      weak_areas: record.weak_areas || [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating progress record:', error.message);
    return null;
  }
  return data;
}

export async function getWeakAreasByUserId(userId: string): Promise<string[]> {
  const records = await getProgressByUserId(userId);
  const lowScores = records.filter((r) => r.score < 70);
  const weakSet = new Set<string>();
  for (const rec of lowScores) {
    if (rec.weak_areas) {
      rec.weak_areas.forEach((wa) => weakSet.add(wa));
    }
  }
  return Array.from(weakSet);
}
