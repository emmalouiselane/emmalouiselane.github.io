# Spark Lane - Astro Site

This is the Astro version of the Spark Lane blog and portfolio site, migrated from Gatsby.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your Contentful credentials:
   ```bash
   cp .env.example .env
   ```

4. Add your Contentful Space ID and Delivery Token to `.env`:
   ```
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_DELIVERY_TOKEN=your_delivery_token
   ```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Build

Build the site for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
/
├── public/              # Static assets
│   ├── robots.txt
│   └── images/
├── src/
│   ├── components/      # React and Astro components
│   ├── layouts/         # Page layouts
│   ├── pages/           # File-based routing
│   │   ├── blog-posts/
│   │   ├── portfolio/
│   │   └── workshop/
│   ├── lib/             # Utilities (Contentful client)
│   ├── hooks/           # React hooks
│   └── styles/          # SCSS styles
├── astro.config.mjs     # Astro configuration
└── package.json
```

## 🧩 Key Features

- **Static Site Generation** with Astro
- **React Components** for interactive elements
- **TypeScript** support
- **Contentful CMS** integration
- **SCSS** styling
- **Bootstrap** UI framework
- **SEO optimized** with meta tags and sitemap
- **Responsive design**

## 📝 Content Management

Content is managed through Contentful CMS:
- Blog posts
- Portfolio items
- Recipes

## 🚢 Deployment

The site is configured for GitHub Pages deployment. Push to the main branch to trigger automatic deployment via GitHub Actions.

## 📄 License

MIT

## 👤 Author

Emma Lane - [emma@sparklane.dev](mailto:emma@sparklane.dev)
