import { ImageResponse } from "next/og"

export const alt = "VNTEZ Console — Trung tâm Điều hành BaaS & Quản trị Bảo mật"
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
          background: "linear-gradient(135deg, #070a12 0%, #0c121e 50%, #170707 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "550px",
            height: "550px",
            background: "radial-gradient(circle, rgba(251, 41, 26, 0.22) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
        />

        {/* Top Header: Logo & Status Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 16 22 L 38 22 L 52 74 L 40 86 L 16 22 Z" fill="#fb291a" />
              <path d="M 40 86 L 52 74 L 72 40 L 84 40 L 54 86 L 40 86 Z" fill="#fb291a" />
              <path d="M 64 22 L 86 22 L 75 38 L 53 38 L 64 22 Z" fill="#ff7a50" />
              <path d="M 75 20 L 92 20 L 81 32 L 67 32 L 75 20 Z" fill="#ff7a50" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", fontFamily: "monospace", letterSpacing: "0.15em", color: "#fb291a", textTransform: "uppercase" }}>
                Management Console
              </span>
              <span style={{ fontSize: "32px", fontWeight: "bold", letterSpacing: "-0.03em" }}>
                VNTEZ <span style={{ color: "#fb291a" }}>CONSOLE</span>
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              color: "#10b981",
              fontSize: "13px",
              fontFamily: "monospace",
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#10b981",
              }}
            />
            <span>v1.4 Production Ready</span>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "980px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Bảng Điều Khiển Quản Trị <br />
            <span style={{ color: "#fb291a" }}>Hạ Tầng BaaS & Dịch Vụ Biên.</span>
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "#94a3b8",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Quản trị cụm máy chủ Edge S3 NVMe, điều phối phiên định danh OAuth 2.0 PKCE và theo dõi trạng thái hệ thống theo thời gian thực.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "28px", fontSize: "14px", color: "#cbd5e1" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              ⚡ OAuth 2.0 PKCE Gateway
            </span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              📦 Cụm NVMe HAN-01 / SGN-02
            </span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              🔄 Real-time Telemetry
            </span>
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              fontFamily: "monospace",
            }}
          >
            vntez-console.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
