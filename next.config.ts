import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['127.0.0.1', '0.0.0.0', '10.12.118.189'],
  images: {
    remotePatterns: [
      { hostname: 'img.clerk.com' },
    ],
  },
};

export default nextConfig;
