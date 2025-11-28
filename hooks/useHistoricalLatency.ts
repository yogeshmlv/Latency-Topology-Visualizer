/**
 * Custom hook for fetching historical latency data
 */

import useSWR from 'swr';
import { HistoricalLatencyData } from '@/types';
import { useAppStore } from '@/store/useAppStore';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch historical latency data');
  }
  const data = await res.json();
  return data.data as HistoricalLatencyData[];
};

export function useHistoricalLatency(from: string | null, to: string | null) {
  const { timeRange } = useAppStore();

  // If only one exchange is selected, compare with the first other exchange
  const { data, error, isLoading } = useSWR<HistoricalLatencyData[]>(
    from && to ? `/api/latency/historical?from=${from}&to=${to}&timeRange=${timeRange}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    historicalData: data || [],
    isLoading,
    isError: error,
  };
}

