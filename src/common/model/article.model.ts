export interface ArticleModel {
  id: string;
  categoryId: string;
  imageUrl?: string;
  title: string;
  subTitle?: string;
  content: string;
  whitelabelId: string;
  createdAt: string;
  updatedAt: string;
  disabledAt?: string;
}

