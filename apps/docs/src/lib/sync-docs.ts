import fs from "fs";
import path from "path";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://stbswcnsitztbusqrdhi.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_Pjw68YY4m28WZaTUgiT17A_LZUhMGLx";

interface AppDocsPageRow {
  id: string;
  app_id: string | null;
  slug: string;
  title: string;
  category: string;
  order_index: number;
  content: string;
  updated_at: string;
}

const APP_NAMES: Record<string, string> = {
  root: "VNTEZ Ecosystem",
  "workers-hub": "Workers Hub",
  "vntez-iam": "VNTEZ IAM",
  solotype: "SoloType",
  "bonsai-reader": "Bonsai Reader",
  gitvn: "GitVN",
};

export async function syncDocsFromSupabase(targetDir?: string): Promise<number> {
  const baseDir = targetDir || path.resolve(process.cwd(), "src/content/docs");

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/app_docs_pages?select=*&order=order_index.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      console.warn(`[syncDocs] Supabase HTTP ${res.status}: ${res.statusText}`);
      return 0;
    }

    const rows: AppDocsPageRow[] = await res.json();
    if (!rows || rows.length === 0) {
      console.warn("[syncDocs] No rows returned from app_docs_pages");
      return 0;
    }

    let syncedCount = 0;

    for (const row of rows) {
      const appId = row.app_id || "root";
      const slug = row.slug || "index";
      const appFolder = path.join(baseDir, appId);

      if (!fs.existsSync(appFolder)) {
        fs.mkdirSync(appFolder, { recursive: true });
      }

      const filePath = path.join(appFolder, `${slug}.mdx`);
      let fileContent = row.content || "";

      // Ensure frontmatter is present and valid
      if (!fileContent.trim().startsWith("---")) {
        const appName = APP_NAMES[appId] || appId;
        const frontmatter = [
          "---",
          `title: ${JSON.stringify(row.title || slug)}`,
          `description: ${JSON.stringify(row.title || slug)}`,
          `appId: ${JSON.stringify(appId)}`,
          `appName: ${JSON.stringify(appName)}`,
          `category: ${JSON.stringify(row.category || "Tài liệu")}`,
          `order: ${row.order_index || 1}`,
          "---",
          "",
        ].join("\n");
        fileContent = frontmatter + fileContent;
      } else {
        // Ensure appId in existing frontmatter is not empty/null if Astro schema expects string
        if (appId === "root" && fileContent.includes("appId: null")) {
          fileContent = fileContent.replace('appId: null', 'appId: "root"');
        }
      }

      fs.writeFileSync(filePath, fileContent, "utf-8");
      syncedCount++;
    }

    console.log(`[syncDocs] Successfully synced ${syncedCount} real doc pages from Supabase.`);
    return syncedCount;
  } catch (err) {
    console.warn("[syncDocs] Failed to sync from Supabase, using existing files:", err);
    return 0;
  }
}

// Auto-run when executed directly via bun
if ((import.meta as any).main || process.argv[1]?.endsWith("sync-docs.ts")) {
  syncDocsFromSupabase();
}
