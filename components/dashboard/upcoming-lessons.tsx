import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export function UpcomingLessons() {
  const lessons = [
    { id: 1, title: 'Intro to Thermodynamics', time: 'Tomorrow 10:00' },
    { id: 2, title: 'Linear Algebra: Eigenvalues', time: 'Thu 14:30' },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-200">Upcoming Lessons</h3>
        <Calendar className="h-5 w-5 text-emerald-400" />
      </div>

      <div className="mt-3 space-y-3">
        {lessons.map((l) => (
          <Link key={l.id} href="#" className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-neutral-900/40">
            <div>
              <div className="font-medium text-sm text-neutral-100">{l.title}</div>
              <div className="text-xs text-neutral-450">{l.time}</div>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">Join</div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export default UpcomingLessons;
