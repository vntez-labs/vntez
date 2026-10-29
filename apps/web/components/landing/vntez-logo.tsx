import React from "react"

interface VntezLogoProps {
  className?: string
  size?: number
}

/**
 * Official VNTEZ V-Logo Mark
 * Fiery coral-red-crimson gradient matching the official VNTEZ LABS brand
 */
export function VntezLogo({ className = "", size = 32 }: VntezLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="vntez logo"
    >
      <defs>
        <linearGradient
          id="vntez-fire-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f77241" />
          <stop offset="35%" stopColor="#fb291a" />
          <stop offset="70%" stopColor="#e3062a" />
          <stop offset="100%" stopColor="#b60343" />
        </linearGradient>

        <linearGradient
          id="vntez-accent-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ff7a50" />
          <stop offset="100%" stopColor="#eb0c29" />
        </linearGradient>
      </defs>

      {/* Main Stylized 'V' Wing Left */}
      <path
        d="M 12 18 L 36 18 L 52 74 L 38 88 L 12 18 Z"
        fill="url(#vntez-fire-gradient)"
      />

      {/* Stylized Right Upward Arm */}
      <path
        d="M 38 88 L 52 74 L 74 38 L 86 38 L 54 88 L 38 88 Z"
        fill="url(#vntez-fire-gradient)"
      />

      {/* Top-Right Dynamic Accent Slash / Dot */}
      <path
        d="M 76 18 L 94 18 L 82 32 L 68 32 L 76 18 Z"
        fill="url(#vntez-accent-gradient)"
      />
    </svg>
  )
}
