"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  IconCode,
  IconCopy,
  IconCheck,
  IconBrandGithub,
  IconBook,
} from "@tabler/icons-react"

type LangTab = "typescript" | "csharp" | "curl"

interface SnippetConfig {
  language: string
  filename: string
  raw: string
  highlighted: React.ReactNode
}

const SNIPPETS: Record<LangTab, SnippetConfig> = {
  typescript: {
    language: "TypeScript",
    filename: "client.ts",
    raw: `import { vntez } from '@vntez/sdk';

// Khởi tạo client với OAuth 2.0 PKCE
const client = new vntez({ appId: 'bman_pos_core' });

// Tải tệp lên Edge S3 tốc độ cao
await client.storage.upload(file, { multipart: true });`,
    highlighted: (
      <>
        <span className="text-purple-400 font-semibold">import</span>{" "}
        <span className="text-slate-400">{"{ "}</span>
        <span className="text-cyan-300">vntez</span>
        <span className="text-slate-400">{" }"}</span>{" "}
        <span className="text-purple-400 font-semibold">from</span>{" "}
        <span className="text-emerald-400">'@vntez/sdk'</span>
        <span className="text-slate-400">;</span>
        {"\n\n"}
        <span className="text-slate-500">// Khởi tạo client với OAuth 2.0 PKCE</span>
        {"\n"}
        <span className="text-purple-400 font-semibold">const</span>{" "}
        <span className="text-blue-300">client</span>{" "}
        <span className="text-slate-400">=</span>{" "}
        <span className="text-purple-400 font-semibold">new</span>{" "}
        <span className="text-amber-300 font-semibold">vntez</span>
        <span className="text-slate-400">{"({ "}</span>
        <span className="text-rose-300">appId</span>
        <span className="text-slate-400">: </span>
        <span className="text-emerald-400">'bman_pos_core'</span>
        <span className="text-slate-400">{" });"}</span>
        {"\n\n"}
        <span className="text-slate-500">// Tải tệp lên Edge S3 tốc độ cao</span>
        {"\n"}
        <span className="text-purple-400 font-semibold">await</span>{" "}
        <span className="text-blue-300">client</span>
        <span className="text-slate-400">.</span>
        <span className="text-cyan-300">storage</span>
        <span className="text-slate-400">.</span>
        <span className="text-amber-200">upload</span>
        <span className="text-slate-400">(</span>
        <span className="text-slate-200">file</span>
        <span className="text-slate-400">, {"{ "}</span>
        <span className="text-rose-300">multipart</span>
        <span className="text-slate-400">: </span>
        <span className="text-amber-400">true</span>
        <span className="text-slate-400">{" });"}</span>
      </>
    ),
  },
  csharp: {
    language: "C#",
    filename: "Program.cs",
    raw: `using Vntez.Sdk;

// Khởi tạo client với AppId
var client = new VntezClient("bman_pos_core");

// Upload đa phân mảnh tới cụm NVMe
await client.Storage.UploadAsync(fileStream, new UploadOptions {
    Multipart = true
});`,
    highlighted: (
      <>
        <span className="text-purple-400 font-semibold">using</span>{" "}
        <span className="text-cyan-300">Vntez.Sdk</span>
        <span className="text-slate-400">;</span>
        {"\n\n"}
        <span className="text-slate-500">// Khởi tạo client với AppId</span>
        {"\n"}
        <span className="text-purple-400 font-semibold">var</span>{" "}
        <span className="text-blue-300">client</span>{" "}
        <span className="text-slate-400">=</span>{" "}
        <span className="text-purple-400 font-semibold">new</span>{" "}
        <span className="text-amber-300 font-semibold">VntezClient</span>
        <span className="text-slate-400">(</span>
        <span className="text-emerald-400">"bman_pos_core"</span>
        <span className="text-slate-400">);</span>
        {"\n\n"}
        <span className="text-slate-500">// Upload đa phân mảnh tới cụm NVMe</span>
        {"\n"}
        <span className="text-purple-400 font-semibold">await</span>{" "}
        <span className="text-blue-300">client</span>
        <span className="text-slate-400">.</span>
        <span className="text-cyan-300">Storage</span>
        <span className="text-slate-400">.</span>
        <span className="text-amber-200">UploadAsync</span>
        <span className="text-slate-400">(</span>
        <span className="text-slate-200">fileStream</span>
        <span className="text-slate-400">, </span>
        <span className="text-purple-400 font-semibold">new</span>{" "}
        <span className="text-amber-300 font-semibold">UploadOptions</span>
        {"\n"}
        <span className="text-slate-400">{"{"}</span>
        {"\n"}
        <span className="text-slate-400">    </span>
        <span className="text-rose-300">Multipart</span>{" "}
        <span className="text-slate-400">=</span>{" "}
        <span className="text-amber-400">true</span>
        {"\n"}
        <span className="text-slate-400">{"});"}</span>
      </>
    ),
  },
  curl: {
    language: "cURL",
    filename: "terminal",
    raw: `curl -X PUT "https://edge.vntez.net/v1/storage/upload" \\
  -H "Authorization: Bearer vntez_jwt_token" \\
  --data-binary @catalog_assets.tar`,
    highlighted: (
      <>
        <span className="text-cyan-400 font-bold">curl</span>{" "}
        <span className="text-purple-400">-X</span>{" "}
        <span className="text-amber-300 font-semibold">PUT</span>{" "}
        <span className="text-emerald-400">"https://edge.vntez.net/v1/storage/upload"</span>{" "}
        <span className="text-slate-500">\</span>
        {"\n"}
        <span className="text-slate-400">  </span>
        <span className="text-purple-400">-H</span>{" "}
        <span className="text-emerald-400">"Authorization: Bearer vntez_jwt_token"</span>{" "}
        <span className="text-slate-500">\</span>
        {"\n"}
        <span className="text-slate-400">  </span>
        <span className="text-purple-400">--data-binary</span>{" "}
        <span className="text-rose-300">@catalog_assets.tar</span>
      </>
    ),
  },
}

export function DeveloperExperience() {
  const [activeTab, setActiveTab] = useState<LangTab>("typescript")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(SNIPPETS[activeTab].raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="developer" className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Pitch and Links */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-xs font-mono font-bold tracking-wider text-[#fb291a] uppercase">
            DEVELOPER EXPERIENCE & SDK
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Tích hợp trong <span className="text-[#fb291a]">vài dòng mã</span>.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            SDK chính thức hỗ trợ TypeScript, .NET và RESTful cURL với kiểu dữ liệu hoàn chỉnh (full type safety).
          </p>

          <div className="pt-2 flex flex-wrap gap-3.5">
            <a
              href="https://docs.vntez.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#fb291a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e02416] transition-colors"
            >
              <IconBook className="size-4" />
              <span>Đọc tài liệu API</span>
            </a>

            <a
              href="https://github.com/vntez"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <IconBrandGithub className="size-4" />
              <span>Xem trên GitHub</span>
            </a>
          </div>

          <div className="flex items-center gap-6 pt-1 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Type-safe API</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Size &lt; 12KB</span>
            </div>
          </div>
        </div>

        {/* Right Side: Syntax-Highlighted Code Editor */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#0c101a] shadow-xl overflow-hidden font-mono">
            {/* Topbar: Tabs and Copy */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#080c14] border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                {(["typescript", "csharp", "curl"] as LangTab[]).map((tab) => {
                  const isActive = activeTab === tab
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="terminalTabIndicator"
                          className="absolute inset-0 bg-[#182136] border border-white/[0.12] rounded-lg"
                          initial={false}
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className={`relative z-10 ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"}`}>
                        {tab === "typescript" ? "TypeScript" : tab === "csharp" ? "C# (.NET)" : "cURL"}
                      </span>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Sao chép mã"
              >
                {copied ? (
                  <>
                    <IconCheck className="size-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-sans text-xs">Đã chép</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="size-3.5" />
                    <span className="font-sans text-xs">Sao chép</span>
                  </>
                )}
              </button>
            </div>

            {/* Syntax-Highlighted Code Content with Motion transition */}
            <div className="p-6 text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-300 min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <pre className="selection:bg-[#fb291a]/30">
                    <code>{SNIPPETS[activeTab].highlighted}</code>
                  </pre>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Status */}
            <div className="flex items-center justify-between px-6 py-2.5 bg-[#080c14] border-t border-black/[0.06] dark:border-white/[0.06] text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <IconCode className="size-3.5 text-[#fb291a]" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {SNIPPETS[activeTab].filename}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-emerald-400 font-semibold">Tương thích Node 18+, Bun, .NET 8</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
