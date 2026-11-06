import type { DocSection } from "./types"

/**
 * Xuất dữ liệu DocSection thành chuỗi MDX tiêu chuẩn
 * Tương thích với Mintlify, Nextra, Docusaurus, Astro Starlight và Fumadocs.
 */
export function generateMdx(section: DocSection): string {
  const method = section.endpoint?.method || "GET"
  const path = section.endpoint?.path || ""

  const frontmatter = `---
title: "${section.title.replace(/"/g, '\\"')}"
description: "${section.desc.replace(/"/g, '\\"')}"
category: "${section.category}"
badge: "${section.badge}"
endpoint:
  method: "${method}"
  path: "${path}"
---`

  let paramsTable = ""
  if (section.params && section.params.length > 0) {
    paramsTable = `\n## Tham số yêu cầu (Parameters)\n\n| Tên | Vị trí | Kiểu | Bắt buộc | Mô tả |\n| :--- | :--- | :--- | :--- | :--- |\n`
    for (const p of section.params) {
      const req = p.required ? "**Có**" : "Không"
      paramsTable += `| \`${p.name}\` | \`${p.in}\` | \`${p.type}\` | ${req} | ${p.description.replace(/\|/g, "\\|")} |\n`
    }
  }

  let codeTabs = ""
  if (section.subtabs && section.subtabs.length > 0) {
    codeTabs = `\n## Mã yêu cầu mẫu (Request Code Samples)\n\n`
    for (const tab of section.subtabs) {
      codeTabs += `### ${tab.label}\n\`\`\`${tab.lang}\n${tab.code}\n\`\`\`\n\n`
    }
  }

  let responseBlocks = ""
  if (section.responses && section.responses.length > 0) {
    responseBlocks = `\n## Phản hồi tiêu chuẩn (Response Specs)\n\n`
    for (const res of section.responses) {
      const is2xx = res.status >= 200 && res.status < 300
      responseBlocks += `### ${res.status} ${is2xx ? "OK" : "Error"}\n> ${res.description}\n\n\`\`\`json\n${res.json}\n\`\`\`\n\n`
    }
  }

  return `${frontmatter}

# ${section.title}

${section.desc}

\`${method}\` \`${path}\`
${paramsTable}${codeTabs}${responseBlocks}`
}

/**
 * Kích hoạt tải về file .mdx trực tiếp trên trình duyệt
 */
export function downloadMdxFile(section: DocSection) {
  const mdx = generateMdx(section)
  const blob = new Blob([mdx], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${section.id}.mdx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
