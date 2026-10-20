// Keep this list explicit: CMS edits must not be able to add trusted embed origins.
export const PORTFOLIO_EMBED_ORIGINS = ['https://sparklane.dev'];

export function safeExternalUrl(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

export function portfolioEmbedUrl(value?: string | null): string | undefined {
  const safe = safeExternalUrl(value);
  return safe && PORTFOLIO_EMBED_ORIGINS.includes(new URL(safe).origin) ? safe : undefined;
}
