'use client';

import { Document } from '@/types/document';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Trash2, GraduationCap, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface DocumentCardProps {
  doc: Document;
  onDelete: (id: string) => void;
  onSelect: (doc: Document) => void;
}

export function DocumentCard({ doc, onDelete, onSelect }: DocumentCardProps) {
  return (
    <Card className="hover:border-emerald-500/30 transition-all duration-350 hover:shadow-2xl hover:shadow-emerald-950/5 group">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg p-2.5 bg-neutral-950 border border-neutral-850 text-neutral-400 group-hover:text-emerald-400 transition-colors">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight text-neutral-200 group-hover:text-white line-clamp-1 max-w-[150px]">
              {doc.title}
            </CardTitle>
            <span className="inline-block mt-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              {doc.subject || 'UNTAGGED'}
            </span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(doc.id)}
          className="h-8 w-8 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-md shrink-0 opacity-0 group-hover:opacity-100 transition-all"
          title="Delete document and search index"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col gap-2.5 mt-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Uploaded: {formatDate(doc.created_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            {doc.indexed ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">ElasticSearch Indexed</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span className="text-amber-400">Processing index...</span>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={() => onSelect(doc)}
          disabled={!doc.indexed}
          className="w-full mt-5 h-9 text-xs font-semibold"
        >
          <GraduationCap className="mr-1.5 h-4 w-4" />
          Launch AI Session
        </Button>
      </CardContent>
    </Card>
  );
}
