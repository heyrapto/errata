import { supabaseAdmin } from './supabase';
import { Schedule } from '@/types/api';

export async function getSchedulesByUserId(userId: string): Promise<Schedule[]> {
  const { data, error } = await supabaseAdmin
    .from('schedules')
    .select('*')
    .eq('user_id', userId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching schedules:', error.message);
    return [];
  }
  return data || [];
}

export async function createSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule | null> {
  const { data, error } = await supabaseAdmin
    .from('schedules')
    .insert({
      user_id: schedule.user_id,
      subject: schedule.subject,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      duration_mins: schedule.duration_mins,
      active: schedule.active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating schedule:', error.message);
    return null;
  }
  return data;
}

export async function updateSchedule(id: string, updates: Partial<Omit<Schedule, 'id' | 'user_id'>>): Promise<Schedule | null> {
  const { data, error } = await supabaseAdmin
    .from('schedules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating schedule:', error.message);
    return null;
  }
  return data;
}

export async function deleteSchedule(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('schedules')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting schedule:', error.message);
    return false;
  }
  return true;
}
