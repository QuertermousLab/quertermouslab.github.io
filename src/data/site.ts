// Site-wide content. Editable text lives in the JSON files next to this one
// (edit them on GitHub or in Pages CMS); this module just types and re-exports it.
import labJson from './lab.json';
import homeJson from './home.json';
import themesJson from './themes.json';
import consortiaJson from './consortia.json';
import datasetsJson from './datasets.json';
import galleryJson from './gallery.json';

export const lab = labJson;
export const home = homeJson;
export const pipeline = homeJson.pipeline;
export const consortia = consortiaJson;
export const dataResources = datasetsJson as { title: string; kind: string; url: string; desc: string; code?: string }[];
export const gallery = galleryJson.photos;

export type Theme = {
  id: string;
  title: string;
  short: string;
  color: string;
  illustration: 'locus' | 'smc' | 'atlas' | 'perturb';
  body: string[];
  papers: string[]; // PMIDs
  methods: string[];
};
export const themes = themesJson as Theme[];

/** Public IGVF measurement sets from the lab (data.igvf.org), grouped by assay. */
export const igvf = {
  portal: 'https://data.igvf.org/search/?type=MeasurementSet&lab.title=Thomas+Quertermous%2C+Stanford',
  api: 'https://api.data.igvf.org/search/?type=MeasurementSet&lab.title=Thomas+Quertermous%2C+Stanford&format=json&limit=all',
  // fallback counts if the portal cannot be reached at build time (Sept 2026)
  fallback: { 'Parse Perturb-seq': 19, 'TAP-seq': 14, 'in vivo Perturb-seq': 4 } as Record<string, number>,
  assays: {
    'Parse Perturb-seq': 'CRISPRi of transcription start sites of genes at CAD loci in HCASMC-hTERT cells, scRNA-seq readout.',
    'TAP-seq': 'CRISPRi of candidate cis-regulatory elements across CAD loci, targeted scRNA-seq readout.',
    'in vivo Perturb-seq': 'AAV guide library against 19 genes in Myh11-Cre; Rosa26-LSL-dCas9-KRAB mouse aortic SMCs.',
  } as Record<string, string>,
};

/** Lab GitHub organization. */
export const github = { org: 'https://github.com/QuertermousLab' };
