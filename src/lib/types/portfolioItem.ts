export interface PortfolioItem {
  sys: { id: string };
  title: string;
  slug: string;
  description: string;
  externalUrl?: string;
  githubUrl?: string;
  isInDevelopment?: boolean;
  detailedDescription?: string;
  features?: { json: any };
  isIframe?: boolean;
}