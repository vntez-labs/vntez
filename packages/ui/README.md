# VNTEZ Shared UI (`packages/ui` / `@workspace/ui`)

Gói giao diện dùng chung (Design System & Shared Components) cho toàn bộ ứng dụng trong monorepo.

---

## 1. Công nghệ sử dụng
- **React**: React 19.
- **Styling**: Tailwind CSS v4, Base UI, tw-animate-css.
- **Icons**: `lucide-react`.

---

## 2. Các Components dùng chung quan trọng
- **`TopProgressBar` (`@workspace/ui/components/top-progress-bar`)**:
  - Thanh tiến độ màu gradient đỏ - cam neon ở đỉnh màn hình (`z-[99999]`).
  - Tự động bắt sự kiện click link nội bộ và các lệnh SPA navigation (`pushState`, `replaceState`, `popstate`).
  - **Khắc phục lỗi React 19**: Sử dụng macro-task scheduling an toàn, không gây cảnh báo `useInsertionEffect must not schedule updates`.
- **`ErrorBoundaryView` (`@workspace/ui/components/error-boundary-view`)**:
  - Giao diện hứng lỗi chuẩn Error Boundary cho `error.tsx` của Next.js App Router.
  - Hỗ trợ nút Thử lại ngay (`reset()`), Về trang chủ, mã lỗi digest và accordion xem stack trace kỹ thuật.
- **`NotFoundView` (`@workspace/ui/components/not-found-view`)**:
  - Giao diện 404 trang không tồn tại cho `not-found.tsx`.
  - Nút Quay lại trang trước (`window.history.back()`), Về trang chủ, và các lối tắt gợi ý tới Tài liệu, Console, ID.
- **`UnderConstructionView` (`@workspace/ui/components/under-construction-view`)**:
  - Giao diện thông báo tính năng đang trong giai đoạn phát triển.
  - Có thanh tiến độ hoàn thiện (Development Progress Bar), form đăng ký nhận email ra mắt và nút quay lại.
- **`Skeleton` & Composite Skeletons (`@workspace/ui/components/skeleton` & `@workspace/ui/components/layout-skeletons`)**:
  - `Skeleton`: Khối placeholder tải dữ liệu mượt mà, hỗ trợ hiệu ứng sóng ánh sáng `shimmer` chuyển động GPU-accelerated mượt mà và `animate-pulse`.
  - `TableSkeleton`: Placeholder bảng dữ liệu với số hàng, số cột và tiêu đề tùy biến.
  - `CardSkeleton`: Placeholder thẻ thông tin / sản phẩm / bài viết.
  - `PageHeaderSkeleton` & `StatsCardsSkeleton`: Placeholder cho tiêu đề trang và lưới thẻ chỉ số thống kê.
  - `layout-skeletons`: Bộ khung tải trang hoàn chỉnh bao gồm `DashboardSkeleton`, `DocsSkeleton` (3 cột Redoc/Mintlify), `ProductsGridSkeleton`, `BlogGridSkeleton` và `ArticleDetailSkeleton`.
- **Thành phần cơ bản**: `Button`, `Checkbox`, `Badge`, `Card`, `Input`, `CustomSelect`, `AutoResizeTextarea`, `VntezLogo`.

---

## 3. Cách sử dụng trong các App
```tsx
import { TopProgressBar } from "@workspace/ui/components/top-progress-bar";
import { Skeleton, TableSkeleton, CardSkeleton } from "@workspace/ui/components/skeleton";
import { DashboardSkeleton, DocsSkeleton } from "@workspace/ui/components/layout-skeletons";
import { ErrorBoundaryView } from "@workspace/ui/components/error-boundary-view";
import { NotFoundView } from "@workspace/ui/components/not-found-view";
import { UnderConstructionView } from "@workspace/ui/components/under-construction-view";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
```
