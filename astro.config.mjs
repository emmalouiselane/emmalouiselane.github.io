// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sparklane.dev',
  trailingSlash: 'always',

  integrations: [
    {
      name: 'isolated-vite-cache',
      hooks: {
        'astro:config:setup': ({ command, updateConfig }) => {
          // Builds and sync must not replace a running dev server's optimized dependencies.
          updateConfig({
            vite: {
              cacheDir: fileURLToPath(new URL(`./node_modules/.vite/${command}/`, import.meta.url)),
            },
          });
        },
      },
    },
    react(),
    sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/workshop/') && new URL(page).pathname !== '/404/' })
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
