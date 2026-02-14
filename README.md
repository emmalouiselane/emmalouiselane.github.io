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
   PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
   PUBLIC_CONTENTFUL_DELIVERY_TOKEN=your_delivery_token
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
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/      # React and Astro components
│   │   └── ui/          # Reusable UI components
│   ├── hooks/           # React hooks
│   ├── interface/       # TypeScript interfaces
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utilities and Contentful client
│   ├── pages/           # File-based routing
│   │   ├── blog-posts/
│   │   ├── portfolio/
│   │   ├── digital-garden/
│   │   │   ├── gaming/
│   │   │   ├── listening/
│   │   │   ├── reading/
│   │   │   └── recipes/
│   │   ├── about.astro
│   │   └── accessibility-statement.astro
│   ├── styles/          # SCSS styles
│   │   └── partials/    # Style modules
│   └── images/          # Image assets
├── tests/               # Test files
├── astro.config.mjs     # Astro configuration
├── package.json
└── tsconfig.json
```

## 🧩 Key Features

- **Static Site Generation** with Astro 5.x
- **React Components** with hooks for dynamic, interactive elements
- **Real-time filtering and pagination** without page refreshes
- **TypeScript** support with strict configuration
- **Contentful CMS** integration with blog type categorization
- **SCSS** styling with Tailwind CSS 4.x
- **SEOComponent optimized** with meta tags and sitemap
- **Responsive design** with mobile-first approach
- **Dark mode** support
- **Digital Garden** sections for gaming, listening, reading, and recipes
- **Accessibility** statement and WCAG compliance
- **Component library** with reusable UI components using Radix UI

## 📝 Content Management

Content is managed through Contentful CMS:
- **Blog posts** with type categorization and rich text content
- **Portfolio items** with external links and descriptions
- **Recipes** with ratings, ingredients, and directions

## 🌿 Digital Garden

The site includes a digital garden with personal collections:
- **Gaming**: Game reviews and recommendations
- **Listening**: Music and podcast favorites
- **Reading**: Book reviews and reading lists
- **Recipes**: Personal recipe collection with ratings

## ⚡ Dynamic Features

The site includes several client-side React components for enhanced user experience:

- **Blog Posts Page**: Real-time search and filtering by blog type, with pagination
- **Home Page**: Dynamic loading of latest content from Contentful
- **Navigation**: Responsive mobile menu with smooth animations

All interactive elements use React hooks for state management, providing instant updates without page refreshes.

## 🚢 Deployment

The site is configured for GitHub Pages deployment with automatic deployment via GitHub Actions. The site is deployed to `https://sparklane.dev`.

### GitHub Actions Workflows

- **Build and Deploy**: Automatically builds and deploys the site on push to main branch
- **Dependency Updates**: Dependabot configured for automatic dependency updates

## 📄 License

MIT

## 👤 Author

Emma Lane - [emma@sparklane.dev](mailto:emma@sparklane.dev)
