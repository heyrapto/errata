'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/types/lesson';
import { NoteCard } from '@/components/notes/note-card';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { BookOpen, Loader2 } from 'lucide-react';

export const unstable_instant = { prefetch: 'static' };

export default function NotesLibraryPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notes');
      const result = await response.json();
      if (result.success) {
        setNotes(result.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete these revision notes?')) return;
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setNotes(notes.filter((n) => n.id !== id));
      } else {
        alert(result.error || 'Failed to delete note');
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
          <BookOpen className="h-5.5 w-5.5 text-emerald-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Revision Notes</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm text-neutral-450 gap-3 bg-neutral-900/10 border border-neutral-850 rounded-xl">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          <span>Fetching revision library notes...</span>
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onDelete={handleDeleteNote} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col h-48 items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/10 p-6 text-center text-sm text-neutral-400">
          <BookOpen className="h-8 w-8 text-neutral-600 mb-3" />
          <p className="font-semibold text-neutral-300">No Revision Notes Found</p>
          <p className="text-xs text-neutral-500 mt-1 max-w-[250px]">
            Revision notes are auto-generated when you launch and complete course topic lessons!
          </p>
        </div>
      )}
    </div>
  );
}
