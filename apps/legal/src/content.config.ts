import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const legal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    version: z.string(),
    effectiveDate: z.string(),
    lastUpdated: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = { legal };
