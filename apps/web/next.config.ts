import type { NextConfig } from "next"

const DOCS_BASE_URL =
  process.env.NEXT_PUBLIC_DOCS_URL || "https://vntez-docs.vercel.app"

const LEGAL_BASE_URL =
  process.env.NEXT_PUBLIC_LEGAL_URL || "https://vntez-legal.vercel.app"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  async redirects() {
    return [
      {
        source: "/docs",
        destination: `${DOCS_BASE_URL}/docs/workers-hub`,
        permanent: false,
      },
      {
        source: "/docs/:appId((?!openapi)[^/]+)",
        destination: `${DOCS_BASE_URL}/docs/:appId`,
        permanent: false,
      },
      {
        source: "/docs/:appId((?!openapi)[^/]+)/:slug*",
        destination: `${DOCS_BASE_URL}/docs/:appId/:slug*`,
        permanent: false,
      },
      {
        source: "/legal/:appId/:slug*",
        destination: `${LEGAL_BASE_URL}/:appId/:slug*`,
        permanent: false,
      },
    ]
  },
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
