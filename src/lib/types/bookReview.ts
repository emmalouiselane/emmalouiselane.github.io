export interface BookReview {
  sys: { id: string };
  title: string;
  author: { name: string };
  amazonLink?: string;
  starRating: number;
  genres: string[];
  status: string;
  completionDate?: string;
  bookSynopsis?: { json: any };
  thoughts?: { json: any };
}
