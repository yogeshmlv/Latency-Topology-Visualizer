import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  reactStrictMode: true,
  // Turbopack is enabled by default in Next.js 16
  // Three.js and react-three-fiber work without additional config
};

export default nextConfig;
