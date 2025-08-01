import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages configuration
  serverExternalPackages: ['@prisma/client'],
  
  // Turbopack configuration
  turbopack: {
    resolveAlias: {}
  },
  
  // Set output directory
  distDir: '.next',
};

export default nextConfig;