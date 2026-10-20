import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const entry = { sys: { id: 'song' }, title: 'Song', showEmbeddedPlayer: false };
const response = (items: unknown[], total = items.length) => new Response(JSON.stringify({
  data: { listeningItemCollection: { total, items } },
}));

describe('Contentful listening items', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('PUBLIC_CONTENTFUL_SPACE_ID', 'test-space');
    vi.stubEnv('PUBLIC_CONTENTFUL_DELIVERY_TOKEN', 'test-delivery-token');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('loads every page and ignores missing entries without losing an explicit false player setting', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response([...Array.from({ length: 99 }, () => entry), null], 101))
      .mockResolvedValueOnce(response([{ ...entry, sys: { id: 'last-item' } }], 101));
    vi.stubGlobal('fetch', fetchMock);
    const { getAllListeningItems } = await import('../src/lib/contentful');
    const items = await getAllListeningItems();
    expect(items).toHaveLength(100);
    expect(items.at(-1)?.sys.id).toBe('last-item');
    expect(items[0].showEmbeddedPlayer).toBe(false);
    expect(fetchMock.mock.calls.map(call => JSON.parse(call[1].body).variables.skip)).toEqual([0, 100]);
  });

  it('supports an empty published collection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([])));
    const { getAllListeningItems } = await import('../src/lib/contentful');
    await expect(getAllListeningItems()).resolves.toEqual([]);
  });

  it('does not silently present a Contentful failure as an empty collection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      errors: [{ message: 'Query failed' }],
    }))));
    const { getAllListeningItems } = await import('../src/lib/contentful');
    await expect(getAllListeningItems()).rejects.toThrow('Contentful GraphQL query failed');
  });
});
