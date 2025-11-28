'use client';

/**
 * Historical Latency Chart Component
 * Displays time-series latency data using Recharts
 */

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { HistoricalLatencyData } from '@/types';
import { getLatencyColor } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

interface LatencyChartProps {
  data: HistoricalLatencyData[];
  fromName: string;
  toName: string;
}

export default function LatencyChart({ data, fromName, toName }: LatencyChartProps) {
  const { theme } = useAppStore();

  // Format data for chart
  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: format(new Date(item.timestamp), 'HH:mm'),
      timestamp: item.timestamp,
      latency: item.latency,
      date: format(new Date(item.timestamp), 'MMM dd, yyyy'),
    }));
  }, [data]);

  // Calculate average latency
  const avgLatency = useMemo(() => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.latency, 0);
    return Math.round(sum / data.length);
  }, [data]);

  // Get color based on average latency
  const lineColor = getLatencyColor(avgLatency);

  const textColor = theme === 'dark' ? '#e2e8f0' : '#1e293b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Latency History
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {fromName} → {toName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600 dark:text-slate-400">Average</p>
          <p
            className="text-2xl font-bold"
            style={{ color: lineColor }}
          >
            {avgLatency}ms
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="time"
            stroke={textColor}
            style={{ fontSize: '12px' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={textColor}
            style={{ fontSize: '12px' }}
            label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', fill: textColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: textColor }}
            formatter={(value: number) => [`${value}ms`, 'Latency']}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                const data = payload[0].payload;
                return `${data.date} ${label}`;
              }
              return label;
            }}
          />
          <Legend
            wrapperStyle={{ color: textColor }}
            formatter={() => 'Latency'}
          />
          <Line
            type="monotone"
            dataKey="latency"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ r: 3, fill: lineColor }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Min</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {Math.min(...data.map((d) => d.latency))}ms
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Max</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {Math.max(...data.map((d) => d.latency))}ms
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Samples</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {data.length}
          </p>
        </div>
      </div>
    </div>
  );
}

