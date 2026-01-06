
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['dilithium-crystals-js'],
  // transpilePackages: ['dilithium-crystals-js'] // Removed due to conflict with serverExternalPackages
};


export default nextConfig;
