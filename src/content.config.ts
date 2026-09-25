import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * papers/*.json are written by `npm run papers` (scripts/fetch_pubmed.py).
 * The script only overwrites PubMed fields, so the hand-curated fields below
 * (highlight, summary, image, dataUrl, hidden, ...) survive re-runs.
 */
const papers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    journal: z.string(),
    journalAbbrev: z.string(),
    year: z.number(),
    date: z.string().nullable().optional(),
    doi: z.string().nullable().optional(),
    pmid: z.string(),
    pmcid: z.string().nullable().optional(),
    url: z.string(),
    abstract: z.string().optional(),
    pubTypes: z.array(z.string()).default([]),
    tqPosition: z.enum(['first', 'middle', 'last']).nullable().optional(),
    // senior/first-author paper from the lab (or hand-set via labPaperOverride)
    labPaper: z.boolean().default(false),
    labPaperOverride: z.boolean().nullish(),
    collaborative: z.boolean().optional(),
    // ---- curated ----
    highlight: z.boolean().default(false),
    highlightOrder: z.number().nullish(),
    summary: z.string().nullish(),
    image: z.string().nullish(),
    theme: z.string().nullish(),
    dataUrl: z.string().nullish(),
    codeUrl: z.string().nullish(),
    geo: z.string().nullish(),
    hidden: z.boolean().default(false),
    hiddenReason: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    degrees: z.string().nullish(),
    role: z.string(),
    group: z.enum(['pi', 'faculty', 'staff', 'postdoc', 'student', 'admin', 'alumni']),
    photo: z.string().nullish(),
    bio: z.string().nullish(),
    focus: z.string().nullish(),
    email: z.string().nullish(),
    subsequentPosition: z.string().nullish(),
    // blank links are dropped so they don't render as empty buttons
    links: z.record(z.string().nullish()).default({})
      .transform((l) => Object.fromEntries(Object.entries(l).filter(([, v]) => v)) as Record<string, string>),
    order: z.number().nullish().transform((v) => v ?? 100),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // 'year' → only the year is shown (for items whose exact date is unknown)
    datePrecision: z.enum(['day', 'month', 'year']).default('day'),
    category: z.enum(['paper', 'people', 'award', 'lab', 'event']).default('lab'),
    summary: z.string(),
    image: z.string().nullish(),
    link: z.string().nullish(),
    paper: z.string().nullish(), // PMID
  }),
});

export const collections = { papers, people, news };
