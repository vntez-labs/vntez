import type { DocSection, AppFilter } from "./types"

export function generateOpenApiSpec(app: AppFilter, sections: DocSection[]) {
  const paths: Record<string, Record<string, unknown>> = {}

  for (const s of sections) {
    if (!s.endpoint) continue
    const { method, path } = s.endpoint
    let normalizedPath = path
    try {
      const u = new URL(path)
      normalizedPath = u.pathname
    } catch {
      // fallback
    }

    const opMethod = method.toLowerCase()
    if (!paths[normalizedPath]) paths[normalizedPath] = {}

    const parameters = (s.params || [])
      .filter((p) => p.in !== "body")
      .map((p) => ({
        name: p.name,
        in: p.in,
        required: p.required,
        description: p.description,
        schema: { type: p.type, example: p.example },
      }))

    const bodyParams = (s.params || []).filter((p) => p.in === "body")
    let requestBody = undefined
    if (bodyParams.length > 0) {
      const properties: Record<string, unknown> = {}
      const required: string[] = []
      bodyParams.forEach((bp) => {
        properties[bp.name] = { type: bp.type, description: bp.description, example: bp.example }
        if (bp.required) required.push(bp.name)
      })

      requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties,
              required,
            },
          },
        },
      }
    }

    const responses: Record<string, unknown> = {}
    if (s.responses && s.responses.length > 0) {
      s.responses.forEach((res) => {
        responses[String(res.status)] = {
          description: res.description,
          content: {
            "application/json": {
              example: JSON.parse(res.json || "{}"),
            },
          },
        }
      })
    } else {
      responses["200"] = { description: "Successful response" }
    }

    paths[normalizedPath]![opMethod] = {
      summary: s.title,
      description: s.desc,
      parameters: parameters.length > 0 ? parameters : undefined,
      requestBody,
      responses,
      tags: [s.category],
    }
  }

  return {
    openapi: "3.1.0",
    info: {
      title: `${app.label} Specification`,
      version: app.version || "1.0.0",
      description: `OpenAPI 3.1 definition for ${app.label}. Production ready within the VNTEZ ecosystem.`,
    },
    servers: [
      {
        url: "https://api.vntez.cloud",
        description: "VNTEZ Global Production Gateway",
      },
    ],
    paths,
  }
}
