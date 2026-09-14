import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // Negeer TypeScript-fouten tijdens het bouwen op Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;