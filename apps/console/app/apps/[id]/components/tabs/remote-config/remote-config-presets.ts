export interface ConfigPreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  config: Record<string, unknown>;
}

export const CONFIG_PRESETS: ConfigPreset[] = [
  {
    id: "security_hardened",
    name: "Bảo mật Nghiêm ngặt (Zero Trust)",
    description: "Bắt buộc MFA, PKCE, giới hạn 60 req/phút, token sống ngắn hạn 1h.",
    badge: "Security",
    config: {
      mfa_enforced: true,
      pkce_required: true,
      rate_limit_per_minute: 60,
      token_lifetime_seconds: 3600,
      refresh_token_lifetime_days: 7,
      maintenance_mode: false,
      enabled: true,
    },
  },
  {
    id: "standard_web",
    name: "Mặc định Web Tiêu chuẩn",
    description: "Cấu hình cân bằng hiệu năng và bảo mật cho ứng dụng web thông thường.",
    badge: "Balanced",
    config: {
      mfa_enforced: false,
      pkce_required: true,
      rate_limit_per_minute: 120,
      token_lifetime_seconds: 7200,
      refresh_token_lifetime_days: 30,
      maintenance_mode: false,
      enabled: true,
    },
  },
  {
    id: "maintenance",
    name: "Bảo trì Hệ thống Khẩn cấp",
    description: "Bật chế độ bảo trì toàn bộ API, chặn truy cập ngoài luồng quản trị.",
    badge: "Maintenance",
    config: {
      maintenance_mode: true,
      maintenance_message: "Hệ thống đang nâng cấp hạ tầng định kỳ, vui lòng quay lại sau.",
      min_client_version: "2.5.0",
      enabled: true,
    },
  },
];
