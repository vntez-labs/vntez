# ==============================================================================
# VNTEZ ECOSYSTEM — HANDOVER & SESSION CONTINUITY DIRECTIVE
# ==============================================================================
# TÀI LIỆU CHUYỂN GIAO CHO CÁC PHIÊN LÀM VIỆC TIẾP THEO CỦA AI (Antigravity, Cursor, Claude Code, ...)
# ==============================================================================

## 1. TỔNG QUAN TIẾN ĐỘ ĐÃ HOÀN TẤT TRONG PHIÊN NÀY

### 1.1. Cải tổ Giao diện & Design Tokens (Console & Web)
- **Tối ưu Độ tương phản & Màu nền Light Mode (Khắc phục Text chìm)**:
  - Cập nhật CSS variables tại `packages/ui/src/styles/globals.css`:
    - `--background: #f8f9fa` (Canvas trung tính sạch sẽ, sáng rõ, loại bỏ ánh xanh xám lạnh đục).
    - `--border: #e2e8f0` & `--input: #cbd5e1` (Đường viền sắc nét 1px thực thụ, thay thế viền mờ `0.07 alpha` làm phẳng và nhòe card).
    - `--muted-foreground: #475569` (Slate-600 đạt chuẩn WCAG AAA với độ tương phản 7.2:1, chữ phụ không còn bị rửa trôi trên nền sáng).
    - `--card: #ffffff` với viền `#e2e8f0` và `shadow-2xs`/`shadow-xs` giúp các card nổi khối rõ ràng.
- **Cải tổ Bảng Điều Khiển Tổng Quan (Executive Operational Dashboard) — 100% Real Supabase Telemetry**:
  - Triệt tiêu hoàn toàn dữ liệu giả lập/fallback giả (đã gỡ bỏ toàn bộ baseline 1,808 fake req, 8 users giả, baselineDaily). Toàn bộ dữ liệu được query trực tiếp từ Supabase:
    1. **4 Chỉ số Vận hành Cốt lõi ([`DashboardKpis`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/components/dashboard/dashboard-kpis.tsx))**:
       - **Tổng Yêu cầu (Requests)**: `18` requests (16 trong 7 ngày qua từ `oauth_codes`), Tỷ lệ hoàn tất `100%`, Độ trễ phản hồi thời gian thực qua `performance.now()`.
       - **Ứng dụng Vận hành (Ecosystem Apps)**: `5` ứng dụng (`5/5 Đang trực tuyến`: SoloType, VNTEZ IAM, Workers Hub, Bonsai Reader, GitVN), `100% Khả dụng`.
       - **Người dùng & Khách hàng (Users & Customers)**: Chính xác `1` tài khoản Super Admin từ `auth.users` (`hnamhocit@gmail.com`, tạo ngày 15/10/2026).
       - **Hạ tầng & Dịch vụ Cloud**: Khu vực Singapore `ap-southeast-1`, Postgres NVMe `Khỏe mạnh (Healthy)` với `24` bản ghi cơ sở dữ liệu.
    2. **Biểu đồ Lưu lượng 7 Ngày ([`TrafficTrendChart`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/components/dashboard/traffic-trend-chart.tsx))**:
       - Trực quan hóa số lượng yêu cầu xác thực theo từng ngày từ dữ liệu thật `oauth_codes` (0 số liệu bịa đặt).
       - Bảng phân bổ dịch vụ & dữ liệu thực tế: OAuth 2.0 PKCE (18 phiên), Postgres NVMe (24 bản ghi: 5 apps, 18 mã, 1 bài viết), Người dùng Admin (1 tài khoản `hnamhocit@gmail.com`), Blog kỹ thuật (1 bài viết, 4 lượt xem, 3 tim, 2 bình luận).
    3. **Lưới Trạng Thái Ứng Dụng ([`EcosystemAppsStatus`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/components/dashboard/ecosystem-apps-status.tsx))**:
       - Danh sách trực quan 5 ứng dụng với avatar, danh mục, trạng thái trực tuyến (Live Pulse dot), link mở ứng dụng và nút quản lý cấu hình.
    4. **Nhật Ký Vận Hành Thân Thiện ([`RecentActivityCard`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/components/dashboard/recent-activity-card.tsx))**:
       - Ghi nhận các sự kiện xác thực SSO PKCE thành công thật từ `oauth_codes` dưới dạng ngôn ngữ con người dễ hiểu, kèm tab chuyển đổi xem "Mã OAuth (Raw)" cho kỹ sư khi cần đối soát.
- **Loại bỏ Hoàn toàn Template Boilerplate & Mô tả Rườm rà**:
  - Triệt tiêu các đoạn văn bản mô tả thừa thãi ("Soạn thảo bằng Markdown Editor...", "Đăng ký, upload avatar...", "Trình quản lý Table Editor...") trên tất cả các trang quản trị Console (`/blog-posts`, `/apps`, `/database`, `/storage`, `/settings`).
  - Chuẩn hóa **Top Action Header** tinh gọn theo phong cách Linear/Vercel/Supabase:
    - Bên trái: Icon phân hệ trong badge thương hiệu + Tiêu đề trang (`text-xl font-bold`) + Huy hiệu đếm số lượng (`posts.length`, `apps.length`).
    - Bên phải: Tích hợp ngay ô tìm kiếm và Nút hành động chính (`+ Viết bài mới`, `+ Thêm Ứng dụng`).
  - Tại `/blog-posts`: Thay thế 4 card thống kê khổng lồ chiếm 120px bằng dải Metric Ribbon siêu gọn gàng và hàng Filter Category sắc nét, tiết kiệm hơn 150px chiều cao màn hình.
- **Animation 2 chiều (In & Out)**:
  - Tất cả Modal, Dropdown, Floating Quick-Actions và Accordion đều có hiệu ứng mượt mà cả khi mở lẫn khi đóng (`grid-template-rows`, `opacity`, `transform`).
- **Hệ thống Loading Toàn diện (Skeleton Screens)**:
  - Đã thêm `loading.tsx` chuẩn Next.js cho tất cả các route của Console (`/apps`, `/blog-posts`, `/database`, `/permissions`, `/settings`, `/storage`, `/telebot`, `/users`) và Web (`/blog`, `/blog/[slug]`, `/docs`, `/products`).
  - Thay thế hoàn toàn vòng quay circular spinner hoặc dòng chữ loading thô sơ bằng `TableSkeleton`, `CardGridSkeleton`, `DashboardSkeleton`.

### 1.2. Phân hệ Database & SQL Executor Trực tiếp
- **Chuyển đổi Bố cục Toàn màn hình (Column Layout — Segmented Button Group)**:
  - Loại bỏ hoàn toàn cột sidebar dọc 288px (`DatabaseTableSelector`) chiếm dụng diện tích ngang.
  - Xây dựng component [`DatabaseTableTabs`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/app/database/components/database-table-tabs.tsx) chuẩn hóa dạng **Segmented Button Group** (`bg-muted/70 p-1 rounded-2xl`):
    - Sử dụng **font chữ thông thường (`font-sans`)** thay vì monospace, giúp dễ đọc và liền mạch với giao diện tổng thể.
    - Tab được kích hoạt (Active) nổi bật với màu thương hiệu (`bg-primary text-white font-semibold shadow-xs`), icon Table trắng và huy hiệu đếm số lượng bản ghi siêu gọn gàng.
    - **Loại bỏ badge tag lặp tên**: Đã xóa hoàn toàn các badge phân loại thừa (`Requests`, `Blog`, `IAM Perms`, v.v.) vốn chỉ lặp lại tên của chính bảng đó, giúp tiết kiệm hơn 50% diện tích ngang cho mỗi nút tab.
    - **Tự động cuộn & Nút điều hướng ngang**: Bổ sung nút cuộn trái/phải (`ChevronLeft`, `ChevronRight`) xuất hiện thông minh khi số lượng bảng vượt chiều rộng màn hình, kèm cơ chế tự động cuộn tab được chọn vào tầm nhìn (`scrollIntoView`).
    - Tab không chọn có độ tương phản dịu mắt (`text-muted-foreground hover:bg-card/50`).
  - Giải phóng thêm **>300px chiều ngang** cho [`DatabaseGrid`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/app/database/components/database-grid.tsx) đạt độ rộng 100% toàn màn hình, hiển thị thoải mái các cột dữ liệu JSON/mảng/chuỗi dài mà không bị bóp nghẽn.
  - Chuẩn hóa header với các nút tác vụ nhanh: `Thực thi SQL` (Mở modal terminal truy vấn trực tiếp), `Cấu trúc DDL` và `Tải lại`.
- **Trình Thực thi SQL Trực tiếp — Tái cấu trúc theo phong cách Workbench Chuyên nghiệp**:
  - **Loại bỏ văn bản rườm rà**: Gỡ bỏ hoàn toàn các khẩu hiệu tiếp thị ("Live Runner", "Thực thi truy vấn SQL trực tiếp, có Syntax Highlight..."), dải chip mẫu nhanh gây rối mắt và liên kết ngoài thừa thãi.
  - **Bổ sung Cây Khám phá Schema ([`SqlSchemaSidebar`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/app/database/components/sql-schema-sidebar.tsx))**:
    - Hiển thị đầy đủ danh sách các bảng trong database (`apps`, `oauth_codes`, `blog_posts`, ...).
    - Khi bấm mở rộng từng bảng, hiển thị chi tiết toàn bộ các cột, kiểu dữ liệu (`text`, `boolean`, `timestamptz`, `jsonb`, ...) và biểu tượng khóa chính (Primary Key).
    - Hỗ trợ 1-click nút Chạy nhanh `SELECT * FROM table LIMIT 20;` hoặc bấm vào tên cột để tự động chèn vào vị trí con trỏ trong câu lệnh SQL.
  - **Tích hợp Monaco Editor (VS Code Engine) & Context Schema IntelliSense ([`SqlCodeEditor`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/app/database/components/sql-code-editor.tsx))**:
    - Thay thế code textarea thủ công bằng **`@monaco-editor/react` (trình soạn thảo lõi của VS Code)**.
    - **Nạp Context Schema Đầy Đủ**: Đăng ký `monaco.languages.registerCompletionItemProvider("sql", ...)` cung cấp gợi ý IntelliSense thông minh từ dữ liệu thực tế database:
      - Bảng (Tables): Tên bảng, số dòng dữ liệu, biểu tượng Table và tài liệu chi tiết.
      - Cột (Columns): Tên cột theo bảng (`table.column`), kiểu dữ liệu (`text`, `boolean`, `timestamptz`), nhãn `(PK)` khóa chính và tài liệu.
      - Từ khóa SQL chuẩn: `SELECT`, `FROM`, `WHERE`, `JOIN`, `LIMIT`, `CASE`, `COUNT`, v.v.
    - **Đồng bộ Theme VS Code**: Tự động chuyển đổi giữa `vs-dark` (Dark mode) và `light` (Light mode) qua `next-themes`.
    - **Tăng Kích thước & Chiều cao**: Cỡ chữ **14px** rõ ràng sắc nét, chiều cao mở rộng **280px**, font chữ `Fira Code / JetBrains Mono`, hỗ trợ đầy đủ phím tắt `Ctrl + Enter` (thực thi) và `Ctrl + Space` (gợi ý IntelliSense).
    - Dọn dẹp code rác: Xóa bỏ `sql-autocomplete.ts` cũ do Monaco Editor đã đảm nhiệm toàn bộ.
  - **Trực quan hóa Kết quả Thực thi ([`SqlResultsViewer`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/app/database/components/sql-results-viewer.tsx))**:
    - Hiển thị trực quan thời gian thực thi (ms), số dòng dữ liệu trả về, kèm các nút tiện ích Sao chép JSON và Xuất file CSV.

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

### 1.5. Dọn dẹp Toàn diện Code Rác & Triệt tiêu Mock Data / Local Store Tĩnh (Đã hoàn tất)
- **Xóa 100% Dead/Orphaned Components**:
  - `apps/console/app/clients`: Đã xóa toàn bộ `clients-store.ts`, `clients-header.tsx`, `clients-table.tsx`, `clients-form-modal.tsx`, `clients-delete-modal.tsx` (do đã hợp nhất hoàn toàn vào phân hệ `/apps`). Giữ `page.tsx` redirect an toàn sang `/apps`.
  - `apps/console/app/apps`: Đã xóa `workspace-header.tsx`, `app-switcher-accordion.tsx`, `app-avatar-uploader.tsx`, `app-platforms-selector.tsx` và `permissions-evaluator-card.tsx`.
  - `apps/console/app/permissions`: Đã xóa `evaluator-card.tsx` và dọn dẹp các state/actions kiểm tra quyền thừa trong `permissions-store.ts` (giảm từ 282 dòng xuống còn 203 dòng).
  - `apps/web`: Đã xóa các file cũ không dùng `philosophy-section.tsx`, `ecosystem.ts`, `story.ts` và gỡ bỏ 2 dependency `@aws-sdk/*` thừa trong `apps/web/package.json`.
- **Triệt tiêu File JSON Tĩnh Nội Bộ**:
  - Đã xóa `apps/console/data/oauth_client_requests.json` và `apps/console/lib/client-requests-local.ts`.
  - Cập nhật `client-requests.ts` truy vấn trực tiếp 100% qua Supabase Postgres, không còn fallback vào ổ đĩa cục bộ.
- **Dọn dẹp Unused Exports**:
  - Chuẩn hóa các export trong `sql-autocomplete.ts`, `apps-repository.ts`, `console-shell.tsx`, `types.ts`.

### 1.6. Thay thế Code Thủ công bằng Thư viện Chuẩn hóa (Đã hoàn tất)
- **Hệ thống Toast Notification (`sonner`)**:
  - Đã cài đặt thư viện `sonner` hỗ trợ hoàn hảo React 19 vào `@workspace/ui`.
  - Tạo component [`Toaster`](packages/ui/src/components/toaster.tsx) đồng bộ theme (dark/light, bo góc, border dịu mắt) và mount vào RootLayout của `apps/console` và `apps/web`.
  - Thay thế các lệnh `alert()` chặn UI và các alert box màu xanh/đỏ thủ công bằng `toast.success()`, `toast.error()`, `toast.info()`.
- **Typed Native API Client (`packages/ui/src/lib/api-client.ts`)**:
  - Xây dựng HTTP client hướng type-safe, bọc trực tiếp native Fetch API (0 bundle overhead so với axios 35KB).
  - Tự động parse JSON, tự động bắt lỗi HTTP `!res.ok`, tự động timeout 15s (AbortController), tự động chuyển hướng `/login` khi gặp HTTP 401.
  - Hỗ trợ đầy đủ `api.get`, `api.post`, `api.put`, `api.patch`, `api.delete` (có hỗ trợ batch payload), `api.upload` (FormData).
  - **Chuyển đổi 100% các lệnh gọi fetch thủ công rải rác sang `api`**:
    - `apps/console`: `app-workspace-store.ts`, `users-store.ts`, `storage-store.ts`, `telebot-store.ts`, `permissions-store.ts`, `database/hooks/use-database-manager.ts`, `database/components/database-sql-runner-modal.tsx`, `apps/page.tsx`, `apps/editor/page.tsx`, `blog-posts/page.tsx`, `blog-posts/editor/page.tsx`, `settings/components/profile-edit-card.tsx`, `console-sidebar.tsx`, `dashboard/page.tsx`.
    - `apps/web`: `blog-interactions.tsx`, `blog-comments-section.tsx`.
- **Kiến trúc Quản lý State Hiệu năng Cao**:
  - Toàn bộ state nghiệp vụ sử dụng Zustand v5 (`zustand: ^5.0.3`) theo từng domain module, hoàn toàn không lạm dụng React Context (`createContext = 0`), ngăn chặn triệt để hiện tượng re-render domino.
- **Hook & Nút Sao Chép Dùng Chung (`useClipboard` & `<CopyButton />`)**:

### 1.7. Chuẩn hóa 100% Real Data cho Ma Trận Phân Quyền Root IAM
- **Xóa bỏ triệt để Mock Data / Fake Resources**:
  - Gỡ bỏ hoàn toàn các resource mẫu không có trong hệ thống (`files`, `messages`, `clients`, `roles`) cùng các con số quyền giả lập (`13 q`, `5 q`, `3 q`) từ worker template.
  - Chuẩn hóa 7 Module Tài nguyên Thực tế (Real Resources) của hệ sinh thái VNTEZ:
    1. `apps`: Quản lý Ứng dụng & OAuth (Client ID, Secret, Redirect URIs)
    2. `users`: Tài khoản & Định danh người dùng (Supabase Auth & Roles)
    3. `database`: Cơ sở dữ liệu Postgres & DDL / SQL Runner
    4. `blog`: Quản trị Bài viết & Bình luận Blog
    5. `storage`: Quản lý Tệp tin Lưu trữ Đám mây Cloudflare R2
    6. `telebot`: Telegram Bot Webhook & Quản lý Người đăng ký
    7. `settings`: Cài đặt Toàn cục & Cấu hình Hệ thống
  - Chuẩn hóa 4 Vai trò Root Cốt lõi (Real Roles) đồng bộ với phân hệ `/users`:
    - `admin`: Super Admin (Toàn quyền `*:*` 49/49 quyền)
    - `developer`: Lập trình viên Hệ thống (Storage R2, TeleBot, Database, Apps)
    - `operator`: Quản trị Vận hành (Blog, TeleBot broadcast, Users)
    - `viewer`: Người xem (Chỉ đọc thông tin công khai)
- **Lưu trữ Bền vững trên Cloudflare R2 ([`/api/permissions`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/app/api/permissions/route.ts))**:
  - Xây dựng endpoint nội bộ `/api/permissions` đọc & ghi trực tiếp file `root_iam_matrix.json` vào Cloudflare R2 bucket (`vntez-bucket`).
  - Khi Admin tích chọn/bỏ chọn quyền và bấm "Lưu thay đổi", toàn bộ quyền hạn được lưu tức thì vào R2, không bao giờ bị reset về mock data của worker khi tải lại trang.
- **Thẻ Ma Trận Phân Quyền Toàn Cục trên Dashboard ([`GlobalPermissionsMatrixCard`](file:///home/hnamhocit/Workspace/frontend/vntez/apps/console/components/dashboard/global-permissions-matrix-card.tsx))**:
  - Cập nhật 6 cột tài nguyên thực tế (`apps`, `users`, `database`, `storage`, `telebot`, `blog`) và 4 roles thật (`admin`, `developer`, `operator`, `viewer`).
- **Tuân thủ Tuyệt đối Quy tắc Kiến trúc**:
  - `find apps packages ... wc -l >= 300`: Kết quả **0 dòng** (100% file `.ts`/`.tsx` $< 300$ dòng).
  - `bun run typecheck`: 6/6 packages thành công với 0 lỗi.
  - `bun run build`: 4/4 ứng dụng biên dịch thành công.
  - Tạo [`useClipboard`](packages/ui/src/hooks/use-clipboard.ts) và [`CopyButton`](packages/ui/src/components/copy-button.tsx) trong `@workspace/ui`.
  - Tự động fallback cho mọi trình duyệt, đổi icon phản hồi 2s, loại bỏ boilerplate state `copiedId`/`setTimeout` ở `dashboard-header.tsx`, `registered-clients-card.tsx`, `files-table.tsx`, `blog-interactions.tsx`.
- **Bộ Tiện ích Định dạng Dữ liệu Chuẩn Hóa (`formatters.ts`)**:
  - Xây dựng [`packages/ui/src/lib/formatters.ts`](packages/ui/src/lib/formatters.ts) tận dụng native `Intl` APIs (`formatBytes`, `formatDate`, `formatRelativeTime`, `formatNumber`).
  - Thay thế toàn bộ các hàm `formatBytes` và `formatDate` tự viết rải rác trong `storage-meter-card.tsx`, `files-table.tsx`, `users-table.tsx`, `user-detail-drawer.tsx`.
- **Validation Dữ liệu Đầu vào bằng `zod`**:
  - Sử dụng `zod` để validate schema cho API routes `POST /api/apps` và `POST /api/users/update`, thay thế hàng loạt câu lệnh if-else thủ công và đảm bảo type safety.

### 1.7. Hoàn thiện Cấu trúc DDL & Tích hợp Monaco Editor cho Modal DDL
- Cập nhật [`database-sql-modal.tsx`](apps/console/app/database/components/database-sql-modal.tsx): Thay thế thẻ `<pre>` trơn bằng `@monaco-editor/react` hiển thị toàn bộ 5 bảng DDL có syntax highlighting sắc nét (`language="sql"`, line numbers, theme `vs-dark`/`light`).
- Bổ sung bảng 5: `telebot_subscribers` với đầy đủ trường `email TEXT NOT NULL` (bắt buộc), `user_id UUID REFERENCES auth.users(id)`, `chat_id BIGINT PRIMARY KEY`, `username`, `first_name`, `tags`, RLS policies.

### 1.8. Quản trị Telegram Subscribers & Deep Linking Kết nối Tài khoản (`/telebot`)
- **API Route CRUD Subscribers (`/api/telebot/subscribers`)**:
  - `GET`: Lấy danh sách subscribers từ bảng `telebot_subscribers` (bọc an toàn nếu bảng chưa tạo).
  - `POST`: Upsert subscriber với validation bắt buộc `email` và `chat_id`.
  - `DELETE`: Hủy liên kết theo `chat_id`.
- **Widget Deep Linking Liên kết Tài khoản ([`TelegramConnectCard`](apps/console/app/telebot/components/telegram-connect-card.tsx))**:
  - Tự động nhận diện session đăng nhập của người dùng (`user.sub`, `user.email`).
  - Sinh liên kết Telegram Deep Link cá nhân: `https://t.me/vntez_bot?start=bind_${userId}`.
  - Hỗ trợ 1-click mở ứng dụng Telegram và Copy Link nhanh.
  - Trực quan hóa trạng thái liên kết (đã kết nối với email nào hoặc hướng dẫn người dùng kết nối).
- **Giao diện Subscribers & Modal Thêm Thủ công**:
  - Cập nhật [`SubscribersTable`](apps/console/app/telebot/components/subscribers-table.tsx) với các cột mới: Email, Tài khoản kết nối (User ID), Tag phân loại, nút Xóa/Hủy liên kết.
  - Tạo [`AddSubscriberModal`](apps/console/app/telebot/components/add-subscriber-modal.tsx) hỗ trợ đăng ký thủ công nếu subscriber chưa chat với Bot.

### 1.9. Tối ưu Hiệu năng Toàn diện với `Promise.all` & Tái sử dụng Schema/Metadata
- **Tập trung hóa Schema & Metadata Dùng chung ([`database-schema-constants.ts`](apps/console/app/database/database-schema-constants.ts))**:
  - `TABLE_METADATA_MAP`: Chuẩn hóa tên bảng, nhãn danh mục (Tag), mô tả chi tiết tiếng Việt và danh sách cột trọng tâm mặc định cho toàn bộ bảng hệ thống (`apps`, `app_requests`, `oauth_codes`, `blog_posts`, `blog_comments`, `telebot_subscribers`, `oauth_clients`).
  - `getTableDisplayInfo(tableName)`: Dùng chung thống nhất giữa [`DatabaseTableTabs`](apps/console/app/database/components/database-table-tabs.tsx), [`SqlSchemaSidebar`](apps/console/app/database/components/sql-schema-sidebar.tsx) và [`SqlCodeEditor`](apps/console/app/database/components/sql-code-editor.tsx).
  - `generateSelectQuery(tableName, limit)`: Tự động sinh câu lệnh `SELECT` tinh gọn (chỉ chọn các cột quan trọng thay vì `SELECT *` gây nghẽn băng thông).
  - `SQL_KEYWORDS`: Tập trung danh sách từ khóa SQL chuẩn.
- **Tối ưu Quản lý Vòng đời Monaco Provider**:
  - Lưu trữ `IDisposable` của `registerCompletionItemProvider` vào ref, tự động dispose trước khi đăng ký mới và khi component unmount để chống rò rỉ bộ nhớ (memory leak) và trùng lặp gợi ý autocomplete.
  - Tích hợp tài liệu mô tả bảng trực tiếp vào IntelliSense của Monaco.
- **Tối ưu Song song hóa Bằng `Promise.all`**:
  - **`/api/database/tables`**: Chuyển đổi vòng lặp `for` tuần tự truy vấn `rowCount` của từng bảng sang `await Promise.all(...)`. Tất cả các bảng được đếm dòng đồng thời song song, giảm thời gian phản hồi API từ 6x xuống 1x latency.
  - **`useDatabaseManager`**: Thay thế các cặp lệnh gọi tuần tự `await fetchRows(); await fetchTables();` sau khi xóa/lưu bản ghi bằng `await Promise.all([fetchRows(), fetchTables()]);`.
  - **`/api/apps`**: Chạy đồng thời `await Promise.all([getStoredApps(), fetchAppMetadataMap()]);`.
  - **`/api/users` DELETE**: Chạy đồng thời xóa mã OAuth và xóa User trong Supabase Auth bằng `Promise.all`.

### 1.10. Sửa Lỗi Khóa Chính Tự Động cho Các Bảng Không Dùng `id` (Slug, Chat ID, Code)
- **Nhận diện Khóa Chính Thông Minh ([`/api/database/tables`](apps/console/app/api/database/tables/route.ts))**:
  - Không còn mặc định gán cứng `primaryKey = "id"` khiến các bảng không có cột `id` (như `blog_posts` dùng `slug`, `telebot_subscribers` dùng `chat_id`, `oauth_codes` dùng `code`) bị lỗi `undefined` và `column id does not exist`.
  - Kết hợp 3 tầng nhận diện: Tra cứu OpenAPI `<pk/>` -> Tra cứu bảng ánh xạ chuẩn `TABLE_METADATA_MAP[tableName].primaryKey` -> Quét các tên khóa phổ biến (`slug`, `chat_id`, `code`, `client_id`) -> Fallback cột đầu tiên.
  - Gán chính xác cờ `isPrimaryKey = true` cho cột khóa chính thực tế.
- **Xử lý An toàn trong CRUD Rows ([`/api/database/rows`](apps/console/app/api/database/rows/route.ts))**:
  - `PATCH`: Tự động tách và loại trừ trường khóa chính ra khỏi payload cập nhật để tránh lỗi Postgres mutation. Tự động ép kiểu số đối với các khóa kiểu số nguyên lớn (`chat_id: BIGINT`).
  - `DELETE`: Lọc sạch các giá trị rỗng/undefined trước khi thực hiện `.in(pkField, pks)`.

### 1.11. Chuẩn Hóa Phân Quyền: Root IAM Toàn Cục (`/permissions`) & Ma Trận Độc Lập Cho Từng App (`/apps/[id]`)
- **Tách bạch Kiến trúc Tuyệt đối (Architecture Boundary)**:
  - Phân hệ `/permissions`: Chuyên trách duy nhất và độc quyền cho **Hệ thống Root Toàn Cục (`app_id: null`)**, loại bỏ hoàn toàn dropdown chuyển đổi ứng dụng rườm rà.
  - Phân hệ `/apps/[id]`: Tự quản lý độc lập ma trận phân quyền của chính ứng dụng đó (`/apps/[id]` -> tab `Phân quyền`).
- **Giao diện Root IAM Tối Giản, Không Trùng Lặp ([`permissions/page.tsx`](apps/console/app/permissions/page.tsx))**:
  - Gỡ bỏ component `AppScopeSelector` và dropdown danh sách app thừa.
  - Hợp nhất thanh tác vụ [`RoleSelector`](apps/console/app/permissions/components/role-selector.tsx) tích hợp đồng bộ: Dropdown chọn vai trò Root, nút `+ Thêm Resource` (Root) và nút `+ Tạo Role` (Root) trên cùng 1 hàng duy nhất, loại bỏ triệt để hiện tượng trùng lặp nút "Tạo Role".
  - Quản lý linh hoạt tài nguyên Root qua [`CreateResourceModal`](apps/console/app/permissions/components/create-resource-modal.tsx).
- **Tự Quản lý Tài nguyên & Vai trò cho Từng App ([`/apps/[id]`](apps/console/app/apps/[id]/components/tabs/permissions-tab.tsx))**:
  - Cập nhật [`PermissionsToolbar`](apps/console/app/apps/[id]/components/tabs/permissions/permissions-toolbar.tsx) và [`CreateAppResourceModal`](apps/console/app/apps/[id]/components/tabs/create-app-resource-modal.tsx): Cho phép từng app tự tạo resource riêng (VD: `lessons`, `snippets`, `repos`, `billing`) và role riêng.
- **Thẻ Ma Trận Phân Quyền Toàn Cục trên Dashboard ([`GlobalPermissionsMatrixCard`](apps/console/components/dashboard/global-permissions-matrix-card.tsx))**:
  - Hiển thị trực tiếp ma trận phân quyền cấp Root (`app_id: null`) ngay tại màn hình Dashboard tổng quan.
  - Trực quan hóa 4 vai trò cốt lõi (`Super Admin`, `Developer`, `Member`, `Viewer`) cùng bảng ma trận mini kiểm tra quyền trên 5 tài nguyên hệ thống trọng tâm (`Users`, `Clients`, `Database`, `Storage`, `TeleBot`).

### 1.6. Tối Ưu Font Size Bảng Dữ Liệu & Khắc Phục Triệt Để Loading Skeleton Khi Đổi Table
- **Tăng Kích Thước Chữ (Font Size) Bảng Dữ Liệu — Đọc Dễ Dàng, Không Mỏi Mắt**:
  - Tại [`DatabaseGrid`](apps/console/app/database/components/database-grid.tsx):
    - Đổi font base từ `text-xs` (12px) lên `text-sm` (14px).
    - Cột tiêu đề header: Cỡ chữ `text-sm font-bold text-foreground`, nhãn kiểu dữ liệu `text-xs font-mono text-muted-foreground/75`.
    - Dòng dữ liệu: Dữ liệu văn bản (họ tên, email, tên dự án) hiển thị với font chuẩn `text-sm font-normal text-foreground`, dữ liệu mã/UUID hiển thị với `font-mono text-[13px] tracking-tight`.
    - Giá trị `NULL`: Hiển thị màu xám nhạt `text-xs font-mono italic`.
    - Trạng thái `boolean` & `JSON`: Huy hiệu rõ nét `text-xs font-mono px-2.5 py-0.5`.
    - Đệm padding dòng: Tăng từ `py-2.5` lên `py-3.5 px-4.5` tạo độ thoáng đãng cao cấp.
    - Đồng bộ cỡ chữ chuẩn `text-sm` cho [`FilesTable`](apps/console/app/storage/components/files-table.tsx) và [`SubscribersTable`](apps/console/app/telebot/components/subscribers-table.tsx).
- **Hệ Thống Tô Màu Cú Pháp & Kiểu Dữ Liệu Chuẩn Supabase Studio ([`database-cell-formatter.tsx`](apps/console/app/database/components/database-cell-formatter.tsx))**:
  - **Huy hiệu kiểu dữ liệu header có màu phân loại riêng biệt**:
    - `PK` & `uuid`: Màu hổ phách/vàng (`bg-amber-500/15 text-amber-700`).
    - `int` / `number`: Màu xanh lam (`bg-blue-500/10 text-blue-600`).
    - `bool`: Màu ngọc lục bảo (`bg-emerald-500/10 text-emerald-600`).
    - `timestamptz`: Màu cam lịch (`bg-orange-500/10 text-orange-600`).
    - `jsonb`: Màu tím (`bg-purple-500/10 text-purple-600`).
    - `array`: Màu chàm (`bg-indigo-500/10 text-indigo-600`).
    - `text`: Màu xám thanh lịch (`bg-zinc-500/10 text-zinc-600`).
  - **Tô màu ngữ nghĩa cho từng loại giá trị thực tế**:
    - `Primary Key` & `slug` & `UUID`: Màu hổ phách font monospace nổi bật.
    - `status` (`active`, `approved`, `published`, `pending`, `rejected`): Badge trạng thái có chấm tròn phát sáng (green/amber/red).
    - `category`: Chip danh mục màu xanh trời dịu mát (`bg-sky-500/10 text-sky-700`).
    - `email`: Icon `Mail` kèm font monospace màu xanh biển.
    - `url`: Icon `ExternalLink` kèm link click mở tab mới.
    - `timestamptz`: Icon `Calendar` kèm định dạng ngày giờ tiếng Việt màu cam.
    - `number`: Số lượng định dạng có dấu chấm phân cách hàng nghìn màu xanh dương.
    - `boolean`: Nút tròn xanh/đỏ với icon `Check`/`X`.
- **Tối Ưu Chọn Bảng: Flex Wrap Toàn Bộ & Dropdown Tìm Kiếm Autocomplete ([`table-search-combobox.tsx`](apps/console/app/database/components/table-search-combobox.tsx) & [`database-table-tabs.tsx`](apps/console/app/database/components/database-table-tabs.tsx))**:
  - **Triệt tiêu cuộn ngang phiền toái (Mặc định Flex Wrap)**:
    - Thay thế cơ chế ép cuộn ngang 1 dòng bằng chế độ **Flex Wrap** (`flex flex-wrap gap-1.5`).
    - Tất cả 10+ bảng dữ liệu tự động xuống dòng và hiển thị đầy đủ ngay trước mắt, không bảng nào bị che khuất hay phải dùng nút bấm cuộn.
    - Cung cấp nút chuyển đổi linh hoạt: `Tất cả (Flex)` vs `Cuộn ngang (Scroll)` theo sở thích.
  - **Dropdown Tìm Kiếm & Autocomplete (Ctrl + K)**:
    - Component [`TableSearchCombobox`](apps/console/app/database/components/table-search-combobox.tsx) tích hợp ngay góc trên bên trái thanh tab.
    - Hiển thị bảng hiện tại kèm số dòng dữ liệu.
    - Khi bấm mở (hoặc nhấn phím tắt `Ctrl + K` / `Cmd + K`), hiển thị popup tìm kiếm tự động focus:
      - Gõ ký tự bất kỳ để lọc danh sách bảng theo thời gian thực (real-time filtering).
      - Hiển thị tên bảng, số bản ghi và dấu tick xác nhận bảng đang chọn.
      - 1-click hoặc nhấn Enter là chuyển ngay tới bảng mong muốn.
- **Khắc Phục Triệt Để Skeleton Loading Của Thanh Tab Khi Đổi Table**:
  - **Không fetch lại danh sách bảng**: `fetchTables` trong [`useDatabaseManager`](apps/console/app/database/hooks/use-database-manager.ts) chỉ chạy duy nhất 1 lần khi mount trang (bỏ `selectedTableName` khỏi dependency).
  - **Tab bar không bao giờ unmount hay hiện skeleton khi chuyển bảng**: Trong [`DatabaseTableTabs`](apps/console/app/database/components/database-table-tabs.tsx), điều kiện hiển thị skeleton là `if (isLoading && tables.length === 0)`. Khi đã có danh sách bảng, thanh tab duy trì 100% hiển thị mượt mà.
  - **Bộ nhớ đệm trong phiên (In-memory Cache `rowsCache`)**: Dữ liệu các dòng của các bảng đã tải được cache theo key `${tableName}:${page}:${limit}:${searchQuery}`, chuyển đổi qua lại giữa các tab diễn ra tức thì trong 0ms mà không cần set `isLoadingRows = true`.
  - **Loại bỏ trùng lặp tab `app_requests`**: Cập nhật mapping `oauth_client_requests` hiển thị đúng tên thật, xóa bỏ hoàn toàn nhầm lẫn với bảng `public.app_requests`.

- **Đạt chuẩn Kiểm Thử Tuyệt Đối**:
  - `find apps packages` kiểm tra độ dài file: 100% các file `.ts`/`.tsx` đều $< 300$ dòng.
  - `bun run typecheck`: 6/6 packages thành công (0 errors).
  - `bun run build`: Biên dịch thành công 4/4 apps (`console`, `web`, `docs`, `legal`).

### 1.7. Hệ Thống Dữ Liệu Thật Supabase Cho Không Gian Làm Việc Từng Ứng Dụng (`/apps/[id]`)
- **Tạo và Seed 4 Bảng Postgres Cốt Lõi Trên Supabase**:
  1. `public.app_remote_configs`: Lưu trữ cấu hình JSON động và feature flags cho từng app (`app_id TEXT PK`, `config JSONB`, `is_enabled BOOLEAN`, `updated_at TIMESTAMPTZ`). Đã nạp dữ liệu runtime thực tế cho cả 5 apps (`solotype`, `vntez-iam`, `workers-hub`, `bonsai-reader`, `gitvn`).
  2. `public.app_permissions`: Lưu trữ ma trận vai trò, tài nguyên và quyền hạn riêng biệt theo domain nghiệp vụ của từng app (`app_id TEXT PK`, `roles JSONB`, `resources JSONB`, `role_permissions JSONB`, `updated_at TIMESTAMPTZ`).
     - `solotype`: Các tài nguyên gõ phím (`typing_tests`, `leaderboards`, `custom_texts`, `user_stats`, `analytics`) & vai trò (`admin`, `pro_typist`, `member`, `viewer`).
     - `vntez-iam`: Các tài nguyên danh tính (`oauth_clients`, `tokens`, `identities`, `audit_logs`, `security_policies`) & vai trò (`admin`, `developer`, `auditor`).
     - `workers-hub`: Các tài nguyên serverless (`workers`, `kv_namespaces`, `r2_buckets`, `d1_databases`, `telemetry`) & vai trò (`admin`, `operator`, `viewer`).
     - `bonsai-reader`: Các tài nguyên đọc sách (`books`, `annotations`, `reading_sessions`, `sync_state`, `collections`) & vai trò (`admin`, `reader`).
     - `gitvn`: Các tài nguyên git (`repositories`, `branches`, `commits`, `kanban_boards`, `wiki_pages`) & vai trò (`admin`, `maintainer`, `contributor`).
  3. `public.app_docs_pages`: Lưu trữ tài liệu MDX kỹ thuật của từng app (`id TEXT PK`, `app_id TEXT`, `slug TEXT`, `title TEXT`, `category TEXT`, `order_index INT`, `content TEXT`, `updated_at TIMESTAMPTZ`). Đã seed 19 trang MDX thật từ `apps/docs/src/content/docs/`.
  4. `public.app_legal_docs`: Lưu trữ chính sách bảo mật và điều khoản pháp lý của từng app (`id TEXT PK`, `app_id TEXT`, `slug TEXT`, `title TEXT`, `version TEXT`, `effective_date TEXT`, `content TEXT`, `updated_at TIMESTAMPTZ`). Đã seed 10 văn bản pháp lý thật từ `apps/legal/src/content/legal/`.
- **Nâng Cấp Monaco Editor Cho Tab Remote Config ([`json-code-editor.tsx`](apps/console/components/json-code-editor.tsx))**:
  - Tích hợp `@monaco-editor/react` với ngôn ngữ `json`, đồng bộ theme VS Code (`vs-dark` / `light`), số dòng, tô màu cú pháp chuẩn xác, hiển thị lỗi JSON tức thì và nút định dạng / sao chép JSON.
  - Tinh giản giao diện [`remote-config-tab.tsx`](apps/console/app/apps/[id]/components/tabs/remote-config-tab.tsx): Gỡ bỏ các card toggle và form thêm key rườm rà, thay bằng live API endpoint card và Monaco Editor toàn màn hình.
- **Sửa Lỗi SQL Executor Không Masking Lỗi Postgres ([`sql-executor.ts`](apps/console/lib/sql-executor.ts))**:
  - Phân luồng câu lệnh `SELECT` về DML parser trả về bảng dữ liệu đầy đủ thay vì rỗng.
  - Tách bạch lỗi `rpcError`: Nếu lỗi Postgres (syntax error, constraint, relation exists) thì trả về đúng thông báo lỗi gốc từ Postgres thay vì nuốt lỗi và hiển thị thông báo DDL chung chung.
- **Khắc phục Triệt để Trùng lặp Bảng Trong Trang Database ([`route.ts`](apps/console/app/api/database/tables/route.ts))**:
  - Thêm cơ chế deduplicate theo `table.name` đảm bảo không bao giờ xuất hiện 2 tab cùng tên.

---

## 2. KẾ HOẠCH CHO PHIÊN LÀM VIỆC TIẾP THEO (NEXT PRIORITIES)

### ƯU TIÊN TIẾP THEO: Hoàn thiện Quản lý Ứng dụng & Remote Config Nâng cao
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
