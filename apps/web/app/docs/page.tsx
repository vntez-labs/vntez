import { redirect } from "next/navigation"

const DOCS_BASE_URL =
  process.env.NEXT_PUBLIC_DOCS_URL || "https://vntez-docs.vercel.app"

export default function DocsPage() {
  redirect(`${DOCS_BASE_URL}/docs/workers-hub`)
}
