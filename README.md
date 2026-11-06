# VNTEZ Ecosystem Monorepo

Hệ sinh thái hạ tầng đám mây, định danh bảo mật và ứng dụng vận hành VNTEZ (BaaS, Identity, Storage, POS, WMS, Telemetry, SDKs).

---

## 1. Cấu trúc Monorepo
Hệ thống sử dụng **Turborepo** và **Bun** để quản lý workspace:

```text
.
├── apps/
│   ├── web/           # Cổng thông tin chính & Tài liệu API 3 cột chuẩn Redoc/OpenAPI (Next.js 16)
│   ├── console/       # Bảng điều khiển quản trị hạ tầng & dữ liệu đối tác (Next.js 16)
│   └── id/
│       ├── api/       # API định danh & OAuth 2.0 PKCE backend
│       └── web/       # Cổng định danh VNTEZ ID & Desktop OS Sandbox ảo (Next.js 16)
├── packages/
│   ├── ui/            # Thư viện component dùng chung (@workspace/ui)
│   ├── auth/          # Quản lý phiên đăng nhập và token (@workspace/auth)
│   ├── eslint-config/ # Cấu hình ESLint dùng chung
│   └── typescript-config/ # Cấu hình TypeScript tsconfig dùng chung
└── AGENTS.md          # Quy tắc và hướng dẫn tối cao dành cho AI Coding Assistant
```

---

## 2. Tài liệu chi tiết từng ứng dụng
Trước khi làm việc với bất kỳ ứng dụng nào, **hãy đọc file README tương ứng**:
- **[`apps/web/README.md`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/web/README.md)**: Hướng dẫn cấu trúc `/docs` 3 cột, PrismJS syntax highlighter, xuất OpenAPI 3.1, và landing page.
- **[`apps/console/README.md`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/README.md)**: Hướng dẫn quản trị Client, Deals, Users, Zustand stores, và luồng SSO PKCE.
- **[`apps/id/web/README.md`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/id/web/README.md)**: Hướng dẫn môi trường Desktop OS Sandbox, hệ thống lưới 2D, Supabase SSR, và OAuth endpoints.
- **[`packages/ui/README.md`](file:///home/hnamhocit/Workspace/frontend/vntez/packages/ui/README.md)**: Hướng dẫn sử dụng `TopProgressBar`, `ErrorBoundaryView`, `NotFoundView`, và `UnderConstructionView`.

---

## 3. Quy tắc cốt lõi dành cho AI trong các phiên làm việc tương lai
1. **Quy tắc giới hạn file**: **MỌI FILE `.ts`, `.tsx` ĐƯỢC TẠO HOẶC SỬA ĐỀU PHẢI $< 300$ DÒNG**. Khi file chạm ngưỡng 200 dòng, phải chủ động tách ra components, hooks, stores, hoặc helper functions riêng.
2. **Tiết kiệm Token & Tránh làm lại từ đầu**: Đọc kỹ tài liệu các app trước khi thực hiện để hiểu rõ kiến trúc đã có, tránh xóa đi viết lại các tính năng đã hoàn thiện.
3. **Kiểm tra chất lượng code**:
   ```bash
   # Kiểm tra độ dài file trên toàn bộ dự án (phải trả về 0 kết quả)
   find apps packages -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" ! -path "*/.git/*" -exec wc -l {} + | awk '$1 >= 300 && $2 != "total" {print $1, $2}'

   # Kiểm tra kiểu dữ liệu
   cd apps/web && bun run typecheck
   cd apps/console && bun run typecheck
   cd apps/id/web && bun run typecheck
   cd packages/ui && bun run typecheck

   # Kiểm tra biên dịch
   bun run build
   ```
