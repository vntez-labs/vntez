"use client"

import React, { useMemo } from "react"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-python"
import "prismjs/components/prism-go"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-dart"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-markup-templating"
import "prismjs/components/prism-php"

const langMap: Record<string, string> = {
  ts: "typescript",
  typescript: "typescript",
  js: "javascript",
  javascript: "javascript",
  bash: "bash",
  sh: "bash",
  curl: "bash",
  py: "python",
  python: "python",
  go: "go",
  json: "json",
  markdown: "markdown",
  md: "markdown",
  dart: "dart",
  cs: "csharp",
  csharp: "csharp",
  "c#": "csharp",
  dotnet: "csharp",
  php: "php",
}

export function DocsCodeHighlight({
  code,
  language = "typescript",
  showLineNumbers = true,
}: {
  code: string
  language?: string
  showLineNumbers?: boolean
}) {
  const highlightedHtml = useMemo(() => {
    try {
      const normLang = langMap[language.toLowerCase()] || "typescript"
      const grammar =
        Prism.languages[normLang] ||
        Prism.languages.typescript ||
        Prism.languages.javascript
      if (!grammar) return code
      return Prism.highlight(code, grammar, normLang)
    } catch {
      return code
    }
  }, [code, language])

  const lines = useMemo(() => code.split("\n"), [code])

  return (
    <div className="relative font-mono text-[14px] sm:text-[15px] leading-[1.75] overflow-x-auto">
      <style jsx global>{`
        .prism-code .token.comment,
        .prism-code .token.prolog,
        .prism-code .token.doctype,
        .prism-code .token.cdata {
          color: #94a3b8;
          font-style: italic;
        }
        .prism-code .token.punctuation {
          color: #e2e8f0;
        }
        .prism-code .token.keyword {
          color: #e879f9;
          font-weight: 600;
        }
        .prism-code .token.string,
        .prism-code .token.attr-value {
          color: #4ade80;
        }
        .prism-code .token.function,
        .prism-code .token.class-name {
          color: #60a5fa;
          font-weight: 600;
        }
        .prism-code .token.number,
        .prism-code .token.boolean {
          color: #fbbf24;
        }
        .prism-code .token.property,
        .prism-code .token.tag,
        .prism-code .token.constant {
          color: #f472b6;
        }
        .prism-code .token.operator,
        .prism-code .token.entity,
        .prism-code .token.url {
          color: #38bdf8;
        }
      `}</style>
      <div className="flex">
        {showLineNumbers && (
          <div
            aria-hidden="true"
            className="select-none pr-4 text-right text-slate-500 font-mono text-[13px] sm:text-[14px] shrink-0 border-r border-white/10 mr-4"
          >
            {lines.map((_, i) => (
              <div key={i} className="leading-[1.75]">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <pre
            className="prism-code text-slate-100 whitespace-pre font-mono leading-[1.75] select-all"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </div>
      </div>
    </div>
  )
}
