# Quertermous Lab website

Static site for the Quertermous Lab (Stanford Cardiovascular Medicine), built with
[Astro](https://astro.build). No client framework — a few small scripts only
(publication filters, hero legend, mobile nav).

## Develop / build

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/ (static)
```

## Deploy

Hosted on GitHub Pages from `QuertermousLab/quertermouslab.github.io`:
**https://quertermouslab.stanford.edu/** (DNS: Stanford NetDB CNAME → `quertermouslab.github.io`; the github.io address forwards here)

- Every push to `main` builds and deploys (`.github/workflows/deploy.yml`, ~1–2 min).
- A weekly scheduled rebuild refreshes IGVF counts.
- `.github/workflows/update-papers.yml` runs the PubMed fetch weekly and opens a pull
  request with new papers for review.

## Editing content

**Visual editor — [Pages CMS](https://app.pagescms.org):** sign in, open
`QuertermousLab/quertermouslab.github.io`, and edit forms for People, News, Life-in-the-lab photos,
Homepage text, Research themes, Datasets, Consortia, Lab info, and publication curation. Image
fields upload into `public/people`, `public/lab` or `public/figures`. Every save is a commit to
`main` and the site redeploys in about a minute. The form layout is defined in `.pages.yml`.

Tips: upload portraits as square crops (~480×480) and photos ≤ 1600 px wide (webp or jpg).

**Directly on GitHub:** open a file → pencil icon → commit to `main`.

## Where content lives

| What | File(s) |
| --- | --- |
| Homepage text | `src/data/home.json` |
| Research themes | `src/data/themes.json` |
| Lab info & contacts | `src/data/lab.json` |
| Consortia / datasets | `src/data/consortia.json`, `src/data/datasets.json` |
| Life-in-the-lab photos | `src/data/gallery.json` (+ images in `public/lab/`) |
| IGVF and GitHub settings | `src/data/site.ts` |
| People (PI, members, alumni) | `src/content/people/*.json` — `group`: `pi`, `alumni`, or anything else for the team grid; `order` sorts |
| Publications | `src/content/papers/*.json` (generated, see below) |
| News | `src/content/news/*.md` |
| Photos | `public/people/` (square, 480×480 webp), `public/lab/` |
| Paper figures (open-access, credited) | `public/figures/` |
| Logo / theme illustrations / hero artery | `src/components/LabMark.astro`, `ThemeArt.astro`, `ArteryHero.astro` |

## Updating publications

```bash
npm run papers   # python3 scripts/fetch_pubmed.py
```

Pulls every `Quertermous T[Author]` record from PubMed and writes one JSON per paper.
Only PubMed fields are overwritten, so hand-curated fields survive re-runs:

- `highlight` / `highlightOrder` / `summary` / `image` — "Selected publications" cards
- `dataUrl`, `codeUrl`, `geo` — data/code links
- `hidden: true` — hide preprints that were later published, errata, etc.
- `labPaperOverride: true` — count as a lab paper even if TQ is not first/last author (only `true` has an effect)

New preprints that duplicate a published paper need `hidden: true` set by hand.

## IGVF

The Research page fetches the lab's released IGVF measurement sets at build time
(`igvf.api` in `src/data/site.ts`) and falls back to `igvf.fallback` if the portal is
unreachable. Rebuild to refresh the counts.

## Needs verification before launch

- Current member roster/titles (seeded from the old site + Stanford Profiles, Sept 2026);
  Lora Randa has no bio yet.
- Alumni positions are copied from the old alumni page and may be out of date.
- If the domain changes, update `site` in `astro.config.mjs`, `public/robots.txt`, `public/CNAME` and the repo Pages settings.
