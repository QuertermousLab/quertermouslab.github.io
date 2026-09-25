// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` is used for canonical URLs and the sitemap — update at launch.
export default defineConfig({
  site: 'https://quertermouslab.github.io',
  integrations: [sitemap()],
  vite: { build: { assetsInlineLimit: 0 } },
  server: { port: Number(process.env.PORT) || 4321, host: true },
});
