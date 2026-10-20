import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchJsonWithRetry } from '../src/lib/http';

describe('read-only API resilience', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('honours the Contentful reset header before retrying a rate-limited request', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('', { status: 429, headers: { 'x-contentful-ratelimit-reset': '2' } }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    const request = fetchJsonWithRetry('https://example.com');
    await vi.advanceTimersByTimeAsync(1999);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await expect(request).resolves.toEqual({ ok: true });
  });

  it('retries transient failures but stops after three attempts', async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response('', { status: 503 })));
    vi.stubGlobal('fetch', fetchMock);
    const request = expect(fetchJsonWithRetry('https://example.com')).rejects.toThrow('HTTP 503');
    await vi.runAllTimersAsync();
    await request;
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('does not retry authentication failures or print the provider response body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('sensitive-provider-detail', { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(fetchJsonWithRetry('https://example.com')).rejects.toThrow(/^API request failed with HTTP 401$/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('fails instead of retrying earlier than an excessive Retry-After', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 429, headers: { 'retry-after': '120' } }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(fetchJsonWithRetry('https://example.com')).rejects.toThrow('HTTP 429');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('aborts stalled requests and retries with a fresh signal', async () => {
    const signals: AbortSignal[] = [];
    const fetchMock = vi.fn().mockImplementation((_url, options) => {
      signals.push(options.signal);
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const request = expect(fetchJsonWithRetry('https://example.com')).rejects.toThrow('Aborted');
    await vi.runAllTimersAsync();
    await request;
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(new Set(signals).size).toBe(3);
    expect(signals.every(signal => signal.aborted)).toBe(true);
  });

  it('retries network errors but not malformed JSON', async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(new Response('not-json'));
    vi.stubGlobal('fetch', fetchMock);
    const request = expect(fetchJsonWithRetry('https://example.com')).rejects.toBeInstanceOf(SyntaxError);
    await vi.runAllTimersAsync();
    await request;
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
