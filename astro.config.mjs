// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sparklane.dev',

  integrations: [
    react(),
    sitemap()
  ],

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    ssr: {
      noExternal: ['@sparklane.dev/sparklane-recipecard-react'],
    },
  },
});
