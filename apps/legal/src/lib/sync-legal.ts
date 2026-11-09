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

interface AppLegalDocRow {
  id: string;
  app_id: string | null;
  slug: string;
  title: string;
  version: string;
  effective_date: string;
  content: string;
  updated_at: string;
}

export async function syncLegalFromSupabase(targetDir?: string): Promise<number> {
  const baseDir = targetDir || path.resolve(process.cwd(), "src/content/legal");

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/app_legal_docs?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      console.warn(`[syncLegal] Supabase HTTP ${res.status}: ${res.statusText}`);
      return 0;
    }

    const rows: AppLegalDocRow[] = await res.json();
    if (!rows || rows.length === 0) {
      console.warn("[syncLegal] No rows returned from app_legal_docs");
      return 0;
    }

    let syncedCount = 0;

    for (const row of rows) {
      const isRoot = !row.app_id || row.app_id === "root";
      const appId = isRoot ? null : row.app_id;
      const slug = row.slug;

      let filePath: string;
      if (isRoot) {
        filePath = path.join(baseDir, `${slug}.mdx`);
      } else {
        const appFolder = path.join(baseDir, appId!);
        if (!fs.existsSync(appFolder)) {
          fs.mkdirSync(appFolder, { recursive: true });
        }
        filePath = path.join(appFolder, `${slug}.mdx`);
      }

      let fileContent = row.content || "";

      if (!fileContent.trim().startsWith("---")) {
        const frontmatter = [
          "---",
          `title: ${JSON.stringify(row.title || slug)}`,
          `description: ${JSON.stringify(row.title || slug)}`,
          `version: ${JSON.stringify(row.version || "1.0")}`,
          `effectiveDate: ${JSON.stringify(row.effective_date || "2026-01-01")}`,
          `lastUpdated: ${JSON.stringify(new Date().toISOString().slice(0, 10))}`,
          "order: 1",
          "---",
          "",
        ].join("\n");
        fileContent = frontmatter + fileContent;
      }

      fs.writeFileSync(filePath, fileContent, "utf-8");
      syncedCount++;
    }

    console.log(`[syncLegal] Successfully synced ${syncedCount} real legal docs from Supabase.`);
    return syncedCount;
  } catch (err) {
    console.warn("[syncLegal] Failed to sync from Supabase, using existing files:", err);
    return 0;
  }
}

// Auto-run when executed directly via bun
if ((import.meta as any).main || process.argv[1]?.endsWith("sync-legal.ts")) {
  syncLegalFromSupabase();
}
