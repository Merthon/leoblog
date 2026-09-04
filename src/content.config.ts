import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    type: z.enum(['technical', 'thinking', 'essay']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingMinutes: z.number().int().positive().default(8),
    relatedReadings: z.array(z.string()).default([]),
    relatedProjects: z.array(z.string()).default([]),
  }),
});

const reading = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reading' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(['reading', 'finished', 'paused']),
    progress: z.number().min(0).max(100).optional(),
    startedAt: z.coerce.date().optional(),
    finishedAt: z.coerce.date().optional(),
    publishedAt: z.coerce.date(),
    takeaway: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    relatedWriting: z.array(z.string()).default([]),
    relatedProjects: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['building', 'maintaining', 'completed', 'archived']),
    stack: z.array(z.string()),
    startedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    repository: z.url().optional(),
    website: z.url().optional(),
    problem: z.string(),
    decisions: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    relatedWriting: z.array(z.string()).default([]),
    relatedReadings: z.array(z.string()).default([]),
  }),
});

export const collections = { writing, reading, projects };
