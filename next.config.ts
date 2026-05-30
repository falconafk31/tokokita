import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ltotogbctjgwabvdbhmf.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'down-id.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cf.shopee.co.id',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 's.shopee.co.id',
      },
      {
        protocol: 'https',
        hostname: 'shope.ee',
      },
    ],
  },
};

export default nextConfig;
