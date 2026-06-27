export interface ArticleModel {
  id: string;
  slug?: string | null;
  categoryId: string;
  imageUrl?: string;
  title: string;
  subTitle?: string;
  description?: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  documents?: { name: string; url: string; mime?: string; size?: number }[];
  author?: string | null;
  status?: string;
  publishedAt?: string;
  scheduledAt?: string | null;
  views?: number;
  whitelabelId: string;
  createdAt: string;
  updatedAt: string;
  disabledAt?: string;
}
