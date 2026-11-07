import { IconGitBranch, IconLayoutKanban, IconBook } from "@tabler/icons-react";
import type { DocSection } from "../types";
import { buildUniversalCodeSubtabs } from "../code-samples-generator";

export const gitvnReposSection: DocSection = {
  id: "gitvn-repos",
  appId: "gitvn",
  title: "1. Quản lý Git Repository (Zero-Friction)",
  category: "GitVN Local-First Dev Platform",
  badge: "Repository Management",
  icon: IconGitBranch,
  desc: "Nền tảng Git Repository tối giản chạy local, loại bỏ mọi rào cản và độ trễ phức tạp (Zero-Friction). Chỉ tập trung vào những tính năng cốt lõi hay dùng nhất của git.",
  endpoint: {
    method: "GET",
    path: "https://gitvn.vntez.cloud/api/gitvn/repos",
  },
  params: [
    {
      name: "owner",
      in: "query",
      type: "string",
      required: false,
      description: "Lọc theo chủ sở hữu kho lưu trữ.",
      example: "hnamhocit",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Danh sách repositories nội bộ với tốc độ phản hồi < 5ms.",
      json: JSON.stringify(
        {
          success: true,
          total: 2,
          repositories: [
            {
              name: "vntez-core",
              clone_url_ssh: "git@gitvn.local:hnamhocit/vntez-core.git",
              default_branch: "main",
              commits_count: 342,
              last_push: "2026-11-07T08:15:00Z",
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
    url: "https://gitvn.vntez.cloud/api/gitvn/repos?owner=hnamhocit",
  }),
};

export const gitvnIssuesSection: DocSection = {
  id: "gitvn-issues",
  appId: "gitvn",
  title: "2. Quản lý Tác vụ & Issue (Tinh thần Jira tối giản)",
  category: "GitVN Local-First Dev Platform",
  badge: "Jira-like Tasks",
  icon: IconLayoutKanban,
  desc: "Quản lý công việc và tiến độ dự án tích hợp trực tiếp trong kho mã nguồn theo tinh thần Jira/Kanban tối giản: tạo issue, gán nhãn, ước lượng story points và liên kết git commit mà không cần công cụ bên thứ ba cồng kềnh.",
  endpoint: {
    method: "POST",
    path: "https://gitvn.vntez.cloud/api/gitvn/issues",
  },
  params: [
    {
      name: "repo",
      in: "body",
      type: "string",
      required: true,
      description: "Tên repository cần tạo tác vụ.",
      example: "vntez-core",
    },
    {
      name: "title",
      in: "body",
      type: "string",
      required: true,
      description: "Tiêu đề tác vụ (VD: 'Fix PKCE token verification').",
      example: "Fix PKCE token verification",
    },
    {
      name: "status",
      in: "body",
      type: "string",
      required: false,
      description: "Trạng thái cột Kanban: 'todo', 'in_progress', 'review', 'done'.",
      example: "todo",
    },
  ],
  responses: [
    {
      status: 201,
      description: "Tác vụ đã được ghi nhận trong Kanban board của repo.",
      json: JSON.stringify(
        {
          success: true,
          issue_key: "VNTEZ-42",
          title: "Fix PKCE token verification",
          status: "todo",
          created_at: "2026-11-07T08:20:00Z",
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "POST",
    url: "https://gitvn.vntez.cloud/api/gitvn/issues",
    body: {
      repo: "vntez-core",
      title: "Fix PKCE token verification",
      status: "todo",
    },
  }),
};

export const gitvnWikiSection: DocSection = {
  id: "gitvn-wiki",
  appId: "gitvn",
  title: "3. Tài liệu Dự án & Kiến thức (Tinh thần Confluence Markdown)",
  category: "GitVN Local-First Dev Platform",
  badge: "Confluence-like Wiki",
  icon: IconBook,
  desc: "Hệ thống tài liệu và cẩm nang kỹ thuật của dự án tổ chức theo tinh thần Confluence, định dạng Markdown/MDX thuần túy, lưu trữ trực tiếp trong repo và kết xuất tức thì không độ trễ.",
  endpoint: {
    method: "GET",
    path: "https://gitvn.vntez.cloud/api/gitvn/wiki",
  },
  params: [
    {
      name: "repo",
      in: "query",
      type: "string",
      required: true,
      description: "Tên repository chứa tài liệu wiki.",
      example: "vntez-core",
    },
    {
      name: "slug",
      in: "query",
      type: "string",
      required: false,
      description: "Đường dẫn trang tài liệu (mặc định trang chủ 'home').",
      example: "architecture-overview",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Nội dung bài viết tài liệu dạng Markdown.",
      json: JSON.stringify(
        {
          success: true,
          slug: "architecture-overview",
          title: "Kiến trúc Tổng thể Hệ thống VNTEZ",
          last_modified_by: "hnamhocit",
          content_md: "# Tổng quan Hệ sinh thái\n\nKiến trúc gồm 5 phân hệ cốt lõi...",
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "GET",
    url: "https://gitvn.vntez.cloud/api/gitvn/wiki?repo=vntez-core&slug=architecture-overview",
  }),
};
