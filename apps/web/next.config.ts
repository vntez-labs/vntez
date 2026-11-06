import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  async rewrites() {
    return [
      {
        source: "/blogs",
        destination: "/blog",
      },
      {
        source: "/blogs/:path*",
        destination: "/blog/:path*",
      },
    ]
  },
}

export default nextConfig
