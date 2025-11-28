/**
 * Core type definitions for the Latency Topology Visualizer
 */

export interface ExchangeServer {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
  cloudProvider: 'AWS' | 'GCP' | 'Azure' | 'Other';
  country: string;
  city: string;
}

export interface LatencyData {
  from: string; // Exchange ID
  to: string; // Exchange ID
  latency: number; // milliseconds
  timestamp: number;
  status: 'good' | 'warning' | 'critical';
}

export interface HistoricalLatencyData {
  timestamp: number;
  latency: number;
  from: string;
  to: string;
}

export interface CloudRegion {
  id: string;
  name: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  latitude: number;
  longitude: number;
  region: string;
}

export interface FilterState {
  selectedExchanges: string[];
  selectedCloudProviders: string[];
  latencyThreshold: {
    min: number;
    max: number;
  };
  showCloudRegions: boolean;
  showConnections: boolean;
}

export interface AppState {
  theme: 'light' | 'dark';
  filters: FilterState;
  selectedExchange: string | null;
  isPlaying: boolean;
  timeRange: '1h' | '24h' | '7d' | '30d';
}

