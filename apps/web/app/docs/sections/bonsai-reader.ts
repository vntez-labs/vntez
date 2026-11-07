import { IconBook2, IconBookmark } from "@tabler/icons-react";
import type { DocSection } from "../types";
import { buildUniversalCodeSubtabs } from "../code-samples-generator";

export const bonsaiLibrarySection: DocSection = {
  id: "bonsai-library",
  appId: "bonsai-reader",
  title: "1. Thư Viện Cá Nhân & Danh Mục Sách",
  category: "Bonsai Reader API",
  badge: "Library Management",
  icon: IconBook2,
  desc: "Truy xuất danh mục sách điện tử (ePub, PDF) và tài liệu Markdown/MDX trong tủ sách cá nhân của người dùng, hỗ trợ siêu dữ liệu bìa sách, mục lục TOC và tiến độ đọc.",
  endpoint: {
    method: "GET",
    path: "https://bonsai.vntez.cloud/api/reader/library",
  },
  params: [
    {
      name: "format",
      in: "query",
      type: "string",
      required: false,
      description: "Lọc theo định dạng tài liệu: 'epub', 'pdf' hoặc 'mdx'.",
      example: "epub",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Danh sách sách và tài liệu cá nhân.",
      json: JSON.stringify(
        {
          success: true,
          total: 2,
          books: [
            {
              id: "bk_clean_code",
              title: "Clean Code: A Handbook of Agile Software Craftsmanship",
              author: "Robert C. Martin",
              format: "epub",
              total_pages: 464,
              current_page: 128,
              progress_pct: 27.5,
            },
          ],
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "GET",
    url: "https://bonsai.vntez.cloud/api/reader/library?format=epub",
  }),
};

export const bonsaiProgressSection: DocSection = {
  id: "bonsai-progress",
  appId: "bonsai-reader",
  title: "2. Đồng Bộ Tiến Độ Đọc & Đánh Dấu (Bookmarks)",
  category: "Bonsai Reader API",
  badge: "Sync & Highlights",
  icon: IconBookmark,
  desc: "Lưu và đồng bộ thời gian thực vị trí trang đang đọc, đánh dấu đoạn trích (highlights), chú thích cá nhân (notes) xuyên suốt mọi thiết bị qua Cloudflare Edge.",
  endpoint: {
    method: "PUT",
    path: "https://bonsai.vntez.cloud/api/reader/progress",
  },
  params: [
    {
      name: "book_id",
      in: "body",
      type: "string",
      required: true,
      description: "Định danh sách cần đồng bộ tiến độ.",
      example: "bk_clean_code",
    },
    {
      name: "cfi_location",
      in: "body",
      type: "string",
      required: false,
      description: "Vị trí EPUB Canonical Fragment Identifier (CFI).",
      example: "epubcfi(/6/14[chapter-2]!/4/2/10/1:24)",
    },
    {
      name: "progress_pct",
      in: "body",
      type: "number",
      required: true,
      description: "Phần trăm hoàn thành bài đọc (0 - 100).",
      example: "35.2",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Tiến độ đọc đã được đồng bộ thành công trên Edge.",
      json: JSON.stringify(
        {
          success: true,
          book_id: "bk_clean_code",
          synced_at: "2026-11-07T08:12:00Z",
          progress_pct: 35.2,
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "PUT",
    url: "https://bonsai.vntez.cloud/api/reader/progress",
    body: {
      book_id: "bk_clean_code",
      cfi_location: "epubcfi(/6/14[chapter-2]!/4/2/10/1:24)",
      progress_pct: 35.2,
    },
  }),
};
