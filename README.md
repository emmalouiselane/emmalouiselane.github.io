# Spark Lane - Astro Site

This is the Astro version of the Spark Lane blog and portfolio site, migrated from Gatsby.

## Quick start

### Prerequisites

- Node.js 22 (the deployment workflows use Node.js 22)
- npm

### Installation

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

4. Add your Contentful credentials to `.env`:

   ```
   PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
   PUBLIC_CONTENTFUL_DELIVERY_TOKEN=your_delivery_token_here
   ```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

### Build and preview

Build the static production site:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The `postinstall` script patches the third-party RecipeCard package when dependencies are installed.

## Project structure

```
/
├── public/                  # Static assets, including /llms.txt
├── src/
│   ├── components/          # React and Astro components
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # React hooks
│   ├── interface/           # TypeScript interfaces
│   ├── layouts/             # Shared page layouts
│   ├── lib/                 # Utilities, types, and Contentful client
│   ├── pages/               # File-based routes
│   │   ├── blog-posts/
│   │   ├── digital-garden/
│   │   │   ├── gaming/
│   │   │   ├── listening/
│   │   │   ├── reading/
│   │   │   ├── recipes/
│   │   │   └── watching/
│   │   ├── portfolio/
│   │   ├── dissertation/
│   │   ├── workshop/
│   │   ├── about.astro
│   │   ├── 404.astro
│   │   └── accessibility-statement.astro
│   ├── styles/              # SCSS styles
│   └── images/              # Source image assets
├── scripts/                 # Build and dependency helper scripts
├── tests/                   # Test files
├── .github/                 # GitHub Actions and Dependabot configuration
├── astro.config.mjs         # Astro configuration
├── package.json
└── tsconfig.json
```

## Key features

- Static site generation with Astro 6
- React components for dynamic and interactive elements
- TypeScript with strict configuration
- Contentful CMS integration
- SCSS styling
- SEO metadata and sitemap generation
- Responsive, mobile-first layouts
- Light and dark colour themes
- Digital Garden sections for gaming, listening, reading, recipes, and watching
- Blog search, filtering, and pagination
- Reusable UI components built with Radix UI
- Custom RecipeCard component using `@sparklane.dev/sparklane-recipecard-react`
- Accessibility statement with ongoing WCAG 2.2-informed improvements
- Accessibility checks using WAVE
- Static llms.txt site summary for AI-readable discovery

## Content management

Content is managed through Contentful CMS:

- **Blog posts** with type categorisation and rich text content
- **Portfolio items** with external links and descriptions
- **Recipes** with ratings, ingredients, and directions
- **Book reviews** and **watching-list items**

## Digital Garden

The Digital Garden contains personal collections:

- **Gaming**: Game reviews and guides
- **Listening**: Music and podcast favourites
- **Reading**: Book reviews and reading lists
- **Recipes**: Personal recipes with ratings and custom RecipeCard components
- **Watching**: Films and television recommendations

## RecipeCard

The recipes page uses the custom `@sparklane.dev/sparklane-recipecard-react` package.

The implementation includes:

- Customisable styling and responsive image handling
- Fallback images
- Star ratings
- Interactive navigation
- Search and first-letter filtering
- SCSS overrides for card appearance

Package details: https://www.npmjs.com/package/@sparklane.dev/sparklane-recipecard-react

## Dynamic features

Client-side React components provide:

- Blog search and filtering by blog type
- Blog pagination
- Home-page content loaded from Contentful
- Responsive mobile navigation
- Light/dark theme switching
- Git commit history in the footer

The site supports reduced motion through the `prefers-reduced-motion` media feature.

A static llms.txt file is published at https://sparklane.dev/llms.txt with a concise, link-based overview of the site and its main sections.

## Deployment

The site is deployed to GitHub Pages at https://sparklane.dev using the custom domain in `CNAME`.

Deployment runs through GitHub Actions:

- `deploy.yml` runs on pushes to `main` and can also be run manually.
- `build-on-publish.yml` runs when Contentful publishes a `contentful-content-update` repository dispatch event.
- Both workflows use Node.js 22, install with `npm ci`, build with `npm run build`, and deploy the `dist/` directory.
- Dependabot checks npm dependencies daily.

For local development, use the `PUBLIC_CONTENTFUL_*` variables shown above. The GitHub Actions workflows currently read the repository secrets `GATSBY_CONTENTFUL_SPACE_ID` and `GATSBY_CONTENTFUL_DELIVERY_TOKEN`, then map them to the `PUBLIC_CONTENTFUL_*` variables during the build.

## License

MIT

## Author

Emma Lane - [emma@sparklane.dev](mailto:emma@sparklane.dev)
