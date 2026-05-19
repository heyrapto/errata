import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable cacheComponents to support the Next.js 16 unstable_instant route config
  // @ts-ignore
  cacheComponents: true,
  experimental: {
    // @ts-ignore
    cacheComponents: true,
  }
};

export default nextConfig;
