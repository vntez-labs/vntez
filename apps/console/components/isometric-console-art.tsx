import React from "react";
import { IsometricDefs } from "./isometric-art/isometric-defs";
import { IsometricPipes } from "./isometric-art/isometric-pipes";
import { IsometricServers } from "./isometric-art/isometric-servers";

/**
 * Pure Vector Isometric BaaS Architecture & Pipeline Graphic
 * Visualizing the VNTEZ Backend-as-a-Service Engine:
 * - Dual Server Cluster Racks (HAN-01 & SGN-02) with NVMe drives and LED arrays
 * - Central Tiered BaaS Engine (API Gateway, Event Stream, Persistence)
 * - Multi-Channel Data Pipelines (Auth PKCE, S3 Storage, SQLite WAL, Telemetry)
 * - Razor-sharp SVG vectors, infinite resolution, zero blurriness
 */
export function IsometricConsoleArt({
  className = "w-full h-auto max-w-lg",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 540 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="VNTEZ BaaS Architecture & Pipelines"
    >
      <IsometricDefs />
      <IsometricPipes />
      <IsometricServers />
    </svg>
  );
}
