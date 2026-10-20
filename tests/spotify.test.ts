import { describe, expect, it } from 'vitest';
import { getSpotifyLinks } from '../src/lib/spotify';

describe('Spotify links', () => {
  it('uses a shared playlist URL to produce a clean link and a taller player', () => {
    expect(getSpotifyLinks(' https://open.spotify.com/playlist/37i9dQZF1DXc8kgYqQLMfH?si=shared ')).toEqual({
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXc8kgYqQLMfH',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXc8kgYqQLMfH?theme=0',
      embedHeight: 352,
      isPodcast: false,
    });
  });

  it('handles localised track links and existing embed URLs', () => {
    const track = getSpotifyLinks('https://open.spotify.com/intl-en/track/6gqTgtJ3aBDrWE9wrCe7L6');
    expect(track?.embedHeight).toBe(152);
    expect(track?.url).toBe('https://open.spotify.com/track/6gqTgtJ3aBDrWE9wrCe7L6');
    expect(getSpotifyLinks('https://open.spotify.com/embed/track/6gqTgtJ3aBDrWE9wrCe7L6?theme=0')).toEqual(track);
  });

  it('supports podcasts and provides profile links without unsupported profile players', () => {
    expect(getSpotifyLinks('https://open.spotify.com/show/5OzkclFjD6iAjtAuo7aIYt')?.isPodcast).toBe(true);
    expect(getSpotifyLinks('https://open.spotify.com/user/example.user')?.url).toBe('https://open.spotify.com/user/example.user');
    expect(getSpotifyLinks('https://open.spotify.com/user/example.user')?.embedUrl).toBeUndefined();
  });

  it.each([
    undefined, null, '', 'not a URL', 'javascript:alert(1)',
    'http://open.spotify.com/track/6gqTgtJ3aBDrWE9wrCe7L6',
    'https://open.spotify.com.evil.example/track/6gqTgtJ3aBDrWE9wrCe7L6',
    'https://example.com/track/6gqTgtJ3aBDrWE9wrCe7L6',
    'https://user:password@open.spotify.com/track/6gqTgtJ3aBDrWE9wrCe7L6',
    'https://open.spotify.com:444/track/6gqTgtJ3aBDrWE9wrCe7L6',
    'https://open.spotify.com/track/missing-id',
    'https://open.spotify.com/track/6gqTgtJ3aBDrWE9wrCe7L6/extra',
  ])('does not turn an invalid URL into a link or embedded player: %s', value => {
    expect(getSpotifyLinks(value)).toBeUndefined();
  });
});
