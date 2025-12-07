// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sparklane.dev',
  integrations: [
    react(),
    sitemap({
      canonicalURL: 'https://sparklane.dev',
    })
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});