const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;
const TIMEOUT_MS = 15_000;
const MAX_RETRY_DELAY_MS = 30_000;

function retryDelay(response: Response, attempt: number): number {
  const reset = response.headers.get('x-contentful-ratelimit-reset');
  const retryAfter = response.headers.get('retry-after');
  const delays = [500 * 2 ** attempt + Math.random() * 250];
  if (reset && /^\d+$/.test(reset)) delays.push(Number(reset) * 1000);
  if (retryAfter) {
    const delay = /^\d+$/.test(retryAfter)
      ? Number(retryAfter) * 1000
      : Date.parse(retryAfter) - Date.now();
    if (Number.isFinite(delay)) delays.push(delay);
  }
  return Math.max(...delays);
}

/** Read-only API requests only: retries include reading the response body. */
export async function fetchJsonWithRetry<T>(url: string, options: RequestInit = {}): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let delay = 500 * 2 ** attempt + Math.random() * 250;
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      if (response.ok) return await response.json() as T;

      delay = retryDelay(response, attempt);
      await response.body?.cancel();
      if (!RETRYABLE_STATUSES.has(response.status) || attempt >= MAX_RETRIES
        || delay > MAX_RETRY_DELAY_MS) {
        // Avoid including provider response bodies or credentials in build logs.
        throw new HttpError(response.status);
      }
    } catch (error) {
      if (error instanceof HttpError || error instanceof SyntaxError || attempt >= MAX_RETRIES) {
        throw error;
      }
      // Only retry network failures and timeouts, not programming errors.
      if (!(error instanceof TypeError) && !controller.signal.aborted
        && !(error instanceof DOMException && error.name === 'AbortError')) throw error;
    } finally {
      clearTimeout(timeout);
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

class HttpError extends Error {
  constructor(status: number) {
    super(`API request failed with HTTP ${status}`);
    this.name = 'HttpError';
  }
}
