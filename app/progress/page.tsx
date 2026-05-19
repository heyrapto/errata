'use client';

import { useSession } from 'next-auth/react';
import { useProgress } from '@/hooks/use-progress';
import { ProgressChart } from '@/components/progress/progress-chart';
import { WeakTopicsList } from '@/components/progress/weak-topics-list';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Award, Calendar, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ProgressTrackerPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  const { records, weakAreas, loading, refreshProgress } = useProgress(userId);

  // Compute overall study metrics
  const totalQuizzes = records.length;
  const passedQuizzes = records.filter(r => r.score >= 70).length;
  const averageScore = totalQuizzes > 0
    ? Math.round(records.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4.5">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-5.5 w-5.5 text-emerald-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Progress Analytics</h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshProgress}
          disabled={loading}
          className="h-8.5 text-xs font-semibold border-neutral-800"
        >
          <RefreshCw className={cn('mr-1.5 h-3.5 w-3.5', loading && 'animate-spin')} />
          Refresh Stats
        </Button>
      </div>

      {/* Summary Score Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <Card className="p-5 border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Average Score</span>
            <h4 className="text-2xl font-extrabold text-white">{averageScore}%</h4>
          </div>
          <div className="rounded-lg p-2.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-inner">
            <TrendingUp className="h-5 w-5" />
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-5 border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Quizzes Completed</span>
            <h4 className="text-2xl font-extrabold text-white">{totalQuizzes}</h4>
          </div>
          <div className="rounded-lg p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <Award className="h-5 w-5" />
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="p-5 border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Passing Rate</span>
            <h4 className="text-2xl font-extrabold text-white">
              {totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0}%
            </h4>
          </div>
          <div className="rounded-lg p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
            <Calendar className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Analytics Timeline & Weak Spots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ProgressChart records={records} />
        </div>
        <div>
          <WeakTopicsList weakAreas={weakAreas} />
        </div>
      </div>

      {/* Complete Historical Attempt Logs Table */}
      <Card>
        <CardHeader className="border-b border-neutral-850">
          <CardTitle className="text-sm font-bold text-white">Attempt logs & Study telemetry</CardTitle>
          <CardDescription className="text-xs">
            Review detailed scores of previous lesson study completions.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-0 px-0">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-sm text-neutral-450 gap-2">
              <Loader2 className="h-4.5 w-4.5 animate-spin text-emerald-400" />
              <span>Fetching logs...</span>
            </div>
          ) : records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-850 text-neutral-400 font-bold uppercase tracking-wider bg-neutral-950/20">
                    <th className="p-4">Study Topic</th>
                    <th className="p-4">Recorded Date</th>
                    <th className="p-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-neutral-200">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-neutral-900/20 transition-colors">
                      <td className="p-4 font-semibold text-neutral-200 truncate max-w-[200px]">
                        {rec.topic}
                      </td>
                      <td className="p-4 text-neutral-450">
                        {formatDate(rec.recorded_at)}
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                            rec.score >= 70
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          )}
                        >
                          {rec.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-xs text-neutral-500 italic py-8">
              No historical logs available yet. Complete your first lesson to view logs.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
