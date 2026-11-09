export interface DashboardSummary {
  totalRequests: number;
  requestsThisWeek?: number;
  requestsTrendPct: number;
  successRate: string;
  latencyMs: number;
  totalApps: number;
  activeApps: number;
  totalUsers: number;
  userEmail?: string;
  newUsersThisWeek: number;
  weeklyGrowthPct: number;
  activeToday: number;
  totalPosts?: number;
  totalViews?: number;
  totalLikes?: number;
  totalComments?: number;
}

export interface InfrastructureStats {
  totalRequests: number;
  successRate: string;
  window: string;
  services: {
    apiGateway: { requests: number; warnings: number; errors: number };
    postgres: { requests: number; warnings: number; errors: number };
    auth: { requests: number; warnings: number; errors: number };
    storage: { requests: number; warnings: number; errors: number };
  };
  compute: {
    size: string;
    region: string;
    cpuPct: number;
    diskPct: number;
    ramPct: number;
    conns: string;
  };
}

export interface DayTrend {
  date: string;
  label: string;
  total: number;
  success: number;
  failed: number;
}

export interface AppSummaryItem {
  id: string;
  name: string;
  category?: string;
  status: string;
  color?: string;
  avatarUrl?: string | null;
  url?: string | null;
  platforms?: string[];
  createdAt?: string;
}

export interface DashboardStats {
  summary: DashboardSummary;
  database: {
    url: string;
    projectId: string;
    status: string;
    latencyMs: number;
    tablesCount: number;
    totalRecords: number;
    accessMode: string;
  };
  infrastructure: InfrastructureStats;
  sevenDayTrend: DayTrend[];
  appsList: AppSummaryItem[];
  evaluation?: {
    totalCodes?: number;
    [key: string]: any;
  };
  clients: Array<{
    clientId: string;
    name: string;
    description: string;
    redirectUris: string[];
    createdAt: string;
  }>;
  recentEvents: Array<{
    codePrefix: string;
    clientId: string;
    userId: string;
    redirectUri: string;
    challengeMethod: string;
    used: boolean;
    createdAt: string;
    expiresAt: string;
  }>;
}
