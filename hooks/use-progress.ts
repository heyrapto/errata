import { useState, useEffect } from 'react';
import { ProgressRecord } from '@/types/api';

export function useProgress(userId?: string) {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/progress?userId=${userId}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch progress logs.');
      }
      setRecords(result.records || []);
      setWeakAreas(result.weakAreas || []);
    } catch (err: any) {
      console.error('Error fetching progress:', err);
      setError(err.message || 'Error occurred while loading progress analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  return {
    records,
    weakAreas,
    loading,
    error,
    refreshProgress: fetchProgress,
  };
}
