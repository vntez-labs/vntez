import type { NextConfig } from "next";

const PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL ||
  process.env.NEXT_PUBLIC_WEB_URL ||
  "https://vntez.vercel.app";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/auth"],
  async redirects() {
    return [
      {
        source: "/blog/:slug*",
        destination: `${PORTAL_URL}/blog/:slug*`,
        permanent: false,
      },
      {
        source: "/blogs/:slug*",
        destination: `${PORTAL_URL}/blog/:slug*`,
        permanent: false,
      },
      {
        source: "/blog",
        destination: `${PORTAL_URL}/blog`,
        permanent: false,
      },
      {
        source: "/blogs",
        destination: `${PORTAL_URL}/blog`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
