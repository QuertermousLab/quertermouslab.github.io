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
    labPaperOverride: z.boolean().optional(),
    collaborative: z.boolean().optional(),
    // ---- curated ----
    highlight: z.boolean().default(false),
    highlightOrder: z.number().optional(),
    summary: z.string().optional(),
    image: z.string().nullable().optional(),
    theme: z.string().optional(),
    dataUrl: z.string().optional(),
    codeUrl: z.string().optional(),
    geo: z.string().optional(),
    hidden: z.boolean().default(false),
    hiddenReason: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    degrees: z.string().optional(),
    role: z.string(),
    group: z.enum(['pi', 'faculty', 'staff', 'postdoc', 'student', 'admin', 'alumni']),
    photo: z.string().optional(),
    bio: z.string().optional(),
    focus: z.string().optional(),
    email: z.string().optional(),
    subsequentPosition: z.string().optional(),
    links: z.record(z.string()).default({}),
    order: z.number().default(100),
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
    image: z.string().optional(),
    link: z.string().optional(),
    paper: z.string().optional(), // PMID
  }),
});

export const collections = { papers, people, news };
