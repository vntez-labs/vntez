# VNTEZ Console (`apps/console`)

Bảng điều khiển quản trị đám mây tập trung (Cloud Management Console) cho các dịch vụ và đối tác thuộc hệ sinh thái VNTEZ.

---

## 1. Công nghệ sử dụng
- **Framework**: Next.js 16.4.2 (App Router, Turbopack, React 19).
- **Styling**: Tailwind CSS v4, `@workspace/ui`.
- **State Management**: Zustand v5 (quản lý state độc lập theo từng tính năng).
- **Bảo mật & Phiên làm việc**: `@workspace/auth` tích hợp SSO OAuth 2.0 PKCE với VNTEZ IAM.
- **Icons**: `@tabler/icons-react`, `lucide-react`.

---

## 2. Các trang & Chức năng đã hoàn thành
- **`/` (Dashboard Overview)**:
  - Tổng quan hạ tầng, Isometric Console Telemetry stream, trạng thái hệ thống và số lượng client.
- **`/apps` & `/apps/[id]` (Quản lý Ứng dụng & Chứng thực OAuth 2.0)**:
  - Danh sách ứng dụng, tạo mới app, tích hợp trực tiếp OAuth Secrets, Remote Config (JSON Editor), phân quyền RBAC và tài liệu.
  - Quản lý state bằng Zustand: `app/apps/apps-store.ts` và `app/apps/[id]/app-workspace-store.ts`.
- **`/database` (Trình khám phá Cơ sở Dữ liệu & Trình thực thi SQL)**:
  - Khám phá bảng dữ liệu, chạy truy vấn SQL trực tiếp với PrismJS syntax highlight và gợi ý tự động (autocomplete).
- **`/users` (Quản lý Người dùng & Phân quyền)**:
  - Quản lý danh sách thành viên qua Supabase Auth Admin, phân quyền, trạng thái kích hoạt và slide-over chi tiết.
  - Quản lý state bằng Zustand: `app/users/users-store.ts`.
- **`/storage` (Quản lý Lưu trữ Cloudflare R2)**:
  - Tải lên, tạo link tải có chữ ký điện tử (Presigned URL) và dọn rác tệp tin trên bucket S3 R2.
  - Quản lý state bằng Zustand: `app/storage/storage-store.ts`.
- **`/telebot` (Trung tâm Điều hành Telegram Bot)**:
  - Danh sách subscriber, trạng thái webhook Cloudflare Workers và gửi broadcast thông báo hàng loạt.
  - Quản lý state bằng Zustand: `app/telebot/telebot-store.ts`.
- **`/blog-posts` (Quản lý Bài viết & Bình luận)**:
  - Danh sách bài viết tin tức, lượt xem/like, tạo và chỉnh sửa bài viết Markdown.
  - Quản lý state bằng Zustand: `app/blog-posts/blog-posts-store.ts`.
- **`/permissions` (Ma trận Phân quyền IAM)**:
  - Ma trận tài nguyên và hành động RBAC liên kết với IAM Worker.
  - Quản lý state bằng Zustand: `app/permissions/permissions-store.ts`.
- **`/audit-logs`**: Trang nhật ký kiểm toán hệ thống (dùng component `UnderConstructionView`).
- **`/settings`**: Kiểm tra thông tin phiên làm việc, trạng thái token và nút đăng xuất.
- **`/login` & `/auth/callback`**: Luồng xác thực đăng nhập một chạm qua VNTEZ IAM PKCE.
- **`app/error.tsx` & `app/not-found.tsx`**: Trang bắt lỗi ErrorBoundary và trang 404 tích hợp từ `@workspace/ui`.

---

## 3. Lưu ý quan trọng cho AI trong các phiên làm việc sau
1. **Quy tắc độ dài file**: Tuyệt đối **không được để file nào $\ge 300$ dòng**. Tách modals, filters, stores, types riêng biệt.
2. **Quy chuẩn State**:
   - Dùng Zustand stores theo từng domain (`apps-store.ts`, `users-store.ts`, `storage-store.ts`, `telebot-store.ts`, etc.).
   - Không lồng logic gọi API phức tạp trực tiếp trong file `page.tsx`.
3. **Xác thực & Bảo vệ Route**:
   - Mọi trang quản trị cần bọc trong `<AuthGuard><ConsoleShell>{content}</ConsoleShell></AuthGuard>`.
4. **Kiểm tra**:
   - Chạy `bun run typecheck` trong `apps/console`.
   - Chạy `bun run build`.
