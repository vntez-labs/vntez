import type { Metadata } from "next"
import { APP_FILTERS } from "../docs-data"
import { DocsHubClient } from "../docs-hub-client"

interface DocsAppPageProps {
  params: Promise<{ appId: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: DocsAppPageProps): Promise<Metadata> {
  const { appId } = await params
  const app = APP_FILTERS.find((f) => f.id === appId)

  if (!app) {
    return {
      title: "Tài liệu kỹ thuật — vntez Developer Hub",
      description: "Trung tâm tài liệu kỹ thuật tổng hợp hệ sinh thái công nghệ VNTEZ.",
    }
  }

  return {
    title: `${app.label} — Tài liệu kỹ thuật vntez`,
    description: `Tài liệu API, thông số kỹ thuật và hướng dẫn tích hợp cho ${app.label} (${app.version}).`,
  }
}

export default async function DocsAppPage({ params }: DocsAppPageProps) {
  const { appId } = await params
  return <DocsHubClient initialAppId={appId} />
}
