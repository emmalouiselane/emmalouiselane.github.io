export interface BlogPost {
  sys: { id: string };
  title: string;
  date: string;
  slug: string;
  description: string;
  blogType: string[];
  blogContent?: { json: any };
}