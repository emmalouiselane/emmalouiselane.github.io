export interface PortfolioItem {
  sys: { id: string; publishedAt: string };
  title: string;
  slug: string;
  description: string;
  images?: {
    items: Array<{
      url: string;
      width?: number;
      height?: number;
      title?: string;
      description?: string;
      fileName?: string;
      contentType?: string;
    }>;
  };
  externalUrl?: string;
  githubUrl?: string;
  isInDevelopment?: boolean;
  detailedDescription?: string;
  features?: { json: any };
  isIframe?: boolean;
}
