import { describe, expect, it } from 'vitest';
import { selectListeningHighlights } from '../src/lib/listening';
import type { ListeningItem } from '../src/lib/types/listeningItem';

const item = (id: string, type?: string | null): ListeningItem => ({ sys: { id }, title: id, type });

describe('Listening highlights', () => {
  it('puts the newest playlist first even when other types were published more recently', () => {
    const entries = [
      item('newest-track', 'Track'),
      item('newest-podcast', 'Podcast'),
      item('newest-playlist', 'Playlist'),
      item('older-playlist', 'Playlist'),
      item('older-album', 'Album'),
    ];
    expect(selectListeningHighlights(entries).map(entry => entry.sys.id)).toEqual([
      'newest-playlist', 'newest-track', 'newest-podcast',
    ]);
    expect(entries[0].sys.id).toBe('newest-track');
  });

  it('matches playlist labels regardless of case or whitespace', () => {
    expect(selectListeningHighlights([
      item('track', 'Track'), item('playlist', ' PLAYLIST '), item('older-playlist', 'playlist'),
    ]).map(entry => entry.sys.id)).toEqual(['playlist', 'track']);
  });

  it('selects the two newest non-playlists even if they share a type', () => {
    expect(selectListeningHighlights([
      item('playlist', 'Playlist'), item('first-track', 'Track'), item('second-track', 'Track'), item('podcast', 'Podcast'),
    ]).map(entry => entry.sys.id)).toEqual(['playlist', 'first-track', 'second-track']);
  });

  it('shows available entries when a playlist or other recommendations are missing', () => {
    expect(selectListeningHighlights([])).toEqual([]);
    expect(selectListeningHighlights([item('playlist', 'Playlist'), item('older-playlist', 'Playlist')])
      .map(entry => entry.sys.id)).toEqual(['playlist']);
    expect(selectListeningHighlights([item('track', 'Track'), item('other', null), item('older', 'Album')])
      .map(entry => entry.sys.id)).toEqual(['track', 'other']);
  });
});
