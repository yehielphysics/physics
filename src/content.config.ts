import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/*
 * כל חומר לימוד הוא קובץ Markdown אחד בתיקייה src/content/items/
 * שם הקובץ (בלי .md) הוא המזהה הקבוע של החומר — הוא משמש לכתובת
 * הדף (/items/<מזהה>/) ובעתיד גם למעקב התקדמות של משתמשים.
 */
const items = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/items" }),
  schema: z.object({
    title: z.string(),
    topic: z.string(),
    subtopic: z.string().optional().nullable(),
    type: z.enum(["interactive", "pdf", "word", "slides", "simulation", "video", "link"]),
    file: z.string().optional().nullable(),
    url: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional().nullable(),
    order: z.number().optional().nullable(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { items };
