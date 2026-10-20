import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Contentful build cache', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('PUBLIC_CONTENTFUL_SPACE_ID', 'test-space');
    vi.stubEnv('PUBLIC_CONTENTFUL_DELIVERY_TOKEN', 'test-token');
    vi.stubEnv('PROD', true);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('deduplicates concurrent and completed queries while isolating consumer mutations', async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(Response.json({
      data: { blogPostCollection: { items: [{ title: 'A post', sys: { id: '1' } }] } },
    })));
    vi.stubGlobal('fetch', fetchMock);
    const { getAllBlogs } = await import('../src/lib/contentful');
    const [first, second] = await Promise.all([getAllBlogs(), getAllBlogs()]);
    first[0].title = 'Changed';
    expect(second[0].title).toBe('A post');
    expect((await getAllBlogs())[0].title).toBe('A post');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('evicts failed queries, including partial GraphQL results', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ errors: [{ message: 'Failed' }], data: { blogPostCollection: { items: [] } } }))
      .mockResolvedValueOnce(Response.json({ data: { blogPostCollection: { items: [] } } }));
    vi.stubGlobal('fetch', fetchMock);
    const { getAllBlogs } = await import('../src/lib/contentful');
    await expect(getAllBlogs()).rejects.toThrow('Contentful GraphQL query failed');
    await expect(getAllBlogs()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not reuse stale content in development', async () => {
    vi.stubEnv('PROD', false);
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(Response.json({ data: { blogPostCollection: { items: [] } } })));
    vi.stubGlobal('fetch', fetchMock);
    const { getAllBlogs } = await import('../src/lib/contentful');
    await getAllBlogs();
    await getAllBlogs();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
