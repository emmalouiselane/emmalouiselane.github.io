import { describe, expect, it } from 'vitest';
import { breadcrumbsFor, canonicalPath, richTextSummary, serializeJsonLd } from '../src/lib/seo';
import { additionalPages, pageUrl } from '../src/lib/pagination';
import { contentfulImageUrl, contentfulSrcSet } from '../src/lib/images';

describe('SEO URL consistency', () => {
  it('keeps root and file URLs intact while normalising page trailing slashes', () => {
    expect(canonicalPath('/')).toBe('/');
    expect(canonicalPath('/portfolio')).toBe('/portfolio/');
    expect(canonicalPath('/portfolio/')).toBe('/portfolio/');
    expect(canonicalPath('/404.html')).toBe('/404.html');
    expect(pageUrl('/blog-posts/', 1)).toBe('/blog-posts/');
    expect(pageUrl('/blog-posts/', 2)).toBe('/blog-posts/page/2/');
    expect(additionalPages(13, 6)).toEqual([2, 3]);
    expect(additionalPages(0, 6)).toEqual([]);
  });

  it('avoids linking to a nonexistent /page/ index in breadcrumbs', () => {
    expect(breadcrumbsFor('/blog-posts/page/2/', 'Blog Posts - Page 2')).toEqual([
      { name: 'Home', path: '/' },
      { name: 'Blog Posts', path: '/blog-posts/' },
      { name: 'Page 2', path: '/blog-posts/page/2/' },
    ]);
  });
});

describe('structured data and descriptions', () => {
  it('prevents a CMS title from closing the JSON-LD script element', () => {
    const value = { headline: '</script><script>alert("test")</script>&' };
    const json = serializeJsonLd(value);
    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toEqual(value);
  });

  it('extracts text from rich text without exposing markup or empty descriptions', () => {
    expect(richTextSummary({ json: { content: [{ content: [{ value: 'A useful' }, { value: 'review.' }] }] } }, 'Fallback')).toBe('A useful review.');
    expect(richTextSummary(undefined, 'Fallback')).toBe('Fallback');
  });
});

describe('responsive Contentful images', () => {
  it('preserves unrelated hosts and transforms Contentful assets without enlarging them', () => {
    expect(contentfulImageUrl('/images/no-image.jpg', 640)).toBe('/images/no-image.jpg');
    expect(contentfulImageUrl('https://example.com/photo.jpg', 640)).toBe('https://example.com/photo.jpg');
    const url = new URL(contentfulImageUrl('//images.ctfassets.net/space/photo.jpg', 640));
    expect(url.protocol).toBe('https:');
    expect(url.searchParams.get('w')).toBe('640');
    expect(url.searchParams.get('fm')).toBe('webp');
    expect(url.searchParams.has('fit')).toBe(false);
    expect(contentfulSrcSet('/images/no-image.jpg')).toBeUndefined();
    expect(contentfulSrcSet(url.href)).toContain('1280w');
  });

  it('removes the rejected fit parameter from existing URLs and every responsive variant', () => {
    const source = 'https://images.ctfassets.net/space/photo.jpg?fit=limit&w=200';
    expect(new URL(contentfulImageUrl(source, 640)).searchParams.has('fit')).toBe(false);
    const variants = contentfulSrcSet(source)!.split(', ');
    expect(variants).toHaveLength(4);
    for (const variant of variants) {
      const [src, descriptor] = variant.split(' ');
      const url = new URL(src);
      expect(url.searchParams.has('fit')).toBe(false);
      expect(descriptor).toBe(`${url.searchParams.get('w')}w`);
    }
  });
});
