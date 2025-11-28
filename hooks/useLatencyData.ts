/**
 * Custom hook for fetching latency data using SWR
 */

import useSWR from 'swr';
import { LatencyData } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch latency data');
  }
  const data = await res.json();
  return data.data as LatencyData[];
};

export function useLatencyData(refreshInterval: number = 5000) {
  const { data, error, isLoading } = useSWR<LatencyData[]>(
    '/api/latency',
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    latencyData: data || [],
    isLoading,
    isError: error,
  };
}

