import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#090D16",
        borderRadius: 36,
        padding: 24,
      }}
    >
      <svg
        width="132"
        height="132"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>VNTEZ ID</title>
        <defs>
          <linearGradient
            id="vntez-grad-apple"
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
          stroke="url(#vntez-grad-apple)"
          strokeWidth="2.5"
        />
        <path
          d="M14 15L24 33L34 15H29L24 25.5L19 15H14Z"
          fill="url(#vntez-grad-apple)"
        />
        <circle cx="24" cy="20" r="2.2" fill="#06B6D4" />
        <circle cx="34" cy="34" r="2.5" fill="#06B6D4" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
