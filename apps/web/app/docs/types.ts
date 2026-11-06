import React from "react"

export type DocMethod = "GET" | "POST" | "PUT" | "DELETE" | "WS"

export interface DocParam {
  name: string
  in: "query" | "header" | "path" | "body"
  type: string
  required: boolean
  description: string
  example?: string
}

export interface DocResponse {
  status: number
  description: string
  json: string
}

export interface DocSubtab {
  key: string
  label: string
  lang: string
  code: string
}

export interface DocSection {
  id: string
  appId: string
  title: string
  category: string
  badge: string
  icon: React.ComponentType<{ className?: string }>
  desc: string
  endpoint?: {
    method: DocMethod
    path: string
  }
  params?: DocParam[]
  responses?: DocResponse[]
  subtabs?: DocSubtab[]
  code?: string
  lang?: string
}

export interface AppFilter {
  id: string
  label: string
  iconName?: string
  version?: string
  color?: string
}
