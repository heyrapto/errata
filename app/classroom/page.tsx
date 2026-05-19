'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Users, Sparkles, AlertCircle, Compass } from 'lucide-react';

export default function ClassroomPage() {
  const [activeSession, setActiveSession] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4.5">
        <div className="flex items-center gap-2.5">
          <Video className="h-5.5 w-5.5 text-emerald-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Virtual Study Corridor</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Call window placeholder */}
        <Card className="md:col-span-2 overflow-hidden flex flex-col justify-between min-h-[400px] border border-neutral-800">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

          <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            {activeSession ? (
              <div className="space-y-4 w-full">
                {/* Simulated Zoom Video sdk connection block */}
                <div className="relative h-64 w-full rounded-lg bg-neutral-950 border border-neutral-850 flex items-center justify-center text-xs text-neutral-400">
                  <span className="animate-pulse flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Zoom Video SDK Connected — Real-time peer stream active
                  </span>
                </div>
                <Button
                  onClick={() => setActiveSession(false)}
                  variant="destructive"
                  className="px-6 font-semibold"
                >
                  Leave study corridor
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-xl p-3.5 bg-neutral-950 border border-neutral-850 text-neutral-450 shadow-inner">
                  <Video className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-200">No active study session</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-[280px] leading-relaxed mx-auto">
                    Launch a synchronized virtual corridor to study textbook notes or quiz topics alongside classmates in real-time.
                  </p>
                </div>
                <Button
                  onClick={() => setActiveSession(true)}
                  className="px-6 font-semibold h-11"
                >
                  Initialize Zoom Study Corridor
                  <Compass className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Info panel */}
        <div className="space-y-6">
          <Card className="border-l-4 border-l-fuchsia-500">
            <CardHeader className="py-4">
              <h3 className="text-sm font-bold text-fuchsia-400 flex items-center gap-2">
                <Users className="h-4.5 w-4.5" />
                Peer-to-Peer Study rooms
              </h3>
            </CardHeader>
            <CardContent className="py-4 text-xs text-neutral-400 leading-normal space-y-3">
              <p>
                EduAgent Virtual Classrooms are powered by the **Zoom Video SDK**.
                It leverages low-latency audio/video feeds directly alongside active AI workspace notes.
              </p>
              <div className="rounded-lg bg-neutral-950/60 p-3 border border-neutral-850 flex items-start gap-2.5">
                <Sparkles className="h-4.5 w-4.5 text-fuchsia-400 shrink-0 mt-0.5" />
                <span>
                  Share and stream active textbook guides directly within the session!
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="py-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5" />
                Classroom Telemetry Log
              </h3>
            </CardHeader>
            <CardContent className="py-4 text-xs text-neutral-450 leading-relaxed">
              Timetable session hours are automatically saved under your student progress timeline metrics to reward collaborative study efforts!
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
