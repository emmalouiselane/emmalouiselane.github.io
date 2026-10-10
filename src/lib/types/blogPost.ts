export interface BlogPost {
  sys: { id: string; publishedAt?: string };
  title: string;
  date: string;
  slug: string;
  description: string;
  blogType: string[];
  blogContent?: { json: any };
}