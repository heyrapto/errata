'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, User, Sliders, Bell, Sparkles, Check } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Academic Learner');
  const [level, setLevel] = useState('undergraduate');
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4.5">
        <div className="flex items-center gap-2.5">
          <Settings className="h-5.5 w-5.5 text-emerald-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Workspace Settings</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader className="border-b border-neutral-850">
            <div className="flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-emerald-400" />
              <CardTitle className="text-sm font-bold text-white">Student Profile Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 py-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-neutral-950 border-neutral-850 h-10 text-neutral-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Registered Email</label>
              <Input
                value={session?.user?.email || 'student@eduagent.ai'}
                disabled
                className="bg-neutral-950 border-neutral-850 h-10 text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Academic Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="flex h-10 w-full rounded-md border border-neutral-850 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="highschool">High School (AP / SAT / JAMB)</option>
                <option value="undergraduate">University Undergraduate</option>
                <option value="postgraduate">University Postgraduate (MSc / PhD)</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="border-t border-neutral-850 pt-5 justify-end">
            <Button onClick={handleSave} className="min-w-[120px] h-10 font-semibold">
              {saved ? (
                <>
                  <Check className="mr-1.5 h-4.5 w-4.5 text-emerald-300" />
                  Saved!
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* AI & System preferences */}
        <div className="space-y-6">
          <Card className="border-l-4 border-l-sky-500">
            <CardHeader className="border-b border-neutral-850 py-4">
              <div className="flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-sky-400" />
                <CardTitle className="text-sm font-bold text-white">AI Tutor Voice Rates</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-4 space-y-4">
              <p className="text-xs text-neutral-450 leading-relaxed">
                Tune the default speed rate of the Web Speech TTS synthesizer.
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-350">
                  <span>Speed multiplier</span>
                  <span className="text-sky-400 font-bold">{ttsSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={ttsSpeed}
                  onChange={(e) => setTtsSpeed(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-neutral-950 accent-sky-400 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="border-b border-neutral-850 py-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-amber-400" />
                <CardTitle className="text-sm font-bold text-white">Study Schedule Reminders</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-4 text-xs text-neutral-400 leading-normal flex items-start gap-2.5">
              <Sparkles className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                System schedule reminders are enabled. You will receive active notifications 5 minutes prior to study sessions.
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
