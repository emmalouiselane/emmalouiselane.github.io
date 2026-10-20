const embedTypes = new Set(['track', 'playlist', 'album', 'artist', 'show', 'episode']);

export function getSpotifyLinks(value?: string | null) {
  if (!value?.trim()) return undefined;

  try {
    const source = new URL(value.trim());
    if (source.protocol !== 'https:' || source.hostname !== 'open.spotify.com'
      || source.username || source.password || source.port) return undefined;

    const segments = source.pathname.split('/').filter(Boolean);
    if (/^intl-[a-z]{2}(?:-[a-z]{2})?$/i.test(segments[0] || '')) 
      segments.shift();
    
    if (segments[0] === 'embed') 
      segments.shift();

    const [type, id] = segments;
    if (segments.length !== 2 || (!embedTypes.has(type) && type !== 'user')) 
      return undefined;
    
    if (type === 'user' ? !/^[\w.-]+$/.test(id) : !/^[a-zA-Z0-9]{22}$/.test(id)) 
      return undefined;

    return {
      url: `https://open.spotify.com/${type}/${id}`,
      embedUrl: embedTypes.has(type) ? `https://open.spotify.com/embed/${type}/${id}?theme=0` : undefined,
      embedHeight: ['playlist', 'album', 'artist'].includes(type) ? 352 : 152,
      isPodcast: type === 'show' || type === 'episode',
    };
  } catch {
    return undefined;
  }
}
