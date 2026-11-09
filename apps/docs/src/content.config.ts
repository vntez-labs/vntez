import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { syncDocsFromSupabase } from "./lib/sync-docs";

// Sync real docs pages from Supabase Postgres before Astro builds/loads
await syncDocsFromSupabase().catch((e) => {
  console.warn("[content.config] Supabase sync skipped:", e);
});

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(""),
    appId: z.string().nullable().optional(),
    appName: z.string().optional(),
    category: z.string().optional().default("Tài liệu"),
    order: z.number().default(0),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "WS"]).optional(),
    endpoint: z.string().optional(),
    badge: z.string().optional(),
  }),
});

export const collections = { docs };
