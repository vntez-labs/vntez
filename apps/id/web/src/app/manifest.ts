import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VNTEZ ID — Nền tảng Định danh Tập trung & OAuth 2.0 SSO",
    short_name: "VNTEZ ID",
    description:
      "Cổng định danh và xác thực tập trung cho toàn bộ hệ sinh thái kỹ thuật số VNTEZ.",
    start_url: "/",
    display: "standalone",
    background_color: "#090D16",
    theme_color: "#6366F1",
    categories: ["utilities", "security", "developer"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logo-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
