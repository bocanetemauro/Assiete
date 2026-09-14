import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // Negeer TypeScript-fouten tijdens het bouwen op Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Negeer ESLint-fouten tijdens het bouwen
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;