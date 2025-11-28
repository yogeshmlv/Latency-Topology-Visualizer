'use client';

/**
 * 3D World Map Component using react-three-fiber
 * Displays exchange servers and latency connections on a 3D globe
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { EXCHANGE_SERVERS, CLOUD_REGIONS } from '@/lib/data';
import { latLonToVector3, getLatencyColor } from '@/lib/utils';
import { ExchangeServer, CloudRegion, LatencyData } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface ExchangeMarkerProps {
  server: ExchangeServer;
  isSelected: boolean;
  onClick: () => void;
}

function ExchangeMarker({ server, isSelected, onClick }: ExchangeMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = latLonToVector3(server.latitude, server.longitude, 1.01);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh ref={meshRef} onClick={onClick} onPointerOver={(e) => {
        console.log('pointer over');
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }} onPointerOut={() => {
        console.log('pointer out');
        document.body.style.cursor = 'default';
      }}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#3b82f6' : '#ef4444'}
          emissive={isSelected ? '#3b82f6' : '#ef4444'}
          emissiveIntensity={0.5}
        />
      </mesh>
      {isSelected && (
        <Text
          position={[0, 0.05, 0]}
          fontSize={0.02}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {server.name}
        </Text>
      )}
    </group>
  );
}

interface CloudRegionMarkerProps {
  region: CloudRegion;
}

function CloudRegionMarker({ region }: CloudRegionMarkerProps) {
  const position = latLonToVector3(region.latitude, region.longitude, 1.005);
  const color = region.provider === 'AWS' ? '#ff9900' : region.provider === 'GCP' ? '#4285f4' : '#0078d4';

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

interface LatencyConnectionProps {
  from: ExchangeServer;
  to: ExchangeServer;
  latency: number;
  opacity?: number;
}

function LatencyConnection({ from, to, latency, opacity = 0.6 }: LatencyConnectionProps) {
  const fromPos = latLonToVector3(from.latitude, from.longitude, 1.01);
  const toPos = latLonToVector3(to.latitude, to.longitude, 1.01);

  const points = useMemo(() => {
    // Create a curved line using quadratic bezier
    const midPoint = {
      x: (fromPos.x + toPos.x) / 2,
      y: (fromPos.y + toPos.y) / 2 + 0.2,
      z: (fromPos.z + toPos.z) / 2,
    };

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(fromPos.x, fromPos.y, fromPos.z),
      new THREE.Vector3(midPoint.x, midPoint.y, midPoint.z),
      new THREE.Vector3(toPos.x, toPos.y, toPos.z)
    );

    return curve.getPoints(50);
  }, [fromPos, toPos]);

  const color = getLatencyColor(latency);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={2}
      opacity={opacity}
      transparent
    />
  );
}

interface WorldMapProps {
  latencyData: LatencyData[];
}

export default function WorldMap({ latencyData }: WorldMapProps) {
  const { filters, selectedExchange, setSelectedExchange } = useAppStore();
  const controlsRef = useRef<any>(null);

  // Filter exchanges based on selected filters
  const visibleExchanges = useMemo(() => {
    return EXCHANGE_SERVERS.filter((server) => {
      if (filters.selectedExchanges.length > 0 && !filters.selectedExchanges.includes(server.id)) {
        return false;
      }
      if (filters.selectedCloudProviders.length > 0 && !filters.selectedCloudProviders.includes(server.cloudProvider)) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Filter latency connections
  const visibleConnections = useMemo(() => {
    if (!filters.showConnections) return [];

    return latencyData
      .filter((conn) => {
        const fromVisible = visibleExchanges.some((e) => e.id === conn.from);
        const toVisible = visibleExchanges.some((e) => e.id === conn.to);
        return fromVisible && toVisible && 
               conn.latency >= filters.latencyThreshold.min &&
               conn.latency <= filters.latencyThreshold.max;
      })
      .map((conn) => {
        const from = EXCHANGE_SERVERS.find((e) => e.id === conn.from)!;
        const to = EXCHANGE_SERVERS.find((e) => e.id === conn.to)!;
        return { from, to, latency: conn.latency };
      });
  }, [latencyData, visibleExchanges, filters]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Earth Globe */}
        <Sphere args={[1, 64, 64]}>
          <meshStandardMaterial
            color="#1e40af"
            roughness={0.8}
            metalness={0.2}
          />
        </Sphere>

        {/* Grid/Continents visualization */}
        <Sphere args={[1.001, 32, 32]}>
          <meshStandardMaterial
            color="#0f172a"
            wireframe
            opacity={0.3}
            transparent
          />
        </Sphere>

        {/* Exchange Server Markers */}
        {visibleExchanges.map((server) => (
          <ExchangeMarker
            key={server.id}
            server={server}
            isSelected={selectedExchange === server.id}
            onClick={() => setSelectedExchange(selectedExchange === server.id ? null : server.id)}
          />
        ))}

        {/* Cloud Region Markers */}
        {filters.showCloudRegions && CLOUD_REGIONS.map((region) => (
          <CloudRegionMarker key={region.id} region={region} />
        ))}

        {/* Latency Connections */}
        {visibleConnections.map((conn, idx) => (
          <LatencyConnection
            key={`${conn.from.id}-${conn.to.id}-${idx}`}
            from={conn.from}
            to={conn.to}
            latency={conn.latency}
          />
        ))}

        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          minDistance={1.5}
          maxDistance={5}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

