import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { syncLegalFromSupabase } from "./lib/sync-legal";

// Sync real legal docs from Supabase Postgres before Astro builds/loads
await syncLegalFromSupabase().catch((e) => {
  console.warn("[content.config] Supabase legal sync skipped:", e);
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(""),
    version: z.string().optional().default("1.0"),
    effectiveDate: z.string().optional().default("2026-01-01"),
    lastUpdated: z.string().optional().default("2026-11-08"),
    order: z.number().default(0),
  }),
});

export const collections = { legal };
