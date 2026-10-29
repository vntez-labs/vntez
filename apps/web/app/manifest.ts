import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "vntez — Hệ điều hành & Hạ tầng Công nghệ Doanh nghiệp",
    short_name: "vntez",
    description:
      "Hệ sinh thái công nghệ đa tầng: Hạ tầng lưu trữ Edge S3, Định danh OAuth 2.0 PKCE và Bán lẻ Offline-First tại Việt Nam.",
    start_url: "/",
    display: "standalone",
    background_color: "#080c14",
    theme_color: "#fb291a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
