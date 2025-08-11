import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
    // For static export deployment (uncomment the line below if deploying to shared hosting)
    // unoptimized: true,
  },
  
  // Uncomment these lines for static export to GoDaddy shared hosting
  // output: 'export',
  // trailingSlash: true,
  
  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
};

export default nextConfig;
