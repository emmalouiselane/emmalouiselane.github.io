import type { ListeningItem } from './types/listeningItem';

export function isPlaylist(item: ListeningItem): boolean {
  return item.type?.trim().toLowerCase() === 'playlist';
}

/** Contentful supplies entries newest first by their original publication date. */
export function selectListeningHighlights(items: ListeningItem[]): ListeningItem[] {
  const playlist = items.find(isPlaylist);
  const otherItems = items.filter(item => !isPlaylist(item)).slice(0, 2);
  return playlist ? [playlist, ...otherItems] : otherItems;
}
