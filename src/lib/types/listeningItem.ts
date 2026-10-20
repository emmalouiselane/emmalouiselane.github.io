export interface ListeningItem {
  sys: { id: string };
  title: string;
  creator?: string | null;
  type?: string | null;
  personalDescription?: string | null;
  spotifyUrl?: string | null;
  showEmbeddedPlayer?: boolean | null;
}
