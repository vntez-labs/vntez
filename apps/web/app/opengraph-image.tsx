import { ImageResponse } from "next/og"

export const alt = "vntez — Hệ điều hành & Hạ tầng Công nghệ Doanh nghiệp"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #080c14 0%, #0f1626 50%, #1a0808 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern background simulation */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(251, 41, 26, 0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Top Header: Logo + Brand Tag */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 12 18 L 36 18 L 52 74 L 38 88 L 12 18 Z" fill="#fb291a" />
              <path d="M 38 88 L 52 74 L 74 38 L 86 38 L 54 88 L 38 88 Z" fill="#fb291a" />
              <path d="M 64 20 L 88 20 L 76 38 L 52 38 L 64 20 Z" fill="#ff7a50" />
            </svg>
            <span style={{ fontSize: "36px", fontWeight: "bold", letterSpacing: "-0.04em" }}>
              vntez
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "999px",
              background: "rgba(251, 41, 26, 0.15)",
              border: "1px solid rgba(251, 41, 26, 0.4)",
              color: "#fb291a",
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Hạ tầng Công nghệ Doanh nghiệp
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "950px" }}>
          <h1
            style={{
              fontSize: "58px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Những gì doanh nghiệp bạn <br />
            <span style={{ color: "#fb291a" }}>thực sự cần.</span>
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Hợp nhất lưu trữ Edge S3 NVMe, định danh OAuth 2.0 PKCE và giải pháp bán lẻ Offline-First tại Việt Nam.
          </p>
        </div>

        {/* Bottom Feature Tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "28px",
            fontSize: "15px",
            color: "#cbd5e1",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
            <span>Độ trễ &lt; 15ms</span>
          </div>
          <span>•</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#06b6d4" }} />
            <span>Offline-First SQLite</span>
          </div>
          <span>•</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fb291a" }} />
            <span>RFC 7636 PKCE</span>
          </div>
          <span>•</span>
          <div style={{ marginLeft: "auto", color: "#64748b", fontFamily: "monospace" }}>
            vntez.net
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
