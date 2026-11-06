import {
  vntezIdOverviewSection,
  vntezIdTokenSection,
  vntezIdUserinfoSection,
  vntezIdDiscoverySection,
  vntezIdAiPromptSection,
} from "./sections/vntez-id"
import {
  storagePutSection,
  storageGetSection,
  storageDeleteSection,
} from "./sections/storage"
import { posSection } from "./sections/pos"
import { wmsSection } from "./sections/wms"
import { telemetrySection } from "./sections/telemetry"
import { sdkSection } from "./sections/sdk"
import type { DocSection, AppFilter } from "./types"

export * from "./types"
export * from "./ai-prompt-data"

export const DOC_SECTIONS: DocSection[] = [
  vntezIdOverviewSection,
  vntezIdTokenSection,
  vntezIdUserinfoSection,
  vntezIdDiscoverySection,
  vntezIdAiPromptSection,
  storagePutSection,
  storageGetSection,
  storageDeleteSection,
  posSection,
  wmsSection,
  telemetrySection,
  sdkSection,
]

export const APP_FILTERS: AppFilter[] = [
  { id: "vntez-id", label: "vntez-id (SSO & OAuth)", version: "v2.4.0", color: "#fb291a" },
  { id: "storage", label: "vntez Storage (S3 API)", version: "v1.8.2", color: "#0284c7" },
  { id: "bman-pos", label: "BMAN POS (Offline-First)", version: "v3.1.0", color: "#059669" },
  { id: "supply-chain", label: "vntez WMS (Logistics)", version: "v2.0.1", color: "#d97706" },
  { id: "telemetry", label: "vntez Telemetry", version: "v1.4.5", color: "#8b5cf6" },
  { id: "ecosystem", label: "vntez SDK & Tools", version: "v4.0.0", color: "#ec4899" },
]
