-- ==============================================================================
-- VNTEZ PLATFORM — SEED DATA CHO BẢNG APPS
-- Bao gồm 5 ứng dụng: SoloType, VNTEZ IAM, Workers Hub, Bonsai Reader, GitVN
-- ==============================================================================
-- Sử dụng ON CONFLICT (id) DO UPDATE để chạy an toàn nhiều lần (Upsert).
-- ==============================================================================

INSERT INTO public.apps (
  id,
  name,
  category,
  description,
  release_date,
  platforms,
  color,
  cta_link,
  illustration_key,
  status,
  created_at,
  updated_at
) VALUES
(
  'solotype',
  'SoloType',
  'Công cụ Lập trình & Năng suất',
  'Nền tảng kiểm tra và rèn luyện tốc độ gõ phím 10 ngón thế hệ mới, tối ưu hóa đặc biệt cho bộ gõ tiếng Việt Telex/VNI và lập trình viên code đa ngôn ngữ (TypeScript, Rust, Go, Python). Tích hợp thuật toán đo đạc WPM/CPM thời gian thực, phân tích tỷ lệ gõ sai theo từng ngón tay và hệ thống bảng xếp hạng cộng đồng trực tiếp.',
  '11/2026',
  ARRAY['Web', 'macOS', 'Windows', 'Linux'],
  '#0ea5e9',
  '/docs/ecosystem#solotype',
  'sdk',
  'active',
  NOW(),
  NOW()
),
(
  'vntez-iam',
  'VNTEZ IAM',
  'Bảo mật & Quản lý Truy cập',
  'Giải pháp Single Sign-On (SSO) và Identity Provider (IdP) hiệu năng cao chuẩn Enterprise, xây dựng trên giao thức OAuth 2.0 PKCE và OpenID Connect (OIDC). Cung cấp ma trận phân quyền RBAC đa cấp độ, kiểm soát truy cập chi tiết theo Resource-Action, xác thực hai lớp (2FA/TOTP) và tích hợp liền mạch với cụm Cloudflare Workers.',
  '11/2026',
  ARRAY['Web', 'Docker', 'API/CLI', 'Cloudflare Workers'],
  '#fb291a',
  '/docs/vntez-iam',
  'iam',
  'active',
  NOW(),
  NOW()
),
(
  'workers-hub',
  'Workers Hub',
  'Hạ tầng Serverless & Edge Cloud',
  'Bảng điều khiển trung tâm quản lý và theo dõi toàn diện các cụm Cloudflare Workers, R2 Buckets, D1 Databases và Queues. Tự động thu thập telemetry log vi mô, đo lường độ trễ mạng nội địa từng miligiây, phân tích tỉ lệ lỗi HTTP thời gian thực và tự động cảnh báo sự cố hạ tầng trực tiếp qua kênh Telegram Bot.',
  '11/2026',
  ARRAY['Web', 'API/CLI', 'Docker'],
  '#f59e0b',
  '/docs/telemetry#workers-hub',
  'telemetry',
  'active',
  NOW(),
  NOW()
),
(
  'bonsai-reader',
  'Bonsai Reader',
  'Tri thức & Đọc tài liệu',
  'Trình đọc sách điện tử (ePub, PDF) và tài liệu Markdown/MDX với thiết kế tối giản, loại bỏ hoàn toàn phiền nhiễu thị giác. Hỗ trợ Typography chuẩn mực cho tiếng Việt, chế độ ban đêm bảo vệ mắt, bộ đếm thời gian tập trung Pomodoro và cơ chế ghi chú thông minh đồng bộ tức thời với cụm lưu trữ Edge R2.',
  '11/2026',
  ARRAY['Web', 'macOS', 'Windows', 'Linux', 'Android', 'iOS'],
  '#10b981',
  '/docs/ecosystem#bonsai-reader',
  'ecosystem',
  'active',
  NOW(),
  NOW()
),
(
  'gitvn',
  'GitVN',
  'Công cụ Lập trình & Quản lý Dự án',
  'Nền tảng Git Repository tối giản chạy local, loại bỏ mọi rào cản và độ trễ phức tạp (Zero-Friction). Chỉ tập trung vào những tính năng cốt lõi hay dùng nhất của Git, tích hợp liền mạch tinh thần quản lý tác vụ linh hoạt của Jira và hệ thống tài liệu/wiki tri thức của Confluence trực tiếp trong môi trường làm việc cá nhân và nội bộ.',
  '11/2026',
  ARRAY['Web', 'macOS', 'Linux', 'Windows', 'Localhost'],
  '#6366f1',
  '/docs/ecosystem#gitvn',
  'sdk',
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  release_date = EXCLUDED.release_date,
  platforms = EXCLUDED.platforms,
  color = EXCLUDED.color,
  cta_link = EXCLUDED.cta_link,
  illustration_key = EXCLUDED.illustration_key,
  status = EXCLUDED.status,
  updated_at = NOW();
