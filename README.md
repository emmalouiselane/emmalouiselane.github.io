# Emerald Spark / Spark Lane Dev

Personal blog & portfolio of Emma Lane – a full-stack developer based in Somerset.
Built with **Gatsby 5**, Contentful, and modern tooling.

---

## 📊 Page Speed

https://pagespeed.web.dev/analysis/https-sparklane-dev/bdvg7izmx9?form_factor=desktop

---

## ✨ Features

| Area | What we use |
|------|-------------|
| Styling | (S)CSS Custom Properties, Bootstrap 5 utility classes |
| CMS | [Contentful](https://www.contentful.com/) (blog posts & recipes) |
| Images | `gatsby-plugin-image` & `gatsby-remark-images` |
| SEO | Sitemap, robots.txt, canonical URLs, Open-Graph/Twitter meta, social share image |
| Analytics | [PostHog](https://posthog.com/) + [Tinylytics](https://tinylytics.app/) |
| UX | Word-cloud landing page, dark-mode toggle, responsive navbar |

---

## 🛠 Getting Started

### 1. Clone & install

```bash
# SSH   
git clone git@github.com:emmalouiselane/emmalouiselane.github.io.git
cd emmalouiselane.github.io
npm install
```

### 2. Environment variables

Create a `.env` file at project root with your own credentials:

```env
GATSBY_CONTENTFUL_SPACE_ID=xxxxxxxxxxxxxxxx
GATSBY_CONTENTFUL_DELIVERY_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Run locally

```bash
npm start            # alias for `gatsby develop` on http://localhost:8000
```

### 4. Production build

```bash
npm run build        # generate static files in /public
npm run serve        # optional: serve the build locally
```

---

## 📂 Project Structure (major only)

```
.
├── src
│   ├── api             # API clients (Contentful)
│   ├── components      # Reusable UI (Navbar, SEO, Word Cloud…)
│   ├── hooks           # Custom React hooks (PostHog tracking)
│   ├── pages           # Static & CMS-sourced pages
│   ├── templates       # Gatsby page templates (blog, recipe, portfolio)
│   └── styles          # Global & component CSS
├── gatsby-config.js    # Plugin & metadata configuration
├── gatsby-node.js      # Dynamic page creation from Contentful
├── gatsby-ssr.js       # SSR hooks (analytics inject, lang attr)
└── README.md
```

---

## 🔍 SEO & Analytics

* `gatsby-plugin-sitemap` – auto-generated sitemap at `/sitemap.xml`.
* `gatsby-plugin-robots-txt` – allows all crawlers.
* `gatsby-plugin-canonical-urls` – canonical `<link>` per page.
* `Seo` component outputs title/description, Open-Graph & Twitter meta.
* PostHog events (`useTracking` hook) for navigation, post views, etc.

---

## 🚀 Deployment

Site is deployed automatically via **GitHub Actions** to Netlify (or manually run `npm run build` and push the `/public` folder to any static host e.g. GitHub Pages, Cloudflare Pages, Vercel).  
Update environment variables in your hosting dashboard.

---

## 🙏 Credits & Licenses

* Gatsby Starter Blog (MIT) as a foundation.
* Bootstrap © The Bootstrap Authors (MIT).
* Font assets from [Google Fonts](https://fonts.google.com/).

Code is licensed under the **MIT** license (see `LICENSE`).

---

> Made with ☕ + 🌱 by [Emma Lane](https://sparklane.dev)
