export interface NodeConfig {
  id: string
  x: number
  y: number
  w: number
  h: number
  title: string
  subtitle: string
}

export interface PathConfig {
  stepId: string
  d: string
}

export const MODULE_NODES: NodeConfig[] = [
  { id: "id", x: 28, y: 24, w: 124, h: 50, title: "VNTEZ IAM", subtitle: "OAuth 2.0 PKCE" },
  { id: "telemetry", x: 208, y: 20, w: 124, h: 50, title: "Telemetry", subtitle: "Crash Sentinel" },
  { id: "storage", x: 388, y: 24, w: 124, h: 50, title: "Edge S3", subtitle: "NVMe Cluster" },
  { id: "pos", x: 28, y: 206, w: 124, h: 50, title: "BMAN POS", subtitle: "Offline SQLite" },
  { id: "logistics", x: 388, y: 206, w: 124, h: 50, title: "WMS Fleet", subtitle: "Smart Routing" },
]

export const PATH_CONFIGS: PathConfig[] = [
  { stepId: "id", d: "M 152 49 C 178 49, 175 126, 195 126" },
  { stepId: "telemetry", d: "M 270 70 L 270 108" },
  { stepId: "storage", d: "M 345 126 C 365 126, 362 49, 388 49" },
  { stepId: "pos", d: "M 152 231 C 178 231, 175 154, 195 154" },
  { stepId: "logistics", d: "M 345 154 C 365 154, 362 231, 388 231" },
]
