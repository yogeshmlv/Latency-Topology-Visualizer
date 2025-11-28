/**
 * Utility functions for the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert latitude/longitude to 3D coordinates on a sphere
 */
export function latLonToVector3(lat: number, lon: number, radius: number = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return { x, y, z };
}

/**
 * Get color based on latency value
 */
export function getLatencyColor(latency: number): string {
  if (latency < 50) return '#10b981'; // green
  if (latency < 150) return '#f59e0b'; // yellow
  return '#ef4444'; // red
}

/**
 * Get latency status
 */
export function getLatencyStatus(latency: number): 'good' | 'warning' | 'critical' {
  if (latency < 50) return 'good';
  if (latency < 150) return 'warning';
  return 'critical';
}

/**
 * Format latency value for display
 */
export function formatLatency(latency: number): string {
  return `${latency.toFixed(0)}ms`;
}

/**
 * Calculate distance between two points on Earth (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

