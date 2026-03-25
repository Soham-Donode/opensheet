import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['**.*'],
  images: {
    remotePatterns: [
      { hostname: 'img.clerk.com' },
    ],
  },
};

export default nextConfig;
