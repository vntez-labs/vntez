import React from "react"

/**
 * Pure Isometric Line-Art Illustrations modeled directly after DuckDB & Stripe.
 * - Sits seamlessly on the card surface (no background boxes, no inner containers).
 * - Floats on the right side of each card with subtle isometric wireframe lines.
 * - Responsive in both Light Mode (slate-300) and Dark Mode (slate-700).
 */

// 1. Storage & Zero-Egress Cloud (Card 1)
export function IsometricStorageArt({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="iso-storage-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f77241" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fb291a" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Isometric Server Rack */}
      <g transform="translate(60, 20)">
        {/* Top Face */}
        <polygon points="40,0 80,20 40,40 0,20" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.02" />
        {/* Left Face */}
        <polygon points="0,20 40,40 40,110 0,90" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.03" />
        {/* Right Face */}
        <polygon points="40,40 80,20 80,90 40,110" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.01" />

        {/* Server Bays Dividers */}
        <line x1="0" y1="42" x2="40" y2="62" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
        <line x1="40" y1="62" x2="80" y2="42" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
        <line x1="0" y1="65" x2="40" y2="85" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
        <line x1="40" y1="85" x2="80" y2="65" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
        <line x1="0" y1="88" x2="40" y2="108" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
        <line x1="40" y1="108" x2="80" y2="88" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />

        {/* LED Lights */}
        <circle cx="15" cy="52" r="2" fill="#10b981" />
        <circle cx="23" cy="56" r="2" fill="#06b6d4" />
        <circle cx="15" cy="75" r="2" fill="#fb291a" />
        <circle cx="23" cy="79" r="2" fill="#10b981" />
      </g>

      {/* Floating S3 Block */}
      <g transform="translate(10, 60)">
        <polygon points="25,0 50,12 25,24 0,12" stroke="url(#iso-storage-grad)" strokeWidth="1.2" fill="#fb291a" fillOpacity="0.06" />
        <polygon points="0,12 25,24 25,36 0,24" stroke="url(#iso-storage-grad)" strokeWidth="1.2" fill="#fb291a" fillOpacity="0.08" />
        <polygon points="25,24 50,12 50,24 25,36" stroke="url(#iso-storage-grad)" strokeWidth="1.2" fill="#fb291a" fillOpacity="0.04" />
      </g>

      <path d="M35 72 Q 70 85 85 95" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="35" cy="72" r="2.5" fill="#10b981" />
      <circle cx="85" cy="95" r="2.5" fill="#10b981" />
    </svg>
  )
}

// 2. Security & Zero-Trust Passkeys (Card 2)
export function IsometricSecurityArt({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="iso-sec-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f77241" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fb291a" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Isometric 3D Security Shield */}
      <g transform="translate(50, 15)">
        {/* Shield Frame in 3D Isometric View */}
        <polygon
          points="50,10 95,30 95,85 50,115 5,85 5,30"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-slate-300 dark:text-slate-700"
          fill="currentColor"
          fillOpacity="0.02"
        />
        {/* Inner Shield Layer with Fiery Gradient */}
        <polygon
          points="50,22 85,38 85,80 50,102 15,80 15,38"
          stroke="url(#iso-sec-grad)"
          strokeWidth="1.4"
          fill="#fb291a"
          fillOpacity="0.05"
        />

        {/* Biometric Thumbprint Scanning Arcs */}
        <path d="M50 42 C40 42 32 50 32 62 C32 74 40 82 50 86" stroke="#f77241" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M50 48 C44 48 38 54 38 63 C38 71 44 77 50 79" stroke="#fb291a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M50 55 C46 55 44 58 44 63 C44 68 47 72 50 74" stroke="#d60238" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M56 52 C64 58 64 68 60 76" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-slate-400 dark:text-slate-600" />
        <path d="M62 44 C72 54 72 70 66 82" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-slate-400 dark:text-slate-600" />

        {/* Laser Scanning Horizon */}
        <line x1="22" y1="62" x2="78" y2="62" stroke="#fb291a" strokeWidth="1.4" strokeDasharray="3 2" />

        {/* Verified Passkey Token Dot */}
        <circle cx="50" cy="102" r="3.5" fill="#10b981" />
        <circle cx="50" cy="102" r="8" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
      </g>
    </svg>
  )
}

// 3. Offline-First Architecture (Card 3)
export function IsometricOfflineArt({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="iso-offline-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Isometric Tablet / POS Screen */}
      <g transform="translate(55, 15)">
        <polygon points="45,0 90,22 45,45 0,22" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.02" />
        <polygon points="0,22 45,45 45,55 0,32" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.03" />
        <polygon points="45,45 90,22 90,32 45,55" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.01" />

        {/* Screen Content Lines */}
        <line x1="20" y1="26" x2="65" y2="38" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="25" y1="32" x2="55" y2="40" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
      </g>

      {/* Isometric Local SQLite Database Cylinder below */}
      <g transform="translate(65, 75)">
        {/* Top Oval */}
        <ellipse cx="35" cy="15" rx="35" ry="14" stroke="url(#iso-offline-grad)" strokeWidth="1.2" fill="#06b6d4" fillOpacity="0.06" />
        {/* Body */}
        <path d="M0 15 L0 45 C0 53 16 59 35 59 C54 59 70 53 70 45 L70 15" stroke="url(#iso-offline-grad)" strokeWidth="1.2" fill="#06b6d4" fillOpacity="0.03" />
        <path d="M0 30 C0 38 16 44 35 44 C54 44 70 38 70 30" stroke="url(#iso-offline-grad)" strokeWidth="1" strokeDasharray="3 2" />

        {/* Sync Status Dot */}
        <circle cx="35" cy="15" r="3" fill="#10b981" />
      </g>

      {/* Bidirectional Circular Sync Path */}
      <path d="M45 45 C25 65 30 100 55 110" stroke="#10b981" strokeWidth="1.4" strokeDasharray="3 3" />
      <polygon points="58,110 52,105 52,115" fill="#10b981" />

      <path d="M150 105 C170 85 165 50 140 40" stroke="#06b6d4" strokeWidth="1.4" strokeDasharray="3 3" />
      <polygon points="137,40 143,35 143,45" fill="#06b6d4" />
    </svg>
  )
}

// 4. Supply Chain & Fleet Dispatch (Card 4 - SIÊU QUAN TRỌNG)
export function IsometricSupplyChainArt({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="iso-route-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Isometric Smart Warehouse Racking (WMS) */}
      <g transform="translate(20, 25)">
        {/* Shelving Frame */}
        <line x1="0" y1="15" x2="0" y2="95" stroke="currentColor" strokeWidth="1.4" className="text-slate-300 dark:text-slate-750" />
        <line x1="40" y1="35" x2="40" y2="115" stroke="currentColor" strokeWidth="1.4" className="text-slate-300 dark:text-slate-750" />
        <line x1="75" y1="18" x2="75" y2="98" stroke="currentColor" strokeWidth="1.4" className="text-slate-300 dark:text-slate-750" />

        {/* Shelves Planes */}
        <polygon points="0,35 40,55 75,38 35,18" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.02" />
        <polygon points="0,65 40,85 75,68 35,48" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.02" />
        <polygon points="0,95 40,115 75,98 35,78" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.02" />

        {/* Isometric Storage Bin 1 (High Velocity - Emerald) */}
        <g transform="translate(10, 36)">
          <polygon points="12,0 24,6 12,12 0,6" fill="#10b981" fillOpacity="0.4" stroke="#10b981" strokeWidth="1" />
          <polygon points="0,6 12,12 12,20 0,14" fill="#10b981" fillOpacity="0.5" stroke="#10b981" strokeWidth="1" />
          <polygon points="12,12 24,6 24,14 12,20" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1" />
        </g>

        {/* Isometric Storage Bin 2 (Cyan) */}
        <g transform="translate(38, 48)">
          <polygon points="12,0 24,6 12,12 0,6" fill="#06b6d4" fillOpacity="0.4" stroke="#06b6d4" strokeWidth="1" />
          <polygon points="0,6 12,12 12,20 0,14" fill="#06b6d4" fillOpacity="0.5" stroke="#06b6d4" strokeWidth="1" />
          <polygon points="12,12 24,6 24,14 12,20" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="1" />
        </g>
      </g>

      {/* Dynamic Delivery Route Curve */}
      <path
        d="M85 85 Q 120 40 150 70 T 180 50"
        stroke="url(#iso-route-grad)"
        strokeWidth="2"
        strokeDasharray="4 3"
      />

      {/* Courier / Vehicle Waypoint */}
      <g transform="translate(135, 58)">
        <circle cx="10" cy="10" r="10" stroke="#10b981" strokeWidth="1.4" fill="currentColor" fillOpacity="0.04" className="text-emerald-500" />
        <circle cx="10" cy="10" r="3" fill="#10b981" />
        <circle cx="10" cy="10" r="7" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
      </g>

      {/* Destination Waypoint Pin */}
      <g transform="translate(170, 32)">
        <circle cx="10" cy="10" r="5" fill="#fb291a" />
        <circle cx="10" cy="10" r="10" stroke="#fb291a" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M10 10 L10 24" stroke="#fb291a" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

// 5. Telemetry & User Behavior Analytics (Card 5)
export function IsometricTelemetryArt({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="iso-funnel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f77241" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Isometric Funnel Layer 1 (Top / Largest) */}
      <g transform="translate(40, 15)">
        <polygon points="55,0 110,25 55,50 0,25" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.02" />
        <polygon points="0,25 55,50 55,62 0,37" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.03" />
        <polygon points="55,50 110,25 110,37 55,62" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.01" />
      </g>

      {/* Isometric Funnel Layer 2 (Middle) */}
      <g transform="translate(55, 60)">
        <polygon points="40,0 80,18 40,36 0,18" stroke="url(#iso-funnel-grad)" strokeWidth="1.2" fill="#f77241" fillOpacity="0.06" />
        <polygon points="0,18 40,36 40,46 0,28" stroke="url(#iso-funnel-grad)" strokeWidth="1.2" fill="#f77241" fillOpacity="0.08" />
        <polygon points="40,36 80,18 80,28 40,46" stroke="url(#iso-funnel-grad)" strokeWidth="1.2" fill="#f77241" fillOpacity="0.04" />
      </g>

      {/* Isometric Funnel Layer 3 (Bottom / Highest Conversion) */}
      <g transform="translate(70, 98)">
        <polygon points="25,0 50,11 25,22 0,11" stroke="#10b981" strokeWidth="1.5" fill="#10b981" fillOpacity="0.12" />
        <polygon points="0,11 25,22 25,30 0,19" stroke="#10b981" strokeWidth="1.5" fill="#10b981" fillOpacity="0.16" />
        <polygon points="25,22 50,11 50,19 25,30" stroke="#10b981" strokeWidth="1.5" fill="#10b981" fillOpacity="0.1" />
      </g>

      <circle cx="95" cy="115" r="3.5" fill="#10b981" />
      <circle cx="95" cy="115" r="8" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />

      {/* Telemetry Sparkline on Left */}
      <path d="M20 70 L35 70 L45 50 L55 85 L65 65 L75 70" stroke="#fb291a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="75" cy="70" r="2" fill="#fb291a" />
    </svg>
  )
}

// 6. Unified Ecosystem & API Mesh (Card 6)
export function IsometricEcosystemArt({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="iso-eco-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Central Interconnected Modular API Block */}
      <g transform="translate(70, 20)">
        <polygon points="30,0 60,15 30,30 0,15" stroke="url(#iso-eco-grad)" strokeWidth="1.2" fill="#a855f7" fillOpacity="0.08" />
        <polygon points="0,15 30,30 30,55 0,40" stroke="url(#iso-eco-grad)" strokeWidth="1.2" fill="#a855f7" fillOpacity="0.12" />
        <polygon points="30,30 60,15 60,40 30,55" stroke="url(#iso-eco-grad)" strokeWidth="1.2" fill="#a855f7" fillOpacity="0.05" />
      </g>

      {/* Left Supporting Node (Commerce & Storage) */}
      <g transform="translate(25, 60)">
        <polygon points="22,0 44,11 22,22 0,11" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.02" />
        <polygon points="0,11 22,22 22,40 0,29" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.03" />
        <polygon points="22,22 44,11 44,29 22,40" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.01" />
      </g>

      {/* Right Supporting Node (Logistics & Fleet) */}
      <g transform="translate(115, 60)">
        <polygon points="22,0 44,11 22,22 0,11" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.02" />
        <polygon points="0,11 22,22 22,40 0,29" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.03" />
        <polygon points="22,22 44,11 44,29 22,40" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" fill="currentColor" fillOpacity="0.01" />
      </g>

      {/* Interconnecting Data Rays */}
      <line x1="47" y1="71" x2="85" y2="52" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1="100" y1="65" x2="125" y2="78" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3 3" />

      {/* Center SDK Hub Connection Dot */}
      <circle cx="100" cy="50" r="3" fill="#a855f7" />
      <circle cx="47" cy="71" r="2.5" fill="#06b6d4" />
      <circle cx="125" cy="78" r="2.5" fill="#10b981" />
    </svg>
  )
}
