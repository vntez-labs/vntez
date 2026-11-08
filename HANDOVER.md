# ==============================================================================
# VNTEZ ECOSYSTEM — HANDOVER & SESSION CONTINUITY DIRECTIVE
# ==============================================================================
# TÀI LIỆU CHUYỂN GIAO CHO CÁC PHIÊN LÀM VIỆC TIẾP THEO CỦA AI (Antigravity, Cursor, Claude Code, ...)
# ==============================================================================

## 1. TỔNG QUAN TIẾN ĐỘ ĐÃ HOÀN TẤT TRONG PHIÊN NÀY

### 1.1. Cải tổ Giao diện & Design Tokens (Console & Web)
- **Màu nền dịu mắt**: Cập nhật CSS variables tại `packages/ui/src/styles/globals.css`:
  - `--background: #f8fafc` (slate-50 dịu mắt, hòa sắc tự nhiên).
  - `--muted: #f1f5f9`, `--secondary: #f1f5f9`.
  - `--border: rgba(15, 23, 42, 0.07)` (viền mảnh tinh tế, không gắt).
- **Animation 2 chiều (In & Out)**:
  - Tất cả Modal, Dropdown, Floating Quick-Actions và Accordion đều có hiệu ứng mượt mà cả khi mở lẫn khi đóng (`grid-template-rows`, `opacity`, `transform`).
- **Hệ thống Loading Toàn diện (Skeleton Screens)**:
  - Đã thêm `loading.tsx` chuẩn Next.js cho tất cả các route của Console (`/apps`, `/blog-posts`, `/database`, `/permissions`, `/settings`, `/storage`, `/telebot`, `/users`) và Web (`/blog`, `/blog/[slug]`, `/docs`, `/products`).
  - Thay thế hoàn toàn vòng quay circular spinner hoặc dòng chữ loading thô sơ bằng `TableSkeleton`, `CardGridSkeleton`, `DashboardSkeleton`.

### 1.2. Phân hệ Database & SQL Executor Trực tiếp
- Đã xây dựng trình thực thi SQL trực tiếp trong Console:
  - Syntax highlighting PrismJS chuẩn cú pháp SQL.
  - Autocomplete thông minh gợi ý bảng (`apps`, `blog_posts`, `users`, `audit_logs`, ...) và câu lệnh (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`, ...).
  - Bảng kết quả truy vấn, thời gian thực thi (ms) và số dòng bị tác động.
  - Hỗ trợ đóng modal khi bấm ra ngoài backdrop hoặc nhấn phím `Escape`.

### 1.3. Hợp nhất Ứng dụng & Chứng thực OAuth 2.0 (`/apps/[id]`)
- **Sidebar Submenu**: "Quản lý Ứng dụng & OAuth" tích hợp dropdown inline xổ ra danh sách App (Logo + Tên), bấm vào từng app sẽ điều hướng thẳng tới `/apps/[id]`.
- **Segmented Tabs Nav**: Thay thế tab gạch chân mờ nhạt bằng Segmented Button Group (`bg-muted/80 p-1 rounded-2xl`, tab active có nền trắng đổ bóng nhẹ). Tích hợp nút Lưu màu đỏ thương hiệu trực tiếp ở góc phải thanh tab.
- **Bố cục 2 Cột Bằng Nhau Tuyệt Đối (Equal Height)**:
  - Khối *Thông tin Chung* và *Chứng thực OAuth* được đặt trong một Card lớn với `grid-cols-1 xl:grid-cols-2 divide-x items-stretch`.
  - Hai cột tự động bằng nhau 100% về chiều cao, ngăn cách bằng đường viền dọc `divide-x`.
  - Khắc phục triệt để lỗi border dính sát label input (cấp đệm `pb-5 border-b` và `pt-5 space-y-5`).
  - Hàng chốt cuối cùng (`Trạng thái Hoạt động` bên trái & `Ứng dụng Hệ thống Nội bộ` bên phải) luôn thẳng hàng ngang tuyệt đối qua `mt-auto pt-4 border-t`.
- **CustomSelect An Toàn**:
  - Không còn dùng `<select>` mặc định của trình duyệt. Sử dụng `CustomSelect` chuẩn Design Token.
  - Hỗ trợ `z-50`, bỏ `overflow-hidden` gây cắt cụt và tự động nhảy lên trên (`dropup`) nếu đáy màn hình hẹp (< 200px).
- **Textarea Giấy Phẳng (Flat Paper Style)**:
  - Loại bỏ các hộp viền lồng nhau cục mịch tại `DocsTab`, `LegalTab` và ô `Redirect URIs`.
  - Soạn thảo phẳng như tờ giấy trắng trên nền card trong suốt với placeholder hướng dẫn chi tiết.
- **Loại bỏ Thừa thãi**:
  - Xóa bỏ hộp "Kiểm Tra Quyền Thực Thi" (do bảng Matrix Table đã hiển thị đầy đủ và rõ ràng).
  - Xóa dòng text thừa `Xem trước trang tài liệu: ...`.
- **Remote Config Per-App & Trình soạn thảo JSON**:
  - Tích hợp `JsonCodeEditor` có số dòng (line numbers), highlight cú pháp, định dạng JSON và kiểm tra lỗi thời gian thực.
  - Trạng thái kích hoạt Opt-in cho từng app riêng biệt.

### 1.4. Nút Tác vụ Nhanh Nổi (Floating Quick Action)
- Component [`FloatingQuickActions`](apps/console/components/floating-quick-actions.tsx) cố định góc dưới bên phải (`bottom-6 right-6 z-40`).
- Icon cây bút lông kết hợp dấu cộng (`IconPencilPlus`) hỗ trợ tạo nhanh Blog, Thêm App, Thực thi SQL, Tải file lên R2, v.v.

---

## 2. KẾ HOẠCH CHO PHIÊN LÀM VIỆC TIẾP THEO (NEXT PRIORITIES)

### ƯU TIÊN 1 (Ngày mai): Kiểm tra Ổn định & Triệt tiêu Mock Data / Dữ liệu Giả lập
1. **Kiểm tra tính ổn định (Stability Audit)**:
   - Rà soát toàn bộ các phân hệ trong `apps/console`: Database, Users, Storage (Cloudflare R2), Telebot, Blog Posts, Permissions, Settings.
   - Đảm bảo không còn `mockData`, file JSON tĩnh nội bộ hay logic fake status.
2. **Kết nối Backend Thực tế**:
   - Xác thực SSO PKCE với IdP Cloudflare Workers / Supabase Auth.
   - Lưu trữ và cập nhật trạng thái App, OAuth Secrets qua Database API thực.
   - Thao tác tệp tin trên Cloudflare R2 thông qua presigned URL / upload API chuẩn.
   - Gửi broadcast Telegram qua Cloudflare Workers Bot endpoint thật.

### ƯU TIÊN 2: Hoàn thiện Quản lý Ứng dụng & Remote Config Nâng cao
1. **Đồng bộ Edge Runtime cho Remote Config**:
   - Đẩy payload cấu hình JSON từ Console lên Cloudflare Workers KV hoặc D1 theo namespace `app:{appId}:remote_config`.
   - Tạo Endpoint Public Edge `/api/v1/remote-config/[appId]` có Cache-Control và ETag chuẩn để các client app (Solotype, Bonsai Reader, GitVN) kéo config thời gian thực.
2. **Schema Validation & Rollback History**:
   - Cho phép định nghĩa JSON Schema cho Remote Config để chống lỗi cú pháp khi cập nhật trên môi trường live.
   - Lưu lịch sử phiên bản cấu hình (versioning) và nút 1-click Rollback phiên bản cũ an toàn.

---

## 3. CÁC QUY TẮC CỐT LÕI AI BẮT BUỘC TUÂN THỦ

1. **Giới hạn số dòng code (< 300 dòng/file)**:
   - Lệnh kiểm tra bắt buộc:
     `find apps packages -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" ! -path "*/.git/*" -exec wc -l {} + | awk '$1 >= 300 && $2 != "total" {print $1, $2}'`
   - Phải luôn cho kết quả là `0` dòng.
2. **Quy trình kiểm thử trước khi kết thúc**:
   - `bun run typecheck` (Phải đạt 0 lỗi trên toàn bộ monorepo).
   - `bun run build` (Phải build thành công 4 ứng dụng `console`, `web`, `docs`, `legal`).
3. **Bảo tồn kiến trúc**:
   - Không đập đi làm lại các tính năng cốt lõi đã hoàn thiện.
   - Tạo component con nhỏ gọn trong thư mục `components/` tương ứng khi file chạm ngưỡng 200 dòng.
