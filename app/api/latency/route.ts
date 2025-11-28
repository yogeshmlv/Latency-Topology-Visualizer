/**
 * API route for real-time latency data
 * Returns mock latency data between exchange servers
 */

import { NextResponse } from 'next/server';
import { EXCHANGE_SERVERS } from '@/lib/data';
import { LatencyData } from '@/types';
import { getLatencyStatus, calculateDistance } from '@/lib/utils';

/**
 * Generate mock latency data based on distance and random variation
 */
function generateLatencyData(): LatencyData[] {
  const data: LatencyData[] = [];
  const now = Date.now();

  for (let i = 0; i < EXCHANGE_SERVERS.length; i++) {
    for (let j = i + 1; j < EXCHANGE_SERVERS.length; j++) {
      const from = EXCHANGE_SERVERS[i];
      const to = EXCHANGE_SERVERS[j];

      // Calculate base latency from distance (roughly 1ms per 100km + base 20ms)
      const distance = calculateDistance(
        from.latitude,
        from.longitude,
        to.latitude,
        to.longitude
      );
      const baseLatency = 20 + distance * 0.01;

      // Add random variation (±20%)
      const variation = (Math.random() - 0.5) * 0.4;
      const latency = Math.max(10, baseLatency * (1 + variation));

      data.push({
        from: from.id,
        to: to.id,
        latency: Math.round(latency),
        timestamp: now,
        status: getLatencyStatus(latency),
      });
    }
  }

  return data;
}

export async function GET() {
  try {
    // In production, this would fetch from Cloudflare Radar API or similar
    // For now, we return mock data
    const latencyData = generateLatencyData();

    return NextResponse.json({
      success: true,
      data: latencyData,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching latency data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch latency data' },
      { status: 500 }
    );
  }
}

