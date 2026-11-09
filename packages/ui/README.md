# VNTEZ Shared UI (`packages/ui` / `@workspace/ui`)

Gói giao diện dùng chung (Design System & Shared Components) cho toàn bộ ứng dụng trong monorepo.

---

## 1. Công nghệ sử dụng
- **React**: React 19.
- **Styling**: Tailwind CSS v4, Base UI, tw-animate-css.
- **Icons**: `lucide-react`.
- **Notifications**: `sonner` (Toast notifications hàng đầu cho React 19).
- **Validation**: `zod`.

---

## 2. Các Components & Hooks dùng chung quan trọng
- **`Toaster` & `toast` (`@workspace/ui/components/toaster`)**:
  - Hệ thống thông báo popup (Toast) mượt mà hỗ trợ Dark Mode và Stacked Toasts.
  - Sử dụng: `toast.success("Thành công")`, `toast.error("Có lỗi xảy ra")`, `toast.promise(...)`.
- **`CopyButton` (`@workspace/ui/components/copy-button`) & `useClipboard` (`@workspace/ui/hooks/use-clipboard`)**:
  - Nút bấm và Hook sao chép dữ liệu vào clipboard chuẩn hóa, tự động fallback cho mọi trình duyệt, đổi icon phản hồi 2s và kích hoạt toast thông báo.
- **`formatBytes`, `formatDate`, `formatRelativeTime`, `formatNumber` (`@workspace/ui/lib/formatters`)**:
  - Bộ tiện ích định dạng dữ liệu chuẩn `Intl` tối ưu hóa hiệu năng, định dạng dung lượng byte (B, KB, MB, GB), ngày tháng tiếng Việt (`vi-VN`) và thời gian tương đối ("5 phút trước").
- **`TopProgressBar` (`@workspace/ui/components/top-progress-bar`)**:
  - Thanh tiến độ màu gradient đỏ - cam neon ở đỉnh màn hình (`z-[99999]`).
  - **Khắc phục lỗi React 19**: Sử dụng macro-task scheduling an toàn, không gây cảnh báo `useInsertionEffect must not schedule updates`.
- **`ErrorBoundaryView` (`@workspace/ui/components/error-boundary-view`)**:
  - Giao diện hứng lỗi chuẩn Error Boundary cho `error.tsx` của Next.js App Router.
- **`NotFoundView` (`@workspace/ui/components/not-found-view`)**:
  - Giao diện 404 trang không tồn tại cho `not-found.tsx`.
- **`UnderConstructionView` (`@workspace/ui/components/under-construction-view`)**:
  - Giao diện thông báo tính năng đang trong giai đoạn phát triển.
- **`Skeleton` & Composite Skeletons (`@workspace/ui/components/skeleton` & `@workspace/ui/components/layout-skeletons`)**:
  - Bộ khung tải trang hoàn chỉnh bao gồm `DashboardSkeleton`, `DocsSkeleton` (3 cột Redoc/Mintlify), `TableSkeleton`, `ProductsGridSkeleton`, `BlogGridSkeleton`.
- **Thành phần cơ bản**: `Button`, `Checkbox`, `Badge`, `Card`, `Input`, `CustomSelect`, `AutoResizeTextarea`, `VntezLogo`.

---

## 3. Cách sử dụng trong các App
```tsx
import { Toaster, toast } from "@workspace/ui/components/toaster";
import { CopyButton } from "@workspace/ui/components/copy-button";
import { useClipboard } from "@workspace/ui/hooks/use-clipboard";
import { formatBytes, formatDate, formatRelativeTime } from "@workspace/ui/lib/formatters";
import { TopProgressBar } from "@workspace/ui/components/top-progress-bar";
import { Skeleton, TableSkeleton, CardSkeleton } from "@workspace/ui/components/skeleton";
import { DashboardSkeleton, DocsSkeleton } from "@workspace/ui/components/layout-skeletons";
import { Button } from "@workspace/ui/components/button";
```
