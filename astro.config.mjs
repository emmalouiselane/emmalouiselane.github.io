// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { PORTFOLIO_EMBED_ORIGINS } from './src/lib/urls.ts';

export default defineConfig({
  site: 'https://sparklane.dev',
  trailingSlash: 'always',
  security: {
    csp: {
      scriptDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: 'https://tinylytics.app', kind: 'element' },
          { resource: "'none'", kind: 'attribute' },
        ],
      },
      // React and the contribution tooltip set style attributes; scripts remain hash-restricted.
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
      directives: [
        "default-src 'self'",
        "base-uri 'none'",
        "object-src 'none'",
        "form-action 'self'",
        "connect-src 'self' https://tinylytics.app",
        "img-src 'self' data: https://images.ctfassets.net https://tinylytics.app",
        "font-src 'self'",
        `frame-src https://open.spotify.com ${PORTFOLIO_EMBED_ORIGINS.join(' ')}`,
      ],
    },
  },
  markdown: { syntaxHighlight: 'prism' },
  redirects: {
    '/dissertation/': '/research-hub/',
    '/workshop/recipes': '/digital-garden/recipes/',
    '/workshop/recipes/[slug]': '/digital-garden/recipes/[slug]',
  },

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
    sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/workshop/') && !['/404/', '/dissertation/'].includes(new URL(page).pathname) })
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
