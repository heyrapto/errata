'use client';

import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { AlertTriangle, Lightbulb } from 'lucide-react';

interface WeakTopicsListProps {
  weakAreas: string[];
}

export function WeakTopicsList({ weakAreas }: WeakTopicsListProps) {
  return (
    <Card className="border-l-4 border-l-amber-500 bg-neutral-900/40">
      <CardHeader className="border-b border-neutral-850 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
          <CardTitle className="text-sm font-bold text-white">System Flagged Weak Concepts</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="py-5 space-y-4">
        {weakAreas.length > 0 ? (
          <>
            <p className="text-xs text-neutral-400 leading-normal">
              Based on your quiz history, you scored below 70% in these sub-topics. 
              We recommend reviewing them in <span className="text-amber-500 font-bold">Deep Study</span> or <span className="text-emerald-500 font-bold">Exam Prep</span> modes.
            </p>
            
            <div className="flex flex-wrap gap-2 pt-1.5">
              {weakAreas.map((area) => (
                <div 
                  key={area}
                  className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-400 font-medium flex items-center gap-1.5"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {area}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-xs text-neutral-500 italic select-none py-4">
            Excellent! No critical weaknesses flagged yet. Keep it up!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
