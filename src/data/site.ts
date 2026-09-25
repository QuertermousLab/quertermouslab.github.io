// Site-wide lab information. Edit here; every page reads from this file.

export const lab = {
  name: 'Quertermous Lab',
  tagline: 'Decoding how human genetic variation acts in the cells of the artery wall to cause coronary artery disease.',
  address: {
    building: 'Falk Cardiovascular Research Center, CV184',
    street: '870 Quarry Road',
    city: 'Stanford, CA 94305-5406',
  },
  postal: '300 Pasteur Dr, Mail Code 5406, Stanford, CA 94305',
  contacts: [
    { role: 'Principal Investigator', name: 'Thomas Quertermous, MD', email: 'tomq1@stanford.edu', phone: '650-723-5012' },
    { role: 'Administrative Associate', name: 'Mariah J. Roberts', email: 'mariahr@stanford.edu', phone: '650-497-6234' },
    { role: 'Lab Manager', name: 'Trieu Nguyen', email: 'trieu@stanford.edu', phone: '650-498-4810' },
  ],
};

/** The lab's causal chain, shown as the homepage "approach" strip. */
export const pipeline = [
  { k: 'Variant', t: 'GWAS risk loci', d: 'Hundreds of loci from multi-ancestry CAD genetics' },
  { k: 'Enhancer', t: 'Regulatory element', d: 'Single-cell ATAC, ChIP, HiChIP, QTLs, CRISPRi screens' },
  { k: 'Gene', t: 'Causal gene', d: 'TCF21, SMAD3, ZEB2, PDGFD, ADAR1, AHR …' },
  { k: 'Cell state', t: 'Vascular cell fate', d: 'SMC → fibromyocyte, chondromyocyte; EC, fibroblast programs' },
  { k: 'Disease', t: 'Plaque biology', d: 'Stability, calcification, inflammation, remodeling' },
];

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

export const themes: Theme[] = [
  {
    id: 'gwas-mechanisms',
    illustration: 'locus',
    title: 'From GWAS loci to causal genes and variants',
    short: 'Pinpointing the variants, enhancers and genes that carry coronary artery disease risk.',
    color: 'var(--artery)',
    body: [
      'Genome-wide association studies — many of which our lab helped lead in multi-ethnic cohorts — have mapped hundreds of loci for coronary artery disease (CAD). Most risk variants are noncoding and act by changing gene expression in specific cell types, so the path from association to mechanism runs through the regulatory genome.',
      'We map allele-specific transcription factor binding, chromatin accessibility and 3D chromatin looping in primary human coronary artery smooth muscle cells, and combine these molecular QTLs with CRISPR interference to connect risk variants to their target genes. This has revealed causal mechanisms at loci including TCF21, SMAD3, ZEB2, PDGFD, FN1 and 9p21.3.',
    ],
    papers: ['36792607', '32513244', '31014396', '34990206', '30146127', '40950476'],
    methods: ['Molecular QTLs (bQTL, caQTL, clQTL)', 'HiChIP', 'CRISPRi / CRISPRa', 'Colocalization & fine-mapping'],
  },
  {
    id: 'smc-states',
    illustration: 'smc',
    title: 'Smooth muscle cell fate in atherosclerosis',
    short: 'How smooth muscle cells change identity in plaque — and which transitions protect or harm.',
    color: 'var(--plaque)',
    body: [
      'Smooth muscle cells (SMCs) are the cell type in which CAD genetic risk is most strongly enriched. During atherosclerosis they undergo "phenotypic modulation" into fibromyocytes that stabilize the fibrous cap, or chondromyocytes that drive calcification. Using lineage tracing with single-cell genomics, we discovered that the CAD gene TCF21 promotes the protective transition, and that SMAD3, ZEB2, AHR and PDGFD control the balance between fates.',
      'Our dense single-cell RNA and chromatin timecourses now trace these trajectories step by step, identify the transcription factor networks that drive them, and show where along each trajectory inherited risk acts.',
    ],
    papers: ['41844614', '31359001', '36246779', '32441123', '41610194'],
    methods: ['SMC lineage tracing (Myh11-CreERT2, tdTomato)', 'Conditional knockouts', 'scRNA-seq / scATAC-seq timecourses', 'Xenium spatial transcriptomics'],
  },
  {
    id: 'atlas',
    illustration: 'atlas',
    title: 'Single-cell and spatial atlases of human arteries',
    short: 'Cataloguing the cells of every major arterial bed, and the enhancers that define them.',
    color: 'var(--vein-soft)',
    body: [
      'As part of the Chan Zuckerberg Initiative Human Cell Atlas, we built a single-cell and spatial atlas of healthy human arteries across multiple segments — from the aortic root and coronary arteries to the carotid, pulmonary and iliac arteries. Arterial smooth muscle cells, fibroblasts and endothelial cells carry segment-specific programs that reflect their embryonic origin and help explain why disease strikes some vessels and spares others.',
      'Paired single-cell chromatin maps reveal vascular site–specific enhancers, and deep-learning models of chromatin accessibility (ChromBPNet) predict how disease variants act in each cell type and vascular site.',
    ],
    papers: ['41086809', '40931195', '38152886', '42283082'],
    methods: ['Single-cell multiome', 'Slide-seq & Xenium', 'ChromBPNet deep learning', 'CELLxGENE data release'],
  },
  {
    id: 'functional-genomics',
    illustration: 'perturb',
    title: 'Functional genomics at scale',
    short: 'CRISPRi Perturb-seq and TAP-seq screens of CAD genes and enhancers, in human cells and in vivo — shared through IGVF.',
    color: 'var(--endo)',
    body: [
      'To move from single loci to the whole genetic architecture of CAD, we perturb hundreds of candidate genes and enhancers at once in human coronary artery smooth muscle cells and in mouse arteries, reading out each perturbation by single-cell RNA sequencing.',
      'As part of the NHGRI Impact of Genomic Variation on Function (IGVF) consortium we have generated CRISPR interference screens with three complementary designs: Parse Perturb-seq targeting the promoters of genes at CAD loci, TAP-seq targeting candidate cis-regulatory elements across CAD loci with a targeted readout of nearby genes, and in vivo Perturb-seq in Myh11-Cre; Rosa26-LSL-dCas9-KRAB mice, in which an AAV guide library silences candidate genes specifically in aortic smooth muscle cells. Released datasets are available on the IGVF Data Portal, with more to follow.',
    ],
    papers: ['40950476', '39606421', '37486064'],
    methods: ['CRISPRi (dCas9-KRAB / ZIM3-KRAB)', 'Parse Perturb-seq', 'TAP-seq', 'In vivo AAV Perturb-seq', 'cNMF gene programs'],
  },
];

export const consortia = [
  {
    name: 'IGVF Consortium',
    full: 'Impact of Genomic Variation on Function · NHGRI',
    url: 'https://www.genome.gov/Funded-Programs-Projects/Impact-of-Genomic-Variation-on-Function-Consortium',
    desc: 'With five other Stanford labs, decoding how cardiovascular GWAS variants affect genome function and disease.',
  },
  {
    name: 'CZI Human Cell Atlas',
    full: 'Seed Network · Human vasculature',
    url: 'https://chanzuckerberg.com/science/programs-resources/humancellatlas/seednetworks/single-cell-transcriptomic-and-epigenomic-features-of-the-human-vasculature/',
    desc: 'Single-cell transcriptomic and epigenomic features of human arterial segments, released openly on CELLxGENE.',
  },
  {
    name: 'ATHENA Network',
    full: 'Atherosclerosis Targets from Human gEnetics and functional geNomic Approaches',
    url: '/athena/',
    desc: 'A transatlantic collaborative laboratory (Stanford, Cambridge, Karolinska, Helsinki, WashU) to validate causal atherosclerosis genes.',
  },
];

export const dataResources = [
  {
    title: 'Human Arterial Atlas',
    kind: 'Interactive data · CELLxGENE',
    url: 'https://cellxgene.cziscience.com/collections/8f17ac63-aaba-44b5-9b78-60f121da4c2f',
    desc: 'Single-cell and spatial transcriptomes of healthy human arterial segments. Zhao et al., Cell Genomics 2025.',
    code: 'https://github.com/QuertermousLab/czi_rna',
  },
  {
    title: 'Atherosclerosis SMC timecourse',
    kind: 'Interactive data · CELLxGENE',
    url: 'https://cellxgene.cziscience.com/collections/7a3044e4-6b16-4693-9504-212d9a573f80',
    desc: 'Single-cell RNA + ATAC timecourse of SMC lineage-traced mouse atherosclerosis. Li et al., Nat Commun 2026.',
    code: 'https://github.com/QuertermousLab/GWASanalytics',
  },
  {
    title: 'Vascular site single-cell epigenomes',
    kind: 'GEO · GSE296197',
    url: 'https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE296197',
    desc: 'scRNA-seq and scATAC-seq of ascending aorta, carotid and descending aorta. Weldy et al., Mol Syst Biol 2025.',
  },
  {
    title: 'SMC ADAR1 / MDA5 datasets',
    kind: 'GEO · GSE254862 · GSE255661 · GSE280641',
    url: 'https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE254862',
    desc: 'Single-cell and bulk RNA-seq from SMC-specific Adar and Ifih1 models. Weldy et al., Nat Cardiovasc Res 2025.',
  },
  {
    title: 'CAD enhancer CRISPRi screens',
    kind: 'GEO · GSE268252',
    url: 'https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE268252',
    desc: 'Genome-scale CRISPRi screens of CAD GWAS enhancers in HCASMC. Ramste et al., medRxiv 2025.',
  },
  {
    title: 'PDGFD locus & knockout scRNA-seq',
    kind: 'GEO · GSE214423',
    url: 'https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE214423',
    desc: 'Single-cell profiling of Pdgfd knockout atherosclerosis. Kim et al., Nat Commun 2023.',
  },
  {
    title: 'TCF21 molecular QTLs in HCASMC',
    kind: 'GEO · GSE113348',
    url: 'https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE113348',
    desc: 'Pooled bQTL / caQTL / clQTL maps in human coronary artery SMCs. Zhao et al., Genome Biol 2020.',
  },
  {
    title: 'SMC lineage-tracing scRNA-seq',
    kind: 'GEO · GSE131778',
    url: 'https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE131778',
    desc: 'Mouse SMC lineage-traced and human coronary artery single-cell data. Wirka et al., Nat Med 2019.',
  },
];

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
