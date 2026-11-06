import React from "react";

export function IsometricServers() {
  return (
    <>
      {/* 2. SERVER RACK 1 (HAN-01: Hanoi Storage & DB Cluster) */}
      <g transform="translate(60, 160)">
        <polygon
          points="40,0 80,20 40,40 0,20"
          fill="url(#server-top-grad)"
          stroke="#334155"
          strokeWidth="1.2"
        />
        <polygon
          points="0,20 40,40 40,135 0,115"
          fill="url(#server-left-grad)"
          stroke="#334155"
          strokeWidth="1.2"
        />
        <polygon
          points="40,40 80,20 80,115 40,135"
          fill="url(#server-right-grad)"
          stroke="#334155"
          strokeWidth="1.2"
        />

        <line x1="0" y1="42" x2="40" y2="62" stroke="#475569" strokeWidth="1" />
        <line x1="0" y1="65" x2="40" y2="85" stroke="#475569" strokeWidth="1" />
        <line x1="0" y1="88" x2="40" y2="108" stroke="#475569" strokeWidth="1" />

        <circle cx="12" cy="52" r="2" fill="#10b981" />
        <circle cx="20" cy="56" r="2" fill="#06b6d4" />
        <circle cx="12" cy="75" r="2" fill="#fb291a" />
        <circle cx="20" cy="79" r="2" fill="#10b981" />
        <circle cx="12" cy="98" r="2" fill="#10b981" />
        <circle cx="20" cy="102" r="2" fill="#10b981" />

        <rect x="-8" y="125" width="96" height="20" rx="6" fill="#090d16" stroke="#fb291a" strokeWidth="1" />
        <text x="40" y="139" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#fb291a">
          SERVER: HAN-01
        </text>
      </g>

      {/* 3. SERVER RACK 2 (SGN-02: Saigon Replication & POS Mesh) */}
      <g transform="translate(400, 160)">
        <polygon
          points="40,0 80,20 40,40 0,20"
          fill="url(#server-top-grad)"
          stroke="#334155"
          strokeWidth="1.2"
        />
        <polygon
          points="0,20 40,40 40,135 0,115"
          fill="url(#server-left-grad)"
          stroke="#334155"
          strokeWidth="1.2"
        />
        <polygon
          points="40,40 80,20 80,115 40,135"
          fill="url(#server-right-grad)"
          stroke="#334155"
          strokeWidth="1.2"
        />

        <line x1="40" y1="62" x2="80" y2="42" stroke="#475569" strokeWidth="1" />
        <line x1="40" y1="85" x2="80" y2="65" stroke="#475569" strokeWidth="1" />
        <line x1="40" y1="108" x2="80" y2="88" stroke="#475569" strokeWidth="1" />

        <circle cx="60" cy="52" r="2" fill="#10b981" />
        <circle cx="68" cy="48" r="2" fill="#06b6d4" />
        <circle cx="60" cy="75" r="2" fill="#10b981" />
        <circle cx="68" cy="71" r="2" fill="#10b981" />
        <circle cx="60" cy="98" r="2" fill="#fb291a" />
        <circle cx="68" cy="94" r="2" fill="#10b981" />

        <rect x="-8" y="125" width="96" height="20" rx="6" fill="#090d16" stroke="#06b6d4" strokeWidth="1" />
        <text x="40" y="139" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#06b6d4">
          SERVER: SGN-02
        </text>
      </g>

      {/* 4. CENTRAL BAAS ENGINE PLATFORM (TIERED ISOMETRIC CORE) */}
      <g transform="translate(270, 360) scale(1, 0.58) rotate(-45)">
        <rect
          x="-95"
          y="-95"
          width="190"
          height="190"
          rx="32"
          fill="#3b0764"
          fillOpacity="0.4"
          stroke="url(#baas-plate-rim)"
          strokeWidth="2"
        />
        <rect
          x="-95"
          y="-110"
          width="190"
          height="190"
          rx="32"
          fill="#0c101d"
          stroke="url(#baas-plate-rim)"
          strokeWidth="2.2"
        />
      </g>

      {/* Layer 2: Middle Pipeline Engine Bus */}
      <g transform="translate(270, 290) scale(1, 0.58) rotate(-45)">
        <rect
          x="-80"
          y="-80"
          width="160"
          height="160"
          rx="26"
          fill="#1e1b4b"
          fillOpacity="0.4"
          stroke="url(#baas-plate-rim)"
          strokeWidth="1.8"
        />
      </g>

      {/* Layer 3: Top API Gateway Wireframe */}
      <g transform="translate(270, 220) scale(1, 0.58) rotate(-45)">
        <rect
          x="-65"
          y="-65"
          width="130"
          height="130"
          rx="22"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.6"
          strokeOpacity="0.6"
        />
      </g>

      {/* Glowing VNTEZ Brand V-Mark in Core Center */}
      <g transform="translate(270, 280)">
        <path d="M -14 -10 L -4 -10 L 0 10 L -4 14 L -14 -10 Z" fill="url(#pipe-auth-grad)" />
        <path d="M -4 14 L 0 10 L 8 -2 L 14 -2 L 2 14 L -4 14 Z" fill="url(#pipe-auth-grad)" />
        <path d="M 9 -10 L 17 -10 L 12 -4 L 5 -4 L 9 -10 Z" fill="#ff7a50" />
      </g>

      {/* Central BaaS Label */}
      <text
        x="270"
        y="315"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="11"
        fontWeight="bold"
        fill="#ffffff"
        letterSpacing="0.1em"
      >
        VNTEZ BaaS CORE
      </text>
    </>
  );
}
