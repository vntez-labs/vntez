import {
  vntezIdOverviewSection,
  vntezIdTokenSection,
  vntezIdUserinfoSection,
  vntezIdDiscoverySection,
  vntezIdAiPromptSection,
} from "./sections/vntez-iam";
import {
  workersListSection,
  workersTelemetrySection,
  workersDispatchSection,
  workersPurgeCacheSection,
} from "./sections/workers-hub";
import {
  solotypeScoreSection,
  solotypeLeaderboardSection,
} from "./sections/solotype";
import {
  bonsaiLibrarySection,
  bonsaiProgressSection,
} from "./sections/bonsai-reader";
import {
  gitvnReposSection,
  gitvnIssuesSection,
  gitvnWikiSection,
} from "./sections/gitvn";
import type { DocSection, AppFilter } from "./types";

export * from "./types";
export * from "./ai-prompt-data";

export const DOC_SECTIONS: DocSection[] = [
  // 1. Workers Hub
  workersListSection,
  workersTelemetrySection,
  workersDispatchSection,
  workersPurgeCacheSection,

  // 2. VNTEZ IAM
  vntezIdOverviewSection,
  vntezIdTokenSection,
  vntezIdUserinfoSection,
  vntezIdDiscoverySection,
  vntezIdAiPromptSection,

  // 3. SoloType
  solotypeScoreSection,
  solotypeLeaderboardSection,

  // 4. Bonsai Reader
  bonsaiLibrarySection,
  bonsaiProgressSection,

  // 5. GitVN
  gitvnReposSection,
  gitvnIssuesSection,
  gitvnWikiSection,
];

export const APP_FILTERS: AppFilter[] = [
  { id: "workers-hub", label: "Workers Hub (Edge Cloud)", version: "v2.1.0", color: "#f59e0b" },
  { id: "vntez-iam", label: "VNTEZ IAM (SSO & RBAC)", version: "v2.5.0", color: "#fb291a" },
  { id: "solotype", label: "SoloType (Typing Engine)", version: "v1.2.0", color: "#0284c7" },
  { id: "bonsai-reader", label: "Bonsai Reader (ePub/MDX)", version: "v1.0.4", color: "#10b981" },
  { id: "gitvn", label: "GitVN (Zero-Friction Git)", version: "v1.0.0", color: "#6366f1" },
];
