import { redirect } from "next/navigation"

const DOCS_BASE_URL =
  process.env.NEXT_PUBLIC_DOCS_URL || "https://vntez-docs.vercel.app"

interface DocsAppPageProps {
  params: Promise<{ appId: string }>
}

export const dynamic = "force-dynamic"

export default async function DocsAppPage({ params }: DocsAppPageProps) {
  const { appId } = await params
  redirect(`${DOCS_BASE_URL}/docs/${appId}`)
}
