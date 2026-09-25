#!/usr/bin/env python3
"""Fetch Thomas Quertermous's publications from PubMed and write one JSON file
per paper into src/content/papers/.

Usage:  python3 scripts/fetch_pubmed.py [--since 2000]

- Re-running is safe: existing files keep hand-curated fields
  (highlight, highlightOrder, tags, summary, image, codeUrl, dataUrl, ...).
- Only the bibliographic fields coming from PubMed are overwritten.
"""
import argparse, json, re, subprocess, sys, time, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "content" / "papers"
EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
TERM = 'Quertermous T[Author]'
# Keys we own from PubMed; everything else in an existing file is preserved.
PUBMED_KEYS = {"title", "authors", "journal", "journalAbbrev", "year", "date", "doi",
               "pmid", "pmcid", "url", "abstract", "pubTypes", "tqPosition", "labPaper"}

def get(url, params):
    q = urllib.parse.urlencode(params)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(f"{url}?{q}", timeout=60) as r:
                return r.read()
        except Exception:  # NCBI rate limits / local SSL cert issues
            try:  # fall back to curl, which uses the system trust store
                return subprocess.run(["curl", "-sfg", f"{url}?{q}"], check=True,
                                      capture_output=True, timeout=120).stdout
            except Exception:
                time.sleep(2 + attempt * 2)
    sys.exit(f"failed: {url}?{q}")

def text(el):
    return "".join(el.itertext()).strip() if el is not None else ""

MONTHS = {m: i for i, m in enumerate(
    "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(), 1)}

def pub_date(art):
    # Prefer the electronic date, then the journal issue date.
    for path in ["ArticleDate", "Journal/JournalIssue/PubDate"]:
        d = art.find(path)
        if d is None:
            continue
        y = d.findtext("Year")
        if not y:
            md = d.findtext("MedlineDate") or ""
            m = re.search(r"(\d{4})", md)
            if not m:
                continue
            return f"{m.group(1)}-01-01"
        mo = d.findtext("Month") or "1"
        mo = MONTHS.get(mo[:3], None) or (int(mo) if mo.isdigit() else 1)
        day = d.findtext("Day") or "1"
        return f"{int(y):04d}-{int(mo):02d}-{int(day):02d}"
    return None

def slugify(s, n=6):
    words = re.findall(r"[a-z0-9]+", s.lower())
    stop = {"a", "an", "the", "of", "in", "and", "for", "to", "with", "by", "on",
            "from", "at", "is", "are", "as", "via", "into"}
    words = [w for w in words if w not in stop][:n]
    return "-".join(words)

def parse(article):
    mc = article.find("MedlineCitation")
    art = mc.find("Article")
    pmid = mc.findtext("PMID")
    title = re.sub(r"\s+", " ", text(art.find("ArticleTitle"))).rstrip(".")
    authors = []
    for a in art.findall("AuthorList/Author"):
        if a.find("CollectiveName") is not None:
            authors.append(text(a.find("CollectiveName")))
            continue
        fore = a.findtext("ForeName") or a.findtext("Initials") or ""
        last = a.findtext("LastName") or ""
        authors.append(f"{fore} {last}".strip())
    tq = next((i for i, a in enumerate(authors) if a.endswith("Quertermous")), None)
    pos = ("first" if tq == 0 else "last" if tq == len(authors) - 1 else "middle") if tq is not None else None
    journal = art.findtext("Journal/Title") or ""
    abbrev = art.findtext("Journal/ISOAbbreviation") or journal
    date = pub_date(art)
    ids = {i.get("IdType"): i.text for i in article.findall("PubmedData/ArticleIdList/ArticleId")}
    doi = ids.get("doi")
    abstract = " ".join(
        ((t.get("Label") + ": ") if t.get("Label") else "") + text(t)
        for t in art.findall("Abstract/AbstractText"))
    types = [text(t) for t in art.findall("PublicationTypeList/PublicationType")]
    return {
        "title": title,
        "authors": authors,
        "journal": journal,
        "journalAbbrev": abbrev,
        "year": int(date[:4]) if date else None,
        "date": date,
        "doi": doi,
        "pmid": pmid,
        "pmcid": ids.get("pmc"),
        "url": f"https://doi.org/{doi}" if doi else f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
        "abstract": abstract,
        "pubTypes": types,
        "tqPosition": pos,
        # last-author (senior) or first-author papers are "from the lab"
        "labPaper": pos in ("first", "last"),
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", type=int, default=1985)
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    term = f"{TERM} AND {args.since}:3000[dp]"
    ids = json.loads(get(f"{EUTILS}/esearch.fcgi",
                         {"db": "pubmed", "term": term, "retmax": 1000, "retmode": "json"}))
    idlist = ids["esearchresult"]["idlist"]
    print(f"{len(idlist)} PubMed records for {term}")
    existing = {}
    for f in OUT.glob("*.json"):
        d = json.loads(f.read_text())
        if d.get("pmid"):
            existing[d["pmid"]] = (f, d)
    n_new = 0
    for i in range(0, len(idlist), 150):
        chunk = idlist[i:i + 150]
        xml = get(f"{EUTILS}/efetch.fcgi", {"db": "pubmed", "id": ",".join(chunk), "retmode": "xml"})
        root = ET.fromstring(xml)
        for article in root.findall("PubmedArticle"):
            rec = parse(article)
            if not rec["year"]:
                continue
            if rec["pmid"] in existing:
                path, old = existing[rec["pmid"]]
                # update in place so key order (and therefore the diff) stays stable
                merged = dict(old)
                merged.update(rec)
                # keep a hand-set labPaper override
                if "labPaperOverride" in old:
                    merged["labPaper"] = old["labPaperOverride"]
            else:
                path = OUT / f"{rec['year']}-{slugify(rec['title'])}-{rec['pmid']}.json"
                merged = {**rec, "highlight": False, "tags": []}
                n_new += 1
            text = json.dumps(merged, indent=2, ensure_ascii=False) + "\n"
            if not path.exists() or path.read_text() != text:
                path.write_text(text)
        time.sleep(0.4)
    print(f"wrote {len(idlist)} records ({n_new} new) to {OUT.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
