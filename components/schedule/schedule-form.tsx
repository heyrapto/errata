'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';

interface ScheduleFormProps {
  onSubmit: (subject: string, dayOfWeek: number, startTime: string, durationMins: number) => Promise<boolean>;
  isSubmitting: boolean;
}

export function ScheduleForm({ onSubmit, isSubmitting }: ScheduleFormProps) {
  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1); // Monday default
  const [startTime, setStartTime] = useState('09:00');
  const [durationMins, setDurationMins] = useState(45);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || isSubmitting) return;

    const success = await onSubmit(
      subject.trim(),
      dayOfWeek,
      startTime,
      Number(durationMins)
    );

    if (success) {
      setSubject('');
    }
  };

  const weekdays = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Subject Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Subject / Study Topic</label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Mathematics, Organic Chemistry, World History..."
          className="bg-neutral-950 border-neutral-850 h-10"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Day selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Day of Week</label>
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value))}
            className="flex h-10 w-full rounded-md border border-neutral-850 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {weekdays.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Start Time</label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-neutral-950 border-neutral-850 h-10 text-neutral-200"
            required
          />
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Duration (Minutes)</label>
        <Input
          type="number"
          min="10"
          max="360"
          value={durationMins}
          onChange={(e) => setDurationMins(Number(e.target.value))}
          className="bg-neutral-950 border-neutral-850 h-10"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={!subject.trim() || isSubmitting}
        className="w-full h-11 font-semibold mt-4"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding to study calendar...
          </>
        ) : (
          'Add Study Slot'
        )}
      </Button>
    </form>
  );
}
