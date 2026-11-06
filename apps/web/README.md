# VNTEZ Web (`apps/web`)

Cổng thông tin chính (Public Portal) và Trung tâm Tài liệu kỹ thuật tương tác của hệ sinh thái VNTEZ.

---

## 1. Công nghệ sử dụng
- **Framework**: Next.js 16.4.2 (App Router, Turbopack, React 19).
- **Styling**: Tailwind CSS v4 (`@workspace/ui/globals.css`).
- **Icons**: `@tabler/icons-react`, `lucide-react`.
- **Hiệu ứng & Cú pháp**: `motion` (Framer Motion v14), `prismjs` (Syntax Highlighting đa ngôn ngữ).
- **Font chữ**: Be Vietnam Pro (100% tiếng Việt), Plus Jakarta Sans (Display/Heading), JetBrains Mono (Code/Terminal).

---

## 2. Các trang & Chức năng đã hoàn thành
- **`/` (Trang chủ)**:
  - Hero banner, Architecture Flow Canvas, Product Deep Dives, Dev Experience terminal, Header/Footer.
- **`/docs` (Tài liệu kỹ thuật 3 cột chuẩn Redoc / Mintlify)**:
  - **Cột 1 (Sidebar)**: App Switcher chọn sản phẩm (mặc định chọn `vntez-iam`), cây điều hướng endpoints có gắn màu HTTP method (`GET`, `POST`, `PUT`, `DELETE`), ô tìm kiếm tức thì, nút xuất `openapi.json (3.1)`.
  - **Cột 2 (Content & Specs)**: Tiêu đề, danh mục, thanh URL HTTP flat kèm nút sao chép, bảng tham số yêu cầu (Request Parameters), thẻ phản hồi (Response Specs 200/400/403), tích hợp AI Prompt 1 chạm.
  - **Cột 3 (Code Console)**: Giao diện dark terminal với PrismJS syntax highlighting (hỗ trợ cURL, TypeScript, Python, Go, Dart), tab chuyển đổi Mã yêu cầu vs Phản hồi mẫu JSON (hỗ trợ xem cả 200 OK và 400/403 Error).
- **`/docs/openapi/[appId]`**: API route động xuất file OpenAPI 3.1 JSON tiêu chuẩn cho từng app.
- **`/products` & `/blog`**: Danh mục sản phẩm hệ sinh thái và bài viết kỹ thuật.
- **`app/error.tsx` & `app/not-found.tsx`**: Trang hứng lỗi ErrorBoundary và trang 404 tích hợp từ `@workspace/ui`.

---

## 3. Lưu ý quan trọng cho AI trong các phiên làm việc sau
1. **Quy tắc độ dài file**: Tuyệt đối **không được tạo hoặc chỉnh sửa file nào $\ge 300$ dòng**. Tách logic ra subcomponents hoặc custom hooks.
2. **Quản lý dữ liệu Docs**:
   - Dữ liệu docs nằm tại `apps/web/app/docs/sections/` (`vntez-iam.ts`, `vntez-iam-endpoints.ts`, `storage.ts`, `pos.ts`, `wms.ts`, `telemetry.ts`, `sdk.ts`).
   - Danh sách ứng dụng định nghĩa tại `apps/web/app/docs/docs-data.ts`.
3. **Kiểm tra trước khi hoàn thành**:
   - Chạy `bun run typecheck` trong `apps/web` (phải 0 lỗi).
   - Chạy `bun run build` để kiểm tra biên dịch tĩnh/động.
