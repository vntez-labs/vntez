import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    appId: z.enum(["workers-hub", "vntez-iam", "solotype", "bonsai-reader", "gitvn"]),
    appName: z.string(),
    category: z.string(),
    order: z.number().default(0),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "WS"]).optional(),
    endpoint: z.string().optional(),
    badge: z.string().optional(),
  }),
});

export const collections = { docs };
