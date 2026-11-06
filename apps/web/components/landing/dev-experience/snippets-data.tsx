import React from "react"

export type LangTab = "typescript" | "csharp" | "curl"

export interface SnippetConfig {
  language: string
  filename: string
  raw: string
  highlighted: React.ReactNode
}

export const SNIPPETS: Record<LangTab, SnippetConfig> = {
  typescript: {
    language: "TypeScript",
    filename: "client.ts",
    raw: `import { vntez } from '@vntez/sdk';

// Khởi tạo client với VNTEZ IAM
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
        <span className="text-slate-500">// Khởi tạo client với VNTEZ IAM</span>
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
        <span className="text-blue-400">upload</span>
        <span className="text-slate-400">(</span>
        <span className="text-slate-200">file</span>
        <span className="text-slate-400">, {"{ "}</span>
        <span className="text-rose-300">multipart</span>
        <span className="text-slate-400">: </span>
        <span className="text-amber-300">true</span>
        <span className="text-slate-400">{" });"}</span>
      </>
    ),
  },
  csharp: {
    language: "C# / .NET",
    filename: "PosService.cs",
    raw: `using Vntez.Sdk;

// Kết nối POS với cụm lưu trữ & OAuth
var client = new VntezClient("bman_pos_core");
var result = await client.Storage.UploadAsync(stream);`,
    highlighted: (
      <>
        <span className="text-purple-400 font-semibold">using</span>{" "}
        <span className="text-cyan-300">Vntez</span>
        <span className="text-slate-400">.</span>
        <span className="text-cyan-300">Sdk</span>
        <span className="text-slate-400">;</span>
        {"\n\n"}
        <span className="text-slate-500">// Kết nối POS với cụm lưu trữ & OAuth</span>
        {"\n"}
        <span className="text-purple-400 font-semibold">var</span>{" "}
        <span className="text-blue-300">client</span>{" "}
        <span className="text-slate-400">=</span>{" "}
        <span className="text-purple-400 font-semibold">new</span>{" "}
        <span className="text-amber-300 font-semibold">VntezClient</span>
        <span className="text-slate-400">(</span>
        <span className="text-emerald-400">"bman_pos_core"</span>
        <span className="text-slate-400">);</span>
        {"\n"}
        <span className="text-purple-400 font-semibold">var</span>{" "}
        <span className="text-blue-300">result</span>{" "}
        <span className="text-slate-400">=</span>{" "}
        <span className="text-purple-400 font-semibold">await</span>{" "}
        <span className="text-blue-300">client</span>
        <span className="text-slate-400">.</span>
        <span className="text-cyan-300">Storage</span>
        <span className="text-slate-400">.</span>
        <span className="text-blue-400">UploadAsync</span>
        <span className="text-slate-400">(</span>
        <span className="text-slate-200">stream</span>
        <span className="text-slate-400">);</span>
      </>
    ),
  },
  curl: {
    language: "cURL / REST",
    filename: "terminal.sh",
    raw: `# Upload trực tiếp tới cụm Edge S3 nội địa
curl -X PUT "https://storage.vntez.net/bucket/pos.tar.gz" \\
  -H "Authorization: Bearer $VNTEZ_TOKEN" \\
  --data-binary @pos.tar.gz`,
    highlighted: (
      <>
        <span className="text-slate-500"># Upload trực tiếp tới cụm Edge S3 nội địa</span>
        {"\n"}
        <span className="text-amber-300 font-semibold">curl</span>{" "}
        <span className="text-purple-400 font-semibold">-X</span>{" "}
        <span className="text-cyan-300">PUT</span>{" "}
        <span className="text-emerald-400">"https://storage.vntez.net/bucket/pos.tar.gz"</span>{" "}
        <span className="text-slate-400">\</span>
        {"\n  "}
        <span className="text-purple-400 font-semibold">-H</span>{" "}
        <span className="text-emerald-400">"Authorization: Bearer $VNTEZ_TOKEN"</span>{" "}
        <span className="text-slate-400">\</span>
        {"\n  "}
        <span className="text-purple-400 font-semibold">--data-binary</span>{" "}
        <span className="text-slate-200">@pos.tar.gz</span>
      </>
    ),
  },
}
