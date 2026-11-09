import { supabase } from "./supabase";

export interface LegalDocData {
  title: string;
  version: string;
  effectiveDate: string;
  content: string;
  lastUpdated: string;
}

export async function fetchRootLegalDoc(slugs: string[]): Promise<LegalDocData | null> {
  try {
    const { data } = await supabase
      .from("app_legal_docs")
      .select("title, version, effective_date, content, updated_at")
      .is("app_id", null)
      .in("slug", slugs)
      .limit(1)
      .maybeSingle();

    if (!data) return null;

    let clean = data.content || "";
    if (clean.trim().startsWith("---")) {
      const parts = clean.split("---");
      if (parts.length >= 3) {
        clean = parts.slice(2).join("---").trim();
      }
    }

    return {
      title: data.title,
      version: data.version || "2.5.0",
      effectiveDate: data.effective_date || "01/01/2026",
      content: clean,
      lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleDateString("vi-VN") : "01/01/2026",
    };
  } catch (err) {
    console.warn("Could not query root legal doc:", err);
    return null;
  }
}
