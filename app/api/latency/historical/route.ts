/**
 * API route for historical latency data
 * Returns time-series data for selected exchanges
 */

import { NextResponse } from 'next/server';
import { EXCHANGE_SERVERS } from '@/lib/data';
import { HistoricalLatencyData } from '@/types';
import { calculateDistance } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const timeRange = searchParams.get('timeRange') || '24h';

    if (!from || !to) {
      return NextResponse.json(
        { success: false, error: 'Missing from or to parameters' },
        { status: 400 }
      );
    }

    const fromServer = EXCHANGE_SERVERS.find((s) => s.id === from);
    const toServer = EXCHANGE_SERVERS.find((s) => s.id === to);

    if (!fromServer || !toServer) {
      return NextResponse.json(
        { success: false, error: 'Invalid exchange IDs' },
        { status: 400 }
      );
    }

    // Calculate base latency
    const distance = calculateDistance(
      fromServer.latitude,
      fromServer.longitude,
      toServer.latitude,
      toServer.longitude
    );
    const baseLatency = 20 + distance * 0.01;

    // Generate historical data points
    const now = Date.now();
    const hours = timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    const interval = timeRange === '1h' ? 60000 : 3600000; // 1min for 1h, 1h for others
    const points = Math.min(hours * (timeRange === '1h' ? 1 : 1), 100); // Max 100 points

    const data: HistoricalLatencyData[] = [];

    for (let i = points; i >= 0; i--) {
      const timestamp = now - i * interval;
      
      // Simulate latency variation over time (sine wave + noise)
      const timeVariation = Math.sin((i / points) * Math.PI * 4) * 0.2;
      const randomNoise = (Math.random() - 0.5) * 0.3;
      const latency = baseLatency * (1 + timeVariation + randomNoise);

      data.push({
        timestamp,
        latency: Math.max(10, Math.round(latency)),
        from,
        to,
      });
    }

    return NextResponse.json({
      success: true,
      data,
      from: fromServer.name,
      to: toServer.name,
    });
  } catch (error) {
    console.error('Error fetching historical latency data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch historical data' },
      { status: 500 }
    );
  }
}

