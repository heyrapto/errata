'use client';

import { ProgressRecord } from '@/types/api';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Calendar, BarChart3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProgressChartProps {
  records: ProgressRecord[];
}

export function ProgressChart({ records }: ProgressChartProps) {
  // Sort records oldest to newest for chronological flow
  const sortedRecords = [...records]
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    .slice(-10); // Show last 10 points

  return (
    <Card>
      <CardHeader className="border-b border-neutral-850">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-400" />
          <CardTitle className="text-sm font-bold text-white">Quiz Score Timeline (Last 10 Attempts)</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="py-6">
        {sortedRecords.length > 0 ? (
          <div className="space-y-6">
            {/* Chart Grid */}
            <div className="flex h-48 items-end gap-2.5 sm:gap-4 border-b border-neutral-800 pb-2.5 pt-4 px-2">
              {sortedRecords.map((rec) => {
                const heightPercent = `${rec.score}%`;
                const isHigh = rec.score >= 70;
                
                return (
                  <div key={rec.id} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Value Tooltip */}
                    <div className="absolute -top-7 scale-0 group-hover:scale-100 transition-all duration-150 z-10 bg-neutral-950 text-emerald-400 border border-neutral-800 rounded-md px-2 py-0.5 text-[10px] font-bold shadow-xl">
                      {rec.score}%
                    </div>

                    {/* Dynamic Bar */}
                    <div 
                      style={{ height: heightPercent }}
                      className={cn(
                        'w-full rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-lg',
                        isHigh 
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-500 shadow-emerald-950/20' 
                          : 'bg-gradient-to-t from-amber-600 to-amber-500 shadow-amber-950/20'
                      )}
                    />
                    
                    {/* Short topic tag */}
                    <span className="text-[9px] font-semibold text-neutral-500 truncate max-w-[45px] select-none">
                      {rec.topic}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend Indicators */}
            <div className="flex items-center justify-center gap-6 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Passed (≥ 70%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Requires Review (&lt; 70%)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-36 flex-col items-center justify-center text-center text-xs text-neutral-500 italic select-none">
            <Calendar className="h-6 w-6 text-neutral-700 mb-2" />
            No telemetry logs synced yet. Complete lessons and quizzes to chart progress!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
