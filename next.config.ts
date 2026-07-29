import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-73471107a4c3408d88f6f5d1de9aed54.r2.dev",
      },
    ],
  },
};

export default nextConfig;