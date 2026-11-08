# ==============================================================================
# VNTEZ ECOSYSTEM — AI AGENT OPERATING DIRECTIVES & GUIDELINES
# ==============================================================================
# MỌI PHIÊN LÀM VIỆC CỦA AI (Antigravity, Claude Code, Cursor, Copilot, etc.)
# BẮT BUỘC PHẢI TUÂN THỦ CÁC QUY TẮC DƯỚI ĐÂY ĐỂ TRÁNH LÃNG PHÍ TOKEN VÀ BẢO TỒN KIẾN TRÚC.
# ==============================================================================

## 1. QUY TẮC ĐỌC TÀI LIỆU TRƯỚC TIÊN (MANDATORY READ FIRST)
Trước khi phân tích, viết code, refactor hay trả lời người dùng, AI PHẢI ĐỌC các tài liệu hướng dẫn tương ứng với ứng dụng đang thao tác:
- Kế hoạch & Trạng thái chuyển giao phiên làm việc: `HANDOVER.md`
- Root Monorepo: `README.md`
- Cổng thông tin & Docs 3 cột: `apps/web/README.md`
- Quản trị Console BaaS: `apps/console/README.md`
- Virtual Desktop & Identity: `apps/id/web/README.md`
- Thư viện UI chung: `packages/ui/README.md`

## 2. QUY TẮC BẢO TOÀN KIẾN TRÚC — TUYỆT ĐỐI KHÔNG LÀM LẠI TỪ ĐẦU
Dự án đã hoàn thiện nhiều phân hệ cốt lõi. Tuyệt đối không xóa bỏ hay đập đi xây lại:
1. `apps/web/app/docs`: Kiến trúc 3 cột chuẩn Redoc/Mintlify, chọn ứng dụng theo App Switcher, PrismJS syntax highlight, xuất OpenAPI 3.1 động tại `/docs/openapi/[appId]`.
2. `apps/console`: Đã có các Zustand store chuẩn (`clients-store`, `deals-store`, `users-store`), flow SSO PKCE.
3. `apps/id/web`: Đã có Virtual Desktop OS giả lập 2D Grid, kéo thả icon, cửa sổ Modal, thanh Dock, Supabase SSR, Web Audio Synth, Developer Hub.
4. `packages/ui`: Đã có `TopProgressBar` (đã fix lỗi React 19 concurrent render an toàn), `ErrorBoundaryView`, `NotFoundView`, `UnderConstructionView`.

## 3. QUY TẮC GIỚI HẠN DÒNG CODE (< 300 DÒNG/FILE)
- **MỌI FILE `.ts`, `.tsx` TRONG TOÀN BỘ MONOREPO BẮT BUỘC PHẢI < 300 DÒNG.**
- Không có bất kỳ ngoại lệ nào. Khi một file chạm 200 dòng, AI phải chủ động tách ra components con, hooks, stores hoặc types riêng biệt.
- Lệnh kiểm tra bắt buộc:
  `find apps packages -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" ! -path "*/.git/*" -exec wc -l {} + | awk '$1 >= 300 && $2 != "total" {print $1, $2}'`
  (Kết quả phải luôn là 0 dòng).

## 4. QUY TRÌNH KIỂM THỬ TRƯỚC KHI KẾT THÚC PHIÊN LÀM VIỆC
AI phải chạy kiểm tra không có lỗi biên dịch:
```bash
bun run typecheck
bun run build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
