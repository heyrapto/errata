import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export function RecentUploads() {
  const files = [
    { id: 'a1', name: 'Physics_Ch_3.pdf', size: '2.1 MB' },
    { id: 'b2', name: 'LinearAlg_Notes.pdf', size: '730 KB' },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-200">Recent Uploads</h3>
        <FileText className="h-5 w-5 text-emerald-400" />
      </div>

      <div className="mt-3 space-y-2">
        {files.map((f) => (
          <Link key={f.id} href="#" className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-neutral-900/40">
            <div className="text-sm text-neutral-100">{f.name}</div>
            <div className="text-xs text-neutral-450">{f.size}</div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export default RecentUploads;
