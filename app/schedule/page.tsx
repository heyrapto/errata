'use client';

import { useState, useEffect } from 'react';
import { Schedule } from '@/types/api';
import { ScheduleForm } from '@/components/schedule/schedule-form';
import { WeekCalendar } from '@/components/schedule/week-calendar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Loader2 } from 'lucide-react';

export const unstable_instant = { prefetch: 'static' };

export default function StudySchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/schedules');
      const result = await response.json();
      if (result.success) {
        setSchedules(result.schedules || []);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddSlot = async (
    subject: string,
    dayOfWeek: number,
    startTime: string,
    durationMins: number
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          dayOfWeek,
          startTime,
          durationMins,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSchedules([...schedules, result.schedule]);
        return true;
      }
      alert(result.error || 'Failed to add study slot');
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study slot?')) return;
    try {
      const response = await fetch(`/api/schedules?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setSchedules(schedules.filter((s) => s.id !== id));
      } else {
        alert(result.error || 'Failed to delete study slot');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4.5">
        <div className="flex items-center gap-2.5">
          <Calendar className="h-5.5 w-5.5 text-emerald-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Study Planner</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Timetable grid */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-450 gap-3 bg-neutral-900/10 border border-neutral-850 rounded-xl">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
              <span>Fetching study timetable slots...</span>
            </div>
          ) : (
            <WeekCalendar schedules={schedules} onDeleteSlot={handleDeleteSlot} />
          )}
        </div>

        {/* Add study slot form */}
        <div className="order-1 lg:order-2">
          <Card className="sticky top-20 shadow-xl border border-neutral-800">
            <CardHeader className="border-b border-neutral-850">
              <CardTitle className="text-sm font-bold text-white">Add Class/Timetable Slot</CardTitle>
              <CardDescription className="text-xs">
                Log study subjects to sync notifications and reminders.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-5">
              <ScheduleForm onSubmit={handleAddSlot} isSubmitting={isSubmitting} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
