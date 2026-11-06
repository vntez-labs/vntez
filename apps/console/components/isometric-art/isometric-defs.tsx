import React from "react";

export function IsometricDefs() {
  return (
    <defs>
      {/* Gradients for Pipelines */}
      <linearGradient id="pipe-auth-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f77241" />
        <stop offset="100%" stopColor="#fb291a" />
      </linearGradient>

      <linearGradient id="pipe-storage-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>

      <linearGradient id="pipe-sync-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>

      {/* Server Metal Surface */}
      <linearGradient id="server-top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e2640" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>

      <linearGradient id="server-left-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#141a2e" />
        <stop offset="100%" stopColor="#0a0f1d" />
      </linearGradient>

      <linearGradient id="server-right-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0f1424" />
        <stop offset="100%" stopColor="#060913" />
      </linearGradient>

      {/* Core BaaS Platform Plate */}
      <linearGradient id="baas-plate-rim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#fb291a" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  );
}
