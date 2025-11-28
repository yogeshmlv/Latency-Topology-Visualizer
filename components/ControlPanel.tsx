'use client';

/**
 * Control Panel Component
 * Provides filters, search, and controls for the visualization
 */

import { useState, useMemo } from 'react';
import { EXCHANGE_SERVERS, CLOUD_REGIONS } from '@/lib/data';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export default function ControlPanel() {
  const {
    filters,
    setFilters,
    selectedExchange,
    setSelectedExchange,
    isPlaying,
    setIsPlaying,
    timeRange,
    setTimeRange,
    theme,
    toggleTheme,
    resetFilters,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Get unique exchange names
  const uniqueExchanges = useMemo(() => {
    const names = new Set(EXCHANGE_SERVERS.map((s) => s.name));
    return Array.from(names);
  }, []);

  // Get unique cloud providers
  const uniqueProviders = useMemo(() => {
    const providers = new Set(EXCHANGE_SERVERS.map((s) => s.cloudProvider));
    return Array.from(providers);
  }, []);

  // Filter exchanges based on search
  const filteredExchanges = useMemo(() => {
    if (!searchQuery) return EXCHANGE_SERVERS;
    const query = searchQuery.toLowerCase();
    return EXCHANGE_SERVERS.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.city.toLowerCase().includes(query) ||
        s.country.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleExchange = (exchangeId: string) => {
    const current = filters.selectedExchanges;
    setFilters({
      selectedExchanges: current.includes(exchangeId)
        ? current.filter((id) => id !== exchangeId)
        : [...current, exchangeId],
    });
  };

  const toggleCloudProvider = (provider: string) => {
    const current = filters.selectedCloudProviders;
    setFilters({
      selectedCloudProviders: current.includes(provider)
        ? current.filter((p) => p !== provider)
        : [...current, provider],
    });
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-10 max-w-md md:max-w-lg">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-xl p-4 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Controls
          </h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search exchanges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Exchange Filters */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Exchanges ({filters.selectedExchanges.length === 0 ? 'All' : filters.selectedExchanges.length})
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {uniqueExchanges.map((name) => {
              const exchangeIds = EXCHANGE_SERVERS.filter((s) => s.name === name).map((s) => s.id);
              const allSelected = exchangeIds.every((id) => filters.selectedExchanges.includes(id));
              const someSelected = exchangeIds.some((id) => filters.selectedExchanges.includes(id));

              return (
                <label key={name} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={() => {
                      if (allSelected) {
                        setFilters({
                          selectedExchanges: filters.selectedExchanges.filter((id) => !exchangeIds.includes(id)),
                        });
                      } else {
                        setFilters({
                          selectedExchanges: [...new Set([...filters.selectedExchanges, ...exchangeIds])],
                        });
                      }
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Cloud Provider Filters */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Cloud Providers
          </label>
          <div className="space-y-1">
            {uniqueProviders.map((provider) => (
              <label key={provider} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.selectedCloudProviders.includes(provider)}
                  onChange={() => toggleCloudProvider(provider)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{provider}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Latency Threshold */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Latency Range: {filters.latencyThreshold.min}ms - {filters.latencyThreshold.max}ms
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="500"
              value={filters.latencyThreshold.min}
              onChange={(e) =>
                setFilters({
                  latencyThreshold: {
                    ...filters.latencyThreshold,
                    min: parseInt(e.target.value),
                  },
                })
              }
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="500"
              value={filters.latencyThreshold.max}
              onChange={(e) =>
                setFilters({
                  latencyThreshold: {
                    ...filters.latencyThreshold,
                    max: parseInt(e.target.value),
                  },
                })
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Show Cloud Regions
            </span>
            <input
              type="checkbox"
              checked={filters.showCloudRegions}
              onChange={(e) => setFilters({ showCloudRegions: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Show Connections
            </span>
            <input
              type="checkbox"
              checked={filters.showConnections}
              onChange={(e) => setFilters({ showConnections: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Time Range
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['1h', '24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            'w-full px-4 py-2 rounded-lg font-medium transition-colors',
            isPlaying
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          )}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        {/* Reset */}
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

