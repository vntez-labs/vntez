import { IconUpload, IconDownload, IconTrash } from "@tabler/icons-react"
import type { DocSection } from "../types"
import { buildUniversalCodeSubtabs } from "../code-samples-generator"

export const storagePutSection: DocSection = {
  id: "storage-put",
  appId: "storage",
  title: "1. Tải lên Đối tượng (PUT Object)",
  category: "Lưu trữ đối tượng",
  badge: "AWS S3 API",
  icon: IconUpload,
  desc: "Tải file trực tiếp lên bucket lưu trữ S3 tương thích. Vận hành trên cụm máy chủ NVMe PCIe 5.0 nội địa, tối ưu hóa băng thông truyền tải và độ trễ dưới 5ms.",
  endpoint: {
    method: "PUT",
    path: "https://storage.vntez.cloud/{bucket}/{key}",
  },
  params: [
    {
      name: "bucket",
      in: "path",
      type: "string",
      required: true,
      description: "Tên bucket lưu trữ.",
      example: "production-assets",
    },
    {
      name: "key",
      in: "path",
      type: "string",
      required: true,
      description: "Đường dẫn file định danh trong bucket.",
      example: "avatars/usr_102.png",
    },
    {
      name: "Content-Type",
      in: "header",
      type: "string",
      required: true,
      description: "MIME type của file tải lên.",
      example: "image/png",
    },
  ],
  responses: [
    {
      status: 200,
      description: "File được tải lên và nhân bản thành công qua cụm NVMe.",
      json: JSON.stringify(
        {
          ETag: '"d41d8cd98f00b204e9800998ecf8427e"',
          Location: "https://storage.vntez.cloud/production-assets/avatars/usr_102.png",
          VersionId: "v_109283741982",
          StorageClass: "STANDARD_NVME",
        },
        null,
        2,
      ),
    },
    {
      status: 403,
      description: "Access Key không đủ quyền ghi vào bucket chỉ định.",
      json: JSON.stringify(
        {
          Code: "AccessDenied",
          Message: "User has insufficient permissions to perform PutObject on target bucket.",
        },
        null,
        2,
      ),
    },
    {
      status: 413,
      description: "Dung lượng file vượt quá giới hạn tối đa cho phép (500MB).",
      json: JSON.stringify(
        {
          Code: "EntityTooLarge",
          Message: "Your proposed upload exceeds the maximum allowed object size of 500MB.",
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "PUT",
    url: "https://storage.vntez.cloud/production-assets/avatars/usr_102.png",
    headers: {
      "Authorization": "AWS4-HMAC-SHA256 Credential=...",
      "Content-Type": "image/png",
    },
    body: "<binary image buffer or base64>",
  }),
}

export const storageGetSection: DocSection = {
  id: "storage-get",
  appId: "storage",
  title: "2. Tải về & Presigned URL (GET Object)",
  category: "Lưu trữ đối tượng",
  badge: "GET /{bucket}/{key}",
  icon: IconDownload,
  desc: "Truy xuất đối tượng hoặc sinh Presigned Download URL có chữ ký bảo mật thời hạn ngắn.",
  endpoint: {
    method: "GET",
    path: "https://storage.vntez.cloud/{bucket}/{key}",
  },
  params: [
    {
      name: "bucket",
      in: "path",
      type: "string",
      required: true,
      description: "Tên bucket.",
      example: "production-assets",
    },
    {
      name: "key",
      in: "path",
      type: "string",
      required: true,
      description: "Đường dẫn file.",
      example: "reports/q3_2026.pdf",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Trả về nhị phân nội dung file cùng header Content-Type và ETag.",
      json: JSON.stringify(
        {
          ContentLength: 1048576,
          ContentType: "application/pdf",
          LastModified: "2026-10-31T08:00:00Z",
        },
        null,
        2,
      ),
    },
    {
      status: 404,
      description: "Đối tượng (Object key) không tồn tại trong bucket chỉ định.",
      json: JSON.stringify(
        {
          Code: "NoSuchKey",
          Message: "The specified key does not exist.",
          Key: "reports/q3_2026.pdf",
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "GET",
    url: "https://storage.vntez.cloud/production-assets/reports/q3_2026.pdf",
    headers: {
      Authorization: "AWS4-HMAC-SHA256 ...",
    },
  }),
}

export const storageDeleteSection: DocSection = {
  id: "storage-delete",
  appId: "storage",
  title: "3. Xóa Đối tượng (DELETE Object)",
  category: "Lưu trữ đối tượng",
  badge: "DELETE /{bucket}/{key}",
  icon: IconTrash,
  desc: "Xóa vĩnh viễn đối tượng khỏi bucket.",
  endpoint: {
    method: "DELETE",
    path: "https://storage.vntez.cloud/{bucket}/{key}",
  },
  params: [
    {
      name: "bucket",
      in: "path",
      type: "string",
      required: true,
      description: "Tên bucket.",
      example: "production-assets",
    },
    {
      name: "key",
      in: "path",
      type: "string",
      required: true,
      description: "Đường dẫn file cần xóa.",
      example: "temp/cache_982.tmp",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Đã xóa đối tượng thành công.",
      json: JSON.stringify({ deleted: true }, null, 2),
    },
    {
      status: 404,
      description: "Bucket hoặc đối tượng không tìm thấy để xóa.",
      json: JSON.stringify(
        {
          Code: "NoSuchBucket",
          Message: "The specified bucket does not exist.",
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "DELETE",
    url: "https://storage.vntez.cloud/production-assets/temp/cache_982.tmp",
    headers: {
      Authorization: "AWS4-HMAC-SHA256 ...",
    },
  }),
}
