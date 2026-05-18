'use client';

import { useState, useEffect, use } from 'react';
import { Note } from '@/types/lesson';
import { NoteEditor } from '@/components/notes/note-editor';
import { Loader2 } from 'lucide-react';

export const unstable_instant = { prefetch: 'static' };

interface NoteEditorPageProps {
  params: Promise<{ id: string }>;
}

export default function NoteEditorPage({ params }: NoteEditorPageProps) {
  // Resolve params using React.use() wrapper in Next.js 16/App Router
  const { id } = use(params);

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes?id=${id}`);
        const result = await response.json();
        if (result.success) {
          setNote(result.note);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSave = async (updatedContent: Note['content']): Promise<boolean> => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          content: updatedContent,
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error saving note:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-neutral-450 gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
        <span>Loading revision note editor...</span>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center text-sm text-neutral-400 py-12">
        Revision note not found or has been removed.
      </div>
    );
  }

  return (
    <div className="py-6">
      <NoteEditor note={note} onSave={handleSave} />
    </div>
  );
}
