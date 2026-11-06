# VNTEZ Console (`apps/console`)

Bảng điều khiển quản trị đám mây tập trung (Cloud Management Console) cho các dịch vụ và đối tác thuộc hệ sinh thái VNTEZ.

---

## 1. Công nghệ sử dụng
- **Framework**: Next.js 16.4.2 (App Router, Turbopack, React 19).
- **Styling**: Tailwind CSS v4, `@workspace/ui`.
- **State Management**: Zustand v5 (quản lý state độc lập theo từng tính năng).
- **Bảo mật & Phiên làm việc**: `@workspace/auth` tích hợp SSO OAuth 2.0 PKCE với VNTEZ IAM.
- **Icons**: `lucide-react`.

---

## 2. Các trang & Chức năng đã hoàn thành
- **`/` (Dashboard Overview)**:
  - Tổng quan hạ tầng, Isometric Console Telemetry stream, trạng thái hệ thống và số lượng client.
- **`/clients` (Quản lý Client & Phê duyệt truy cập)**:
  - Danh sách đối tác, bảng phê duyệt yêu cầu truy cập, modal chi tiết client.
  - Quản lý state bằng Zustand: `app/clients/clients-store.ts`.
- **`/deals` (Quản lý Pipeline Giao dịch)**:
  - Bảng Kanban/List pipeline giao dịch theo các giai đoạn (Lead, Proposal, Contract, Won, Lost).
  - Quản lý state bằng Zustand: `app/deals/deals-store.ts`.
- **`/users` (Quản lý Người dùng & Phân quyền)**:
  - Quản lý danh sách thành viên, phân quyền Admin/Operator/Viewer, trạng thái kích hoạt.
  - Quản lý state bằng Zustand: `app/users/users-store.ts`.
- **`/tables` (Trình khám phá Cơ sở Dữ liệu)**:
  - Viewer dữ liệu bảng trực tiếp, bộ lọc cột, pagination.
- **`/audit-logs`**: Trang nhật ký kiểm toán hệ thống (dùng component `UnderConstructionView`).
- **`/settings`**: Kiểm tra thông tin phiên làm việc, trạng thái token và nút đăng xuất.
- **`/login` & `/auth/callback`**: Luồng xác thực đăng nhập một chạm qua VNTEZ IAM PKCE.
- **`app/error.tsx` & `app/not-found.tsx`**: Trang bắt lỗi ErrorBoundary và trang 404 tích hợp từ `@workspace/ui`.

---

## 3. Lưu ý quan trọng cho AI trong các phiên làm việc sau
1. **Quy tắc độ dài file**: Tuyệt đối **không được để file nào $\ge 300$ dòng**. Tách modals, filters, stores, types riêng biệt.
2. **Quy chuẩn State**:
   - Dùng Zustand stores theo từng domain (`clients-store.ts`, `deals-store.ts`, `users-store.ts`).
   - Không lồng logic gọi API phức tạp trực tiếp trong file `page.tsx`.
3. **Xác thực & Bảo vệ Route**:
   - Mọi trang quản trị cần bọc trong `<AuthGuard><ConsoleShell>{content}</ConsoleShell></AuthGuard>`.
4. **Kiểm tra**:
   - Chạy `bun run typecheck` trong `apps/console`.
   - Chạy `bun run build`.
