import { NextResponse } from "next/server"
import { APP_FILTERS, DOC_SECTIONS } from "../../docs-data"
import { generateOpenApiSpec } from "../../openapi-generator"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appId: string }> },
) {
  const { appId } = await params
  const app = APP_FILTERS.find((f) => f.id === appId) || APP_FILTERS[0]!
  const sections = DOC_SECTIONS.filter((s) => s.appId === app.id)

  const spec = generateOpenApiSpec(app, sections)

  return NextResponse.json(spec, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
