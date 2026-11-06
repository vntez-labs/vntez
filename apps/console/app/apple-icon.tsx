import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080c14",
          borderRadius: "36px",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 16 22 L 38 22 L 52 74 L 40 86 L 16 22 Z"
            fill="#fb291a"
          />
          <path
            d="M 40 86 L 52 74 L 72 40 L 84 40 L 54 86 L 40 86 Z"
            fill="#fb291a"
          />
          <path
            d="M 64 22 L 86 22 L 75 38 L 53 38 L 64 22 Z"
            fill="#ff7a50"
          />
          <path
            d="M 75 20 L 92 20 L 81 32 L 67 32 L 75 20 Z"
            fill="#ff7a50"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
