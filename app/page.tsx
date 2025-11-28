'use client';

/**
 * Main Page Component
 * Latency Topology Visualizer for GoQuant
 */

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import ControlPanel from '@/components/ControlPanel';
import LatencyChart from '@/components/LatencyChart';
import { useLatencyData } from '@/hooks/useLatencyData';
import { useHistoricalLatency } from '@/hooks/useHistoricalLatency';
import { useAppStore } from '@/store/useAppStore';
import { EXCHANGE_SERVERS } from '@/lib/data';

// Dynamically import WorldMap to avoid SSR issues with Three.js
const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-black">
      <div className="text-white text-lg">Loading 3D Map...</div>
    </div>
  ),
});

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function Home() {
  const { latencyData, isLoading } = useLatencyData(5000); // Refresh every 5 seconds
  const { selectedExchange, isPlaying } = useAppStore();
  // For historical data, compare selected exchange with first other exchange
  const otherExchange = selectedExchange
    ? EXCHANGE_SERVERS.find((e) => e.id !== selectedExchange)
    : null;
  const { historicalData, isLoading: isLoadingHistory } = useHistoricalLatency(
    selectedExchange || null,
    otherExchange?.id || null
  );

  // Get selected exchange details
  const selectedExchangeData = selectedExchange
    ? EXCHANGE_SERVERS.find((e) => e.id === selectedExchange)
    : null;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* 3D World Map */}
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingSpinner />}>
          <WorldMap latencyData={latencyData} />
        </Suspense>
      </div>

      {/* Control Panel */}
      <ControlPanel />

      {/* Chart Panel - Shows when exchange is selected */}
      {selectedExchange && selectedExchangeData && (
        <div className="absolute bottom-4 left-4 right-4 z-10 max-w-2xl mx-auto">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-xl p-6">
            {isLoadingHistory ? (
              <LoadingSpinner />
            ) : (
              <LatencyChart
                data={historicalData}
                fromName={selectedExchangeData.name}
                toName={otherExchange?.name || 'Other Exchange'}
              />
            )}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-700 dark:text-slate-300">&lt; 50ms</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-slate-700 dark:text-slate-300">50-150ms</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-700 dark:text-slate-300">&gt; 150ms</span>
            </div>
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span className="text-slate-700 dark:text-slate-300">Updating...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-lg px-6 py-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Latency Topology Visualizer
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">GoQuant</p>
        </div>
      </div>
    </main>
  );
}
