"use client"

import React from "react"
import { useDocsHub } from "./use-docs-hub"
import { DocsSidebar } from "./components/docs-sidebar"
import { DocsContentColumn } from "./components/docs-content-column"
import { DocsCodeConsole } from "./components/docs-code-console"

export function DocsHubClient() {
  const {
    activeFilter,
    setActiveFilter,
    currentApp,
    searchQuery,
    setSearchQuery,
    activeSectionId,
    setActiveSectionId,
    activeSection,
    filteredSections,
    copiedId,
    handleCopy,
  } = useDocsHub()

  return (
    <div className="w-full border-t border-black/[0.06] dark:border-white/[0.06] bg-background">
      {/* 3-Column Redoc / Stripe Layout */}
      <div className="mx-auto flex flex-col xl:flex-row min-h-[calc(100vh-64px)] items-start">
        {/* Column 1: Sidebar (App Switcher + Endpoints Tree + Search + OpenAPI) */}
        <DocsSidebar
          activeFilter={activeFilter}
          currentApp={currentApp}
          onSelectApp={setActiveFilter}
          sections={filteredSections}
          activeSectionId={activeSectionId}
          onSelectSection={setActiveSectionId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Column 2: Center Content (Specifications, Parameters & Description) */}
        <DocsContentColumn
          section={activeSection}
          copiedId={copiedId}
          onCopy={handleCopy}
        />

        {/* Column 3: Right Code Console (Interactive Sandbox, Syntax Highlight & Response) */}
        <DocsCodeConsole
          section={activeSection}
          copiedId={copiedId}
          onCopy={handleCopy}
        />
      </div>
    </div>
  )
}
