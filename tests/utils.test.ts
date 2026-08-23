import { describe, expect, it } from 'vitest';

import { cn, mapEntries, mapEntry, normalizeAssetUrl } from '../src/lib/utils';

describe('normalizeAssetUrl', () => {
  it('returns undefined for missing URLs', () => {
    expect(normalizeAssetUrl()).toBeUndefined();
    expect(normalizeAssetUrl('')).toBeUndefined();
  });

  it('adds a protocol to protocol-relative URLs', () => {
    expect(normalizeAssetUrl('//images.example.com/cover.jpg'))
      .toBe('https://images.example.com/cover.jpg');
  });

  it('leaves normal URLs unchanged', () => {
    expect(normalizeAssetUrl('https://images.example.com/cover.jpg'))
      .toBe('https://images.example.com/cover.jpg');
    expect(normalizeAssetUrl('/images/cover.jpg')).toBe('/images/cover.jpg');
    expect(normalizeAssetUrl('data:image/png;base64,abc'))
      .toBe('data:image/png;base64,abc');
  });
});

describe('mapEntry and mapEntries', () => {
  it('trims slugs without changing other fields', () => {
    const entry = { title: 'Example', slug: '  example  ' };

    expect(mapEntry(entry)).toEqual({ title: 'Example', slug: 'example' });
    expect(entry.slug).toBe('  example  ');
  });

  it('does not alter entries without string slugs', () => {
    const entry = { title: 'Example', slug: null };

    expect(mapEntry(entry)).toBe(entry);
  });

  it('maps a collection and handles empty input', () => {
    expect(mapEntries([{ slug: ' one ' }, { slug: 'two' }]))
      .toEqual([{ slug: 'one' }, { slug: 'two' }]);
    expect(mapEntries([])).toEqual([]);
  });

  it('preserves entries with missing or non-string slugs in a collection', () => {
    const missingSlug = { title: 'Missing slug' };
    const numericSlug = { title: 'Numeric slug', slug: 42 };

    expect(mapEntries([missingSlug, numericSlug])).toEqual([missingSlug, numericSlug]);
  });
});

describe('cn', () => {
  it('combines supported class value formats', () => {
    expect(cn('card', false && 'hidden', ['compact', null], { active: true, disabled: false }))
      .toBe('card compact active');
  });

  it('returns an empty string when all class values are falsy', () => {
    expect(cn(false, null, undefined, '', { active: false })).toBe('');
  });
});
