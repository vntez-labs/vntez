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
            d="M 12 18 L 36 18 L 52 74 L 38 88 L 12 18 Z"
            fill="#fb291a"
          />
          <path
            d="M 38 88 L 52 74 L 74 38 L 86 38 L 54 88 L 38 88 Z"
            fill="#fb291a"
          />
          <path
            d="M 64 20 L 88 20 L 76 38 L 52 38 L 64 20 Z"
            fill="#ff7a50"
          />
          <path
            d="M 76 18 L 94 18 L 82 32 L 68 32 L 76 18 Z"
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
