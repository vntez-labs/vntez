export interface DashboardStats {
  database: {
    url: string;
    projectId: string;
    status: string;
    latencyMs: number;
    tablesCount: number;
    totalRecords: number;
    accessMode: string;
  };
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
