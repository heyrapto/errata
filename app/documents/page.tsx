'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Document } from '@/types/document';
import { UploadDropzone } from '@/components/documents/upload-dropzone';
import { DocumentList } from '@/components/documents/document-list';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Sparkles, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocumentsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/documents');
      const result = await response.json();
      if (result.success) {
        setDocuments(result.documents || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document? This will purge its vector index.')) return;
    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setDocuments(documents.filter((doc) => doc.id !== id));
      } else {
        alert(result.error || 'Failed to delete document');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = (doc: Document) => {
    // Launch tutor session with active document context
    router.push(`/tutor?docId=${doc.id}&topic=${encodeURIComponent(doc.title.replace(/\.[^/.]+$/, ''))}`);
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    fetchDocuments();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4.5">
        <div className="flex items-center gap-2.5">
          <FileText className="h-5.5 w-5.5 text-emerald-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Study Library</h1>
        </div>
        
        <Button 
          onClick={() => setShowUpload(!showUpload)} 
          className="flex items-center gap-1.5 h-9 text-xs font-semibold"
        >
          {showUpload ? (
            <>
              <X className="h-4 w-4" />
              Close Drawer
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </div>

      {/* Upload Dropzone Drawer Drawer */}
      {showUpload && (
        <Card className="max-w-xl mx-auto shadow-2xl p-2.5">
          <CardHeader className="py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
              <CardTitle className="text-sm font-bold text-white">Add New Study Material</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Upload notes or slides. EduAgent will instantly perform kNN semantic vector segmentation.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <UploadDropzone onUploadComplete={handleUploadComplete} userId={userId} />
          </CardContent>
        </Card>
      )}

      {/* Documents Grid Grid */}
      <DocumentList 
        documents={documents} 
        loading={loading} 
        onDelete={handleDelete} 
        onSelect={handleSelect} 
      />
    </div>
  );
}
