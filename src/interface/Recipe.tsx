export interface Recipe {
  slug: string;
  name: string;
  rating?: number;
  personalNote?: string;
  imagesCollection?: {
    items: Array<{
      url: string;
      width?: number;
      height?: number;
      title?: string;
      description?: string;
      fileName: string;
      contentType: string;
    }>;
  };
}