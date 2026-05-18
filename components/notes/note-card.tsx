'use client';

import { Note } from '@/types/lesson';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { BookOpen, Calendar, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const { content } = note;

  return (
    <Card className="hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-950/5 group flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 flex flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5 bg-neutral-950 border border-neutral-850 text-neutral-400 group-hover:text-emerald-400 transition-colors">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight text-neutral-200 line-clamp-1 max-w-[150px]">
                {content.title}
              </CardTitle>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(note.created_at)}</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(note.id)}
            className="h-8 w-8 text-neutral-550 hover:text-red-400 hover:bg-red-500/10 rounded-md shrink-0 opacity-0 group-hover:opacity-100 transition-all"
            title="Delete notes"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-xs text-neutral-450 leading-relaxed line-clamp-3">
            {content.summary}
          </p>
          
          {content.bullets && content.bullets.length > 0 && (
            <ul className="mt-3.5 space-y-1 pl-1">
              {content.bullets.slice(0, 2).map((b, idx) => (
                <li key={idx} className="text-[11px] text-neutral-450 truncate flex items-center gap-2">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-500/70" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </div>

      <div className="px-6 pb-6 pt-2">
        <Link href={`/notes/${note.id}`} className="w-full">
          <Button variant="outline" className="w-full h-9 text-xs font-semibold border-neutral-800">
            <Edit3 className="mr-1.5 h-3.5 w-3.5" />
            Edit Revision Notes
          </Button>
        </Link>
      </div>
    </Card>
  );
}
