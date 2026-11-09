import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(), year: z.number(), venue: z.string(), authors: z.array(z.string()),
    summary: z.string(), topics: z.array(z.string()), image: z.string(), pdf: z.string(),
    bib: z.string(), featured: z.boolean().default(false), oral: z.boolean().default(false),
    order: z.number().default(0), project: z.string().optional(), draft: z.boolean().default(false),
  }),
});
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(), description: z.string(), date: z.coerce.date(),
    category: z.string().default('Notes'), tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
export const collections = { papers, posts };
