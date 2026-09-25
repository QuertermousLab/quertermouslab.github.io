import { getCollection, type CollectionEntry } from 'astro:content';

export type Paper = CollectionEntry<'papers'>;

export async function getPapers() {
  const all = await getCollection('papers', ({ data }) => !data.hidden);
  return all.sort((a, b) => (b.data.date ?? '').localeCompare(a.data.date ?? ''));
}

export async function getByPmid(pmids: string[]) {
  const all = await getPapers();
  const map = new Map(all.map((p) => [p.data.pmid, p]));
  return pmids.map((id) => map.get(id)).filter(Boolean) as Paper[];
}

/** "Last, first-initial" key so "Chad S Weldy" and "Chad Weldy" both match. */
const key = (name: string) => {
  const parts = name.replace(/[.,†*]/g, '').trim().split(/\s+/);
  const last = parts[parts.length - 1]?.toLowerCase() ?? '';
  return `${last}:${(parts[0] ?? '')[0]?.toLowerCase() ?? ''}`;
};

let labKeys: Set<string> | null = null;
export async function getLabKeys() {
  if (labKeys) return labKeys;
  const people = await getCollection('people');
  labKeys = new Set(people.map((p) => key(p.data.name)));
  return labKeys;
}

/** Authors → HTML with lab members in bold; long lists are elided around lab members. */
export function formatAuthors(authors: string[], keys: Set<string>, max = 12) {
  const fmt = (a: string) => (keys.has(key(a)) ? `<b>${a}</b>` : a);
  if (authors.length <= max) return authors.map(fmt).join(', ');
  const head = authors.slice(0, 6).map(fmt);
  const tail = authors.slice(-3).map(fmt);
  const middleLab = authors.slice(6, -3).filter((a) => keys.has(key(a))).map(fmt);
  return [...head, '…', ...middleLab, ...(middleLab.length ? ['…'] : []), ...tail].join(', ');
}

/** Short form for cards: first three, …, last two. */
export function shortAuthors(authors: string[], keys: Set<string>) {
  const fmt = (a: string) => (keys.has(key(a)) ? `<b>${a}</b>` : a);
  if (authors.length <= 6) return authors.map(fmt).join(', ');
  return [...authors.slice(0, 3).map(fmt), '…', ...authors.slice(-2).map(fmt)].join(', ');
}

/** "Arteriosclerosis, thrombosis, and vascular biology" → title case, without "(New York, N.Y.)". */
export function journalName(j: string) {
  const small = new Set(['and', 'of', 'the', 'in', 'for', 'on', 'a', 'an', '&']);
  return j.replace(/\s*[:(].*$/, '').replace(/\.$/, '').split(' ')
    .map((w, i) => (i > 0 && small.has(w.toLowerCase()) ? w.toLowerCase() : /^[a-z]+[A-Z]/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

export const isPreprint = (p: Paper) => /rxiv/i.test(p.data.journalAbbrev);

export function fmtDate(d: Date, precision: 'day' | 'month' | 'year' = 'day') {
  const opts: Intl.DateTimeFormatOptions =
    precision === 'year' ? { year: 'numeric' } :
    precision === 'month' ? { year: 'numeric', month: 'short' } :
    { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });
}

/** Sort people alphabetically by surname (last word of the name), then first name. */
export function bySurname(a: { data: { name: string } }, b: { data: { name: string } }) {
  const split = (n: string) => { const w = n.trim().split(/\s+/); return [w[w.length - 1], n]; };
  const [la, fa] = split(a.data.name), [lb, fb] = split(b.data.name);
  return la.localeCompare(lb, 'en', { sensitivity: 'base' }) || fa.localeCompare(fb, 'en', { sensitivity: 'base' });
}
