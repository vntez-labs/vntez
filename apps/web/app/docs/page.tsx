import type { Metadata } from "next"
import { DocsHubClient } from "./docs-hub-client"

export const metadata: Metadata = {
  title: "Tài liệu kỹ thuật — vntez Developer Hub",
  description:
    "Trung tâm tài liệu kỹ thuật tổng hợp toàn bộ hệ sinh thái VNTEZ: Định danh & Phân quyền IAM (vntez-iam), Lưu trữ Edge NVMe S3 API, Bán lẻ Offline-First (BMAN POS), Quản lý kho WMS và Telemetry.",
}

export default function DocsPage() {
  return <DocsHubClient />
}
