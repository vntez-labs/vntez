interface OAuthCode {
  code?: string;
  client_id: string;
  user_id: string;
  redirect_uri: string;
  code_challenge_method?: string;
  used: boolean;
  created_at: string;
  expires_at: string;
}

export function summarizeOAuthActivity(codes: OAuthCode[], now: Date, sevenDaysAgo: Date) {
  // Exact Requests / OAuth Metrics
  const totalRequests = codes.length;
  const successfulCodes = codes.filter((c) => c.used).length;
  const failedCodes = codes.filter(
    (c) => !c.used && new Date(c.expires_at) < now
  ).length;
  const successRate =
    totalRequests > 0
      ? `${Math.round((successfulCodes / totalRequests) * 100)}%`
      : "100%";

  const codesThisWeek = codes.filter(
    (c) => new Date(c.created_at) >= sevenDaysAgo
  );
  const requestsThisWeek = codesThisWeek.length;

  // Exact 7-Day chronological trend series from real oauth_codes
  const VI_DAYS = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const sevenDayTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = `${VI_DAYS[d.getDay()]}, ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;

    const dayCodes = codes.filter(
      (c) => c.created_at && c.created_at.slice(0, 10) === dateStr
    );
    const dayFailed = dayCodes.filter(
      (c) => !c.used && new Date(c.expires_at) < now
    ).length;
    const daySuccess = dayCodes.filter((c) => c.used).length;

    sevenDayTrend.push({
      date: dateStr,
      label: dayLabel,
      total: dayCodes.length,
      success: daySuccess,
      failed: dayFailed,
    });
  }

  // Distribution of redirect URIs in real codes
  const redirectUriMap: Record<string, number> = {};
  codes.forEach((c) => {
    if (c.redirect_uri) {
      redirectUriMap[c.redirect_uri] =
        (redirectUriMap[c.redirect_uri] || 0) + 1;
    }
  });

  // Real recent authorization events from oauth_codes (last 6)
  const recentEvents = codes.slice(0, 6).map((c) => ({
    codePrefix: c.code
      ? `${c.code.slice(0, 8)}...${c.code.slice(-6)}`
      : "unknown",
    clientId: c.client_id,
    userId: c.user_id,
    redirectUri: c.redirect_uri,
    challengeMethod: c.code_challenge_method || "S256",
    used: c.used,
    createdAt: c.created_at,
    expiresAt: c.expires_at,
  }));

  return { totalRequests, successfulCodes, failedCodes, successRate, requestsThisWeek, sevenDayTrend, redirectUriMap, recentEvents };
}
