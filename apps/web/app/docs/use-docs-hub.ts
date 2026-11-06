"use client"

import { useState, useMemo } from "react"
import { DOC_SECTIONS, APP_FILTERS } from "./docs-data"
import type { DocSection, AppFilter } from "./types"
import { generateOpenApiSpec } from "./openapi-generator"

const defaultApp = APP_FILTERS[0]!

export function useDocsHub() {
  const [activeFilter, setActiveFilter] = useState<string>(defaultApp.id)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeSectionId, setActiveSectionId] = useState<string>(DOC_SECTIONS[0]!.id)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const currentApp: AppFilter = useMemo(() => {
    return APP_FILTERS.find((f) => f.id === activeFilter) || defaultApp
  }, [activeFilter])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr))
    }, 2500)
  }

  const filteredSections = useMemo((): DocSection[] => {
    return DOC_SECTIONS.filter((sec) => {
      const matchApp = sec.appId === activeFilter
      const q = searchQuery.toLowerCase().trim()
      if (!q) return matchApp

      const matchText =
        sec.title.toLowerCase().includes(q) ||
        sec.desc.toLowerCase().includes(q) ||
        sec.category.toLowerCase().includes(q) ||
        Boolean(sec.endpoint?.path.toLowerCase().includes(q)) ||
        Boolean(sec.params?.some((p) => p.name.toLowerCase().includes(q)))

      return matchApp && matchText
    })
  }, [activeFilter, searchQuery])

  const activeSection: DocSection = useMemo(() => {
    const found = filteredSections.find((s) => s.id === activeSectionId)
    return found || filteredSections[0] || DOC_SECTIONS[0]!
  }, [filteredSections, activeSectionId])

  const openApiSpec = useMemo(() => {
    return generateOpenApiSpec(currentApp, filteredSections)
  }, [currentApp, filteredSections])

  const handleSelectApp = (appId: string) => {
    setActiveFilter(appId)
    const firstOfApp = DOC_SECTIONS.find((s) => s.appId === appId)
    if (firstOfApp) {
      setActiveSectionId(firstOfApp.id)
    }
  }

  return {
    activeFilter,
    setActiveFilter: handleSelectApp,
    currentApp,
    searchQuery,
    setSearchQuery,
    activeSectionId: activeSection.id,
    setActiveSectionId,
    activeSection,
    filteredSections,
    openApiSpec,
    copiedId,
    handleCopy,
  }
}
