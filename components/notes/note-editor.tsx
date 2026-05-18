'use client';

import { useState } from 'react';
import { Note } from '@/types/lesson';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input, Textarea } from '../ui/input';
import { Save, Plus, Trash2, ArrowLeft, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

interface NoteEditorProps {
  note: Note;
  onSave: (updatedContent: Note['content']) => Promise<boolean>;
}

export function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note.content.title);
  const [summary, setSummary] = useState(note.content.summary);
  const [bullets, setBullets] = useState<string[]>(note.content.bullets || []);
  const [isSaving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddBullet = () => {
    setBullets([...bullets, '']);
  };

  const handleUpdateBullet = (index: number, val: string) => {
    const updated = [...bullets];
    updated[index] = val;
    setBullets(updated);
  };

  const handleDeleteBullet = (index: number) => {
    setBullets(bullets.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    
    const success = await onSave({
      title,
      summary,
      bullets: bullets.filter((b) => b.trim() !== ''),
      formulasOrDefinitions: note.content.formulasOrDefinitions,
    });
    
    setSaving(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Action Header bar */}
      <div className="flex items-center justify-between">
        <Link href="/notes">
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-neutral-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to notes
          </Button>
        </Link>

        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 min-w-[120px]">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : savedSuccess ? (
            <>
              <Check className="h-4 w-4 text-emerald-300" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-neutral-850">
          <CardTitle className="text-lg font-bold text-white">Edit Revision Note Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 py-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Note Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="bg-neutral-950 border-neutral-850 h-11 text-neutral-200" 
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Revision Summary</label>
            <Textarea 
              value={summary} 
              onChange={(e) => setSummary(e.target.value)} 
              className="bg-neutral-950 border-neutral-850 min-h-[100px] text-neutral-200 leading-relaxed" 
            />
          </div>

          {/* Bullets */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Core Lesson Bullet Points</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddBullet}
                className="h-7 text-[10px] px-2.5 font-bold border-neutral-800"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Point
              </Button>
            </div>

            <div className="space-y-3">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 select-none items-center justify-center rounded bg-neutral-950 border border-neutral-850 text-[10px] font-semibold text-neutral-500">
                    {idx + 1}
                  </span>
                  
                  <Input
                    value={b}
                    onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                    className="flex-1 bg-neutral-950 border-neutral-850 h-9 text-xs"
                    placeholder="Type key takeaway point..."
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBullet(idx)}
                    className="h-8 w-8 text-neutral-550 hover:text-red-400 rounded-md shrink-0"
                    title="Remove point"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {bullets.length === 0 && (
                <p className="text-xs text-neutral-500 text-center py-4 italic">
                  No bullet points defined. Click "Add Point" to create one.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
