import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.smileagrimarket.com",
        pathname: "/api/v1/upload/**",
      },
      {
        protocol: "http",
        hostname: "app.smileagrimarket.com",
        pathname: "/api/v1/upload/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
