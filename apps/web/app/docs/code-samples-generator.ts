import type { DocSubtab } from "./types"

interface SampleConfig {
  method: string
  url: string
  headers?: Record<string, string>
  body?: string | Record<string, unknown> | unknown[]
  customTs?: string
  customPython?: string
  customGo?: string
  customDart?: string
  customCSharp?: string
  customPhp?: string
}

/**
 * Sinh danh sách CodeSubtabs cho 7 ngôn ngữ lập trình phổ biến nhất
 * (cURL, TypeScript, Python, Go, C# .NET, Dart Flutter, PHP)
 */
export function buildUniversalCodeSubtabs(cfg: SampleConfig): DocSubtab[] {
  const method = cfg.method.toUpperCase()
  const headers = cfg.headers || { "Content-Type": "application/json" }
  const hasBody = Boolean(cfg.body && method !== "GET")
  const jsonBody = typeof cfg.body === "object" 
    ? JSON.stringify(cfg.body, null, 2) 
    : (cfg.body || '{\n  "status": "ready"\n}')

  const headersBash = Object.entries(headers)
    .map(([k, v]) => `  -H "${k}: ${v}"`)
    .join(" \\\n")

  const headersObj = JSON.stringify(headers, null, 2)
    .split("\n")
    .map((l, i) => (i === 0 ? l : `  ${l}`))
    .join("\n")

  const curlCode = hasBody
    ? `curl -X ${method} "${cfg.url}" \\\n${headersBash} \\\n  -d '${jsonBody}'`
    : `curl -X ${method} "${cfg.url}" \\\n${headersBash}`

  const tsCode =
    cfg.customTs ||
    `// TypeScript / Node.js (fetch)
const response = await fetch("${cfg.url}", {
  method: "${method}",
  headers: ${headersObj},${
    hasBody ? `\n  body: JSON.stringify(${jsonBody}),` : ""
  }
});
const data = await response.json();
console.log(data);`

  const pyCode =
    cfg.customPython ||
    `# Python 3 (httpx / requests)
import httpx

headers = ${headersObj}
${hasBody ? `payload = ${jsonBody}\n` : ""}
with httpx.Client() as client:
    response = client.request(
        "${method}",
        "${cfg.url}",
        headers=headers,${hasBody ? "\n        json=payload," : ""}
        timeout=10.0
    )
    print(response.json())`

  const goCode =
    cfg.customGo ||
    `// Go (net/http)
package main

import (
\t"fmt"
\t"net/http"
\t"io"
${hasBody ? '\t"strings"\n' : ""})

func main() {
\tclient := &http.Client{}
${hasBody ? `\tbody := strings.NewReader(\`${jsonBody}\`)\n\treq, _ := http.NewRequest("${method}", "${cfg.url}", body)` : `\treq, _ := http.NewRequest("${method}", "${cfg.url}", nil)`}
${Object.entries(headers)
  .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
  .join("\n")}

\tresp, err := client.Do(req)
\tif err != nil { panic(err) }
\tdefer resp.Body.Close()

\tresData, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(resData))
}`

  const csharpCode =
    cfg.customCSharp ||
    `// C# (.NET 8+ HttpClient)
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

using var client = new HttpClient();
${hasBody ? `var content = new StringContent(@"${jsonBody.replace(/"/g, '""')}", Encoding.UTF8, "application/json");\nvar response = await client.PostAsync("${cfg.url}", content);` : `var request = new HttpRequestMessage(HttpMethod.${method === "GET" ? "Get" : method === "POST" ? "Post" : method === "PUT" ? "Put" : "Delete"}, "${cfg.url}");\nvar response = await client.SendAsync(request);`}
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`

  const dartCode =
    cfg.customDart ||
    `// Dart / Flutter (package:http)
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> executeRequest() async {
  final url = Uri.parse('${cfg.url}');
  final headers = ${headersObj};
${hasBody ? `  final body = jsonEncode(${jsonBody});\n  final res = await http.${method.toLowerCase()}(url, headers: headers, body: body);` : `  final res = await http.${method.toLowerCase()}(url, headers: headers);`}
  final data = jsonDecode(res.body);
  print(data);
}`

  const phpCode =
    cfg.customPhp ||
    `<?php
// PHP 8 (cURL)
$ch = curl_init('${cfg.url}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
${Object.entries(headers)
  .map(([k, v]) => `    '${k}: ${v}',`)
  .join("\n")}
]);
${hasBody ? `curl_setopt($ch, CURLOPT_POSTFIELDS, '${jsonBody.replace(/'/g, "\\'")}');\n` : ""}$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`

  return [
    { key: "cURL", label: "cURL", lang: "bash", code: curlCode },
    { key: "TypeScript", label: "TypeScript", lang: "typescript", code: tsCode },
    { key: "Python", label: "Python", lang: "python", code: pyCode },
    { key: "Go", label: "Go", lang: "go", code: goCode },
    { key: "CSharp", label: "C# (.NET)", lang: "csharp", code: csharpCode },
    { key: "Dart", label: "Dart (Flutter)", lang: "dart", code: dartCode },
    { key: "PHP", label: "PHP", lang: "php", code: phpCode },
  ]
}
