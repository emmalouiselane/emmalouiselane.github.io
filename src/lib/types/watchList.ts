export interface WatchList {
  sys: { id: string };
  title: string;
  thoughts?: { json: any };
  status: string;
  type: string;
  platform: string;
}

export type WatchListSummary = Omit<WatchList, 'thoughts'> & { hasThoughts: boolean };
