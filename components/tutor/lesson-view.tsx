'use client';

import { Lesson } from '@/types/lesson';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { BookOpen, AlertCircle, Bookmark, Compass } from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
}

export function LessonView({ lesson }: LessonViewProps) {
  const { content } = lesson;

  return (
    <div className="space-y-6">
      {/* Lesson Header Card */}
      <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-500/5 to-teal-500/0">
        <CardHeader className="flex flex-row items-center gap-4 py-6">
          <div className="rounded-lg p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              {lesson.mode.toUpperCase()} STUDY GUIDE
            </div>
            <CardTitle className="text-2xl mt-1 font-bold text-white tracking-tight leading-snug">
              {content.title}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 gap-6">
        {content.sections.map((section, idx) => (
          <Card key={idx} className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500/20" />
            <CardHeader className="py-4">
              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <Compass className="h-4.5 w-4.5" />
                {section.title}
              </h3>
            </CardHeader>
            <CardContent className="text-neutral-300 leading-relaxed text-[15px] space-y-4">
              <p className="whitespace-pre-line">{section.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Relatable Examples Block */}
      {content.examples && content.examples.length > 0 && (
        <Card className="border-l-4 border-l-amber-500 bg-neutral-900/50">
          <CardHeader className="py-4">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5" />
              Relatable Examples & Real-world Scenarios
            </h3>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            {content.examples.map((ex, idx) => (
              <div 
                key={idx} 
                className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4.5 space-y-2"
              >
                <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Concept: {ex.concept}
                </div>
                <div className="text-sm font-semibold text-neutral-200">
                  Scenario: {ex.scenario}
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed mt-1">
                  {ex.explanation}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Takeaways summary */}
      {content.keyPoints && content.keyPoints.length > 0 && (
        <Card className="border-l-4 border-l-sky-500 bg-neutral-900/20">
          <CardHeader className="py-4">
            <h3 className="text-lg font-bold text-sky-400 flex items-center gap-2">
              <Bookmark className="h-4.5 w-4.5" />
              Key High-Yield Takeaways
            </h3>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {content.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
