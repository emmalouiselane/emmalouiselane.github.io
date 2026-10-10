export function contentfulImageUrl(source: string, width: number) {
  const url = new URL(source.startsWith('//') ? `https:${source}` : source, 'https://sparklane.dev');
  if (url.hostname !== 'images.ctfassets.net') return source;
  url.searchParams.set('w', String(width));
  url.searchParams.set('fm', 'webp');
  url.searchParams.set('q', '80');
  // Contentful limits resizing by default; `limit` is not a valid fit value.
  url.searchParams.delete('fit');
  return url.href;
}

export function contentfulSrcSet(source: string) {
  const url = new URL(source.startsWith('//') ? `https:${source}` : source, 'https://sparklane.dev');

  if (url.hostname !== 'images.ctfassets.net')
    return undefined;
  
  return [320, 640, 960, 1280].map(width => `${contentfulImageUrl(source, width)} ${width}w`).join(', ');
}
