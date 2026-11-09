/**
 * MDX & Astro Parsing Utilities for Console Documentation & Legal Previews
 */

export interface MdxFrontmatter {
  title?: string;
  description?: string;
  category?: string;
  order?: number;
  badge?: string;
  method?: string;
  endpoint?: string;
}

export interface TabbedCodeBlockData {
  title: string;
  tabs: { label: string; lang: string; code: string }[];
}

/**
 * Extract YAML frontmatter from MDX content and return clean body
 */
export function extractFrontmatter(rawContent: string): {
  frontmatter: MdxFrontmatter;
  cleanContent: string;
} {
  const frontmatter: MdxFrontmatter = {};
  let cleanContent = rawContent.trim();

  if (cleanContent.startsWith("---")) {
    const endIdx = cleanContent.indexOf("---", 3);
    if (endIdx !== -1) {
      const yamlBlock = cleanContent.substring(3, endIdx).trim();
      cleanContent = cleanContent.substring(endIdx + 3).trim();

      yamlBlock.split("\n").forEach((line) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx !== -1) {
          const key = line.substring(0, colonIdx).trim();
          let val = line.substring(colonIdx + 1).trim();
          val = val.replace(/^["']|["']$/g, "");

          if (key === "title") frontmatter.title = val;
          else if (key === "description") frontmatter.description = val;
          else if (key === "category") frontmatter.category = val;
          else if (key === "order") frontmatter.order = parseInt(val, 10);
          else if (key === "badge") frontmatter.badge = val;
          else if (key === "method") frontmatter.method = val;
          else if (key === "endpoint") frontmatter.endpoint = val;
        }
      });
    }
  }

  // Filter out Astro/ES import statements like: import { TabbedCodeBlock } from "...";
  cleanContent = cleanContent
    .split("\n")
    .filter((l) => !l.trim().startsWith("import ") && !l.trim().startsWith("export const "))
    .join("\n")
    .trim();

  return { frontmatter, cleanContent };
}

/**
 * Check if a block of lines represents an ASCII sequence diagram or architecture box
 */
export function isAsciiDiagramLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // ASCII diagrams typically feature box drawing characters, sequence arrows, or vertical bars
  return (
    trimmed.startsWith("+---") ||
    trimmed.startsWith("+===") ||
    trimmed.startsWith("|") ||
    trimmed.endsWith("|") ||
    trimmed.includes("------>") ||
    trimmed.includes("<------") ||
    trimmed.includes("----->") ||
    trimmed.includes("<-----") ||
    trimmed.includes("+-----") ||
    trimmed.includes("---+")
  );
}

/**
 * Parse Astro <TabbedCodeBlock ... /> from text
 */
export function parseTabbedCodeBlocks(content: string): {
  parsedBlocks: Record<string, TabbedCodeBlockData>;
  replacedContent: string;
} {
  const parsedBlocks: Record<string, TabbedCodeBlockData> = {};
  let blockCounter = 0;

  // Regex to match <TabbedCodeBlock ... />
  const regex = /<TabbedCodeBlock[\s\S]*?\/>/g;

  const replacedContent = content.replace(regex, (fullMatch) => {
    const id = `__TABBED_CODE_BLOCK_${blockCounter++}__`;

    // Extract title
    const titleMatch = fullMatch.match(/title=["']([^"']+)["']/);
    const title = titleMatch?.[1] || "Mã Nguồn Mẫu";

    // Extract tabs array
    const tabs: { label: string; lang: string; code: string }[] = [];
    const tabsBlockMatch = fullMatch.match(/tabs=\{(\[[\s\S]*?\])\}/);

    if (tabsBlockMatch?.[1]) {
      try {
        // Safe evaluation of the JS tabs array
        const rawArrayStr = tabsBlockMatch[1];
        const tabObjectMatches = rawArrayStr.match(/\{[\s\S]*?\}/g);
        if (tabObjectMatches) {
          tabObjectMatches.forEach((objStr) => {
            const labelMatch = objStr.match(/label:\s*["']([^"']+)["']/);
            const langMatch = objStr.match(/lang:\s*["']([^"']+)["']/);
            const codeMatch = objStr.match(/code:\s*["']([\s\S]*?)["']\s*(?:,|\})/);

            if (labelMatch?.[1] && langMatch?.[1] && codeMatch?.[1]) {
              const codeClean = codeMatch[1]
                .replace(/\\n/g, "\n")
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'");

              tabs.push({
                label: labelMatch[1],
                lang: langMatch[1],
                code: codeClean,
              });
            }
          });
        }
      } catch {
        // fallback
      }
    }

    parsedBlocks[id] = { title, tabs };
    return `\n\n${id}\n\n`;
  });

  return { parsedBlocks, replacedContent };
}
