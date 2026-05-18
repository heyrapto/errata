'use client';

import { Document } from '@/types/document';
import { DocumentCard } from './document-card';
import { FileText, Loader2 } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  loading: boolean;
  onDelete: (id: string) => void;
  onSelect: (doc: Document) => void;
}

export function DocumentList({ documents, loading, onDelete, onSelect }: DocumentListProps) {
  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-neutral-400 gap-3 bg-neutral-900/10 border border-neutral-850 rounded-xl">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
        <span>Fetching study library files...</span>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col h-48 items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/10 p-6 text-center text-sm text-neutral-400">
        <FileText className="h-8 w-8 text-neutral-600 mb-3" />
        <p className="font-semibold text-neutral-300">Your Study Library is Empty</p>
        <p className="text-xs text-neutral-500 mt-1 max-w-[250px]">
          Upload textbook PDFs or lecture notes to search and learn using Document Tutor Mode.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <DocumentCard 
          key={doc.id} 
          doc={doc} 
          onDelete={onDelete} 
          onSelect={onSelect} 
        />
      ))}
    </div>
  );
}
