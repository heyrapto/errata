'use client';

import { Schedule } from '@/types/api';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2, Clock, Calendar } from 'lucide-react';

interface WeekCalendarProps {
  schedules: Schedule[];
  onDeleteSlot: (id: string) => void;
}

export function WeekCalendar({ schedules, onDeleteSlot }: WeekCalendarProps) {
  const weekdays = [
    { name: 'Sunday', value: 0 },
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
  ];

  // Group schedules by weekday index
  const groupedSchedules = weekdays.map((day) => {
    const slots = schedules.filter((s) => s.day_of_week === day.value);
    return {
      ...day,
      slots,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {groupedSchedules.map((day) => (
        <div key={day.value} className="space-y-3">
          {/* Day Header */}
          <div className="rounded-lg bg-neutral-950/80 px-3 py-2 border border-neutral-850 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300 tracking-tight">{day.name}</span>
            <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded">
              {day.slots.length}
            </span>
          </div>

          {/* Slots List */}
          <div className="space-y-2.5 min-h-[100px] rounded-xl bg-neutral-900/10 border border-dashed border-neutral-850 p-2">
            {day.slots.map((slot) => (
              <Card 
                key={slot.id} 
                className="p-3 border-neutral-800 bg-neutral-950/40 relative group hover:border-emerald-500/30 transition-all"
              >
                <div className="pr-6 space-y-1.5">
                  <h4 className="text-xs font-bold text-neutral-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {slot.subject}
                  </h4>
                  
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-medium">
                    <Clock className="h-3 w-3" />
                    <span>{slot.start_time} ({slot.duration_mins}m)</span>
                  </div>
                </div>

                {/* Delete Trigger */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteSlot(slot.id)}
                  className="absolute top-2 right-2 h-6 w-6 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove study slot"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Card>
            ))}

            {day.slots.length === 0 && (
              <div className="flex h-16 items-center justify-center text-[10px] text-neutral-600 italic select-none">
                No sessions
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
