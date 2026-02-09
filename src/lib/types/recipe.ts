export interface Recipe {
  sys: { id: string };
  name: string;
  rating: number;
  slug: string;
  personalNote?: string;
  imagesCollection?: {
    items: Array<{
      url: string;
      title?: string;
      description?: string;
      fileName: string;
      contentType: string;
    }>;
  };
  ingredients?: { json: any };
  directions?: { json: any };
  notes?: { json: any };
  review?: { json: any };
}