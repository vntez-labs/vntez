import React from "react";

export function IsometricPipes() {
  return (
    <>
      {/* 1. PIPELINE BUS CONDUITS */}
      {/* Pipeline 1: Auth & Token Bus (Coral-Red, Top to Center Hub) */}
      <path
        d="M 120 120 L 270 205 L 270 260"
        stroke="url(#pipe-auth-grad)"
        strokeWidth="2"
        strokeDasharray="5 3"
        strokeLinecap="round"
      />
      <circle cx="200" cy="165" r="3" fill="#fb291a" />

      {/* Pipeline 2: S3 Storage & NVMe Bus (Violet-Purple, Left Rack to Center) */}
      <path
        d="M 125 240 L 220 295 L 270 295"
        stroke="url(#pipe-storage-grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="170" cy="265" r="3.5" fill="#c084fc" />

      {/* Pipeline 3: Database & WAL Sync Bus (Cyan-Emerald, Right Rack to Center) */}
      <path
        d="M 415 240 L 320 295 L 270 295"
        stroke="url(#pipe-sync-grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="370" cy="265" r="3.5" fill="#06b6d4" />

      {/* Pipeline 4: Telemetry & Event Stream (Cyan-Emerald, Center to Bottom Node) */}
      <path
        d="M 270 370 L 270 430 L 150 495"
        stroke="url(#pipe-sync-grad)"
        strokeWidth="2"
        strokeDasharray="6 3"
        strokeLinecap="round"
      />
      <circle cx="210" cy="460" r="3" fill="#10b981" />

      {/* Pipeline 5: Realtime WebSocket (Violet, Center to Right Bottom Node) */}
      <path
        d="M 270 370 L 270 430 L 390 495"
        stroke="url(#pipe-storage-grad)"
        strokeWidth="2"
        strokeDasharray="6 3"
        strokeLinecap="round"
      />
      <circle cx="330" cy="460" r="3" fill="#c084fc" />

      {/* 5. SATELLITE PIPELINE NODES (AUTH, STORAGE, SQL, TELEMETRY) */}
      {/* Top Node: Auth Pipeline (OAuth 2.0 PKCE) */}
      <g transform="translate(120, 105)">
        <rect x="-48" y="-12" width="96" height="24" rx="6" fill="#090d16" stroke="#fb291a" strokeWidth="1.2" />
        <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#fb291a">
          ⚡ AUTH.PKCE
        </text>
      </g>

      {/* Bottom-Left Node: SQLite & Offline Sync Pipeline */}
      <g transform="translate(130, 500)">
        <rect x="-55" y="-12" width="110" height="24" rx="6" fill="#090d16" stroke="#10b981" strokeWidth="1.2" />
        <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#10b981">
          🔄 SQLITE.WAL.SYNC
        </text>
      </g>

      {/* Bottom-Right Node: S3 Object Storage Pipeline */}
      <g transform="translate(410, 500)">
        <rect x="-55" y="-12" width="110" height="24" rx="6" fill="#090d16" stroke="#c084fc" strokeWidth="1.2" />
        <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#c084fc">
          📦 S3.NVME.PIPE
        </text>
      </g>
    </>
  );
}
