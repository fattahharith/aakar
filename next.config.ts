import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  webpack: (config) => {
    // Add custom webpack configurations to support Pixi.js if needed
    return config;
  },
};

export default nextConfig;
