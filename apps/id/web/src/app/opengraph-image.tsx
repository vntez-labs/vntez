import { ImageResponse } from "next/og";

export const alt = "VNTEZ ID — Nền tảng Định danh & SSO Hợp nhất";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#090D16",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.25) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 45%)",
        position: "relative",
        padding: "60px 80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: 32,
          padding: "50px 60px",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>VNTEZ ID Logo</title>
              <defs>
                <linearGradient
                  id="vntez-og-grad"
                  x1="4"
                  y1="4"
                  x2="44"
                  y2="44"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="45%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <rect
                x="4"
                y="4"
                width="40"
                height="40"
                rx="12"
                fill="#090D16"
                stroke="url(#vntez-og-grad)"
                strokeWidth="2.5"
              />
              <path
                d="M14 15L24 33L34 15H29L24 25.5L19 15H14Z"
                fill="url(#vntez-og-grad)"
              />
              <circle cx="24" cy="20" r="2.2" fill="#06B6D4" />
              <circle cx="34" cy="34" r="2.5" fill="#06B6D4" />
            </svg>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              VNTEZ ID
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid rgba(6, 182, 212, 0.4)",
              backgroundColor: "rgba(6, 182, 212, 0.1)",
              color: "#06B6D4",
              fontSize: 13,
              fontFamily: "monospace",
            }}
          >
            <span>vntez-id.vercel.app</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: 780,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            Một định danh cho toàn bộ hệ sinh thái của bạn
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#94A3B8",
              lineHeight: 1.5,
              maxWidth: 620,
            }}
          >
            Nền tảng xác thực OAuth 2.0 PKCE & Single Sign-On thế hệ mới.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: 24,
            fontSize: 14,
            color: "#64748B",
            fontFamily: "monospace",
          }}
        >
          <span>Single Sign-On • OAuth 2.0 • PKCE</span>
          <span>VNTEZ Identity Platform</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
