import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  
  // Build production without lint
  /*eslint: {
    ignoreDuringBuilds: true,
  }*/
};

export default nextConfig;
