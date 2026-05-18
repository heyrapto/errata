'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onUploadComplete: () => void;
  userId: string;
}

export function UploadDropzone({ onUploadComplete, userId }: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'indexing' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadStatus('error');
      setErrorMessage('Only PDF documents are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10 MB Limit
      setUploadStatus('error');
      setErrorMessage('File size exceeds the 10 MB limit.');
      return;
    }

    setUploadStatus('uploading');
    setFileName(file.name);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('title', file.name);

      // Extract subject from name as helper
      const subjectMatch = file.name.match(/^\[(.*?)\]/);
      if (subjectMatch) {
        formData.append('subject', subjectMatch[1]);
      }

      setUploadStatus('indexing'); // Extracting & Vectorizing in background
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to complete index flow');
      }

      setUploadStatus('success');
      onUploadComplete();
    } catch (err: any) {
      console.error(err);
      setUploadStatus('error');
      setErrorMessage(err.message || 'Error occurred while indexing document.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 backdrop-blur-sm min-h-[220px] flex flex-col items-center justify-center',
        isDragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-800 bg-neutral-900/30 hover:border-neutral-700',
        uploadStatus === 'success' && 'border-emerald-500/30 bg-emerald-500/5'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
      />

      {uploadStatus === 'idle' && (
        <>
          <div className="rounded-lg p-3 bg-neutral-950 border border-neutral-850 mb-3 text-neutral-400">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-neutral-200">Drag & drop your study material</p>
          <p className="text-xs text-neutral-400 mt-1">PDF format only (Max 10 MB)</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 border-neutral-800"
          >
            Select PDF File
          </Button>
        </>
      )}

      {(uploadStatus === 'uploading' || uploadStatus === 'indexing') && (
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-emerald-400 mb-4" />
          <p className="text-sm font-semibold text-neutral-200">
            {uploadStatus === 'uploading' ? 'Uploading PDF file...' : 'Extracting & Indexing vector chunks...'}
          </p>
          <p className="text-xs text-neutral-400 mt-1 truncate max-w-[250px]">{fileName}</p>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="flex flex-col items-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-4" />
          <p className="text-sm font-semibold text-emerald-400">Indexation complete!</p>
          <p className="text-xs text-neutral-400 mt-1 truncate max-w-[250px]">{fileName}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setUploadStatus('idle')}
            className="mt-4 text-neutral-400 hover:text-white"
          >
            Upload another file
          </Button>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="flex flex-col items-center">
          <AlertCircle className="h-8 w-8 text-red-400 mb-4" />
          <p className="text-sm font-semibold text-red-400">Upload failed</p>
          <p className="text-xs text-neutral-400 mt-1">{errorMessage}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUploadStatus('idle')}
            className="mt-4 border-neutral-800"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
