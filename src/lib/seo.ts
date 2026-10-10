export const siteMetadata = {
  name: 'Spark Lane',
  title: 'Emma Lane | Full-Stack Developer | Spark Lane',
  description: 'Emma Lane’s development portfolio and digital garden: accessible websites, full-stack projects, technical writing, recipes and reading notes.',
  url: 'https://sparklane.dev',
  author: 'Emma Lane',
};

export const person = {
  '@type': 'Person',
  '@id': `${siteMetadata.url}/#emma-lane`,
  name: siteMetadata.author,
  url: `${siteMetadata.url}/about/`,
  image: `${siteMetadata.url}/images/real-profile-pic.jpg`,
  jobTitle: 'Software Engineer and Technical Lead',
  sameAs: ['https://www.linkedin.com/in/emmalouiselane/', 'https://github.com/emmalouiselane'],
};

export function canonicalPath(pathname: string) {
  return pathname === '/' || /\.[^/]+$/.test(pathname)
    ? pathname
    : `${pathname.replace(/\/+$/, '')}/`;
}

// Escape HTML-significant characters because JSON-LD is inserted into a script element.
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

export function richTextSummary(document: { json?: unknown } | undefined, fallback: string) {
  const textOf = (node: unknown): string => {
    if (!node || typeof node !== 'object') return '';
    const { value, content } = node as { value?: unknown; content?: unknown[] };
    if (typeof value === 'string') return value;
    return Array.isArray(content) ? content.map(textOf).join(' ') : '';
  };
  const text = textOf(document?.json).replace(/\s+/g, ' ').trim();
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, '')}…` : text || fallback;
}

export function breadcrumbsFor(pathname: string, title?: string) {
  const labels: Record<string, string> = {
    'blog-posts': 'Blog Posts', portfolio: 'Portfolio', 'digital-garden': 'Digital garden',
    reading: 'Reading', watching: 'Watching', recipes: 'Recipes', gaming: 'Gaming',
    listening: 'Listening', about: 'About me', dissertation: 'Research', freelance: 'Freelance work',
  };

  const segments = canonicalPath(pathname).split('/').filter(Boolean);
  const crumbs = [{ name: 'Home', path: '/' }];

  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];

    if (segment === 'page') {
      crumbs.push({ name: `Page ${segments[index + 1]}`, path: canonicalPath(pathname) });
      break;
    }
    
    crumbs.push({
      name: index === segments.length - 1 && title ? title : labels[segment] || segment.replace(/-/g, ' '),
      path: `/${segments.slice(0, index + 1).join('/')}/`,
    });
  }
  return crumbs;
}
