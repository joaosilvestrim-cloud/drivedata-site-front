'use client';

import { useState } from "react";
import { FindManyArticleResult } from "@/modules/article/types/find-many-article-case";
import Image from "next/image";
import Link from "next/link";
import { ArticleCardContainer, ArticleCategory, ArticleContent, ArticleExcerpt, ArticleThumbnail, ArticleTitle } from "./styles";

interface ArticleCardProps {
  article: FindManyArticleResult[number];
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [imgOk, setImgOk] = useState(true);
  return (
    <Link href={`/article/${article.slug || article.id}`} style={{ textDecoration: 'none' }}>
      <ArticleCardContainer>
        <ArticleThumbnail>
          {article.imageUrl && imgOk && (
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={400}
              height={220}
              loading="lazy"
              quality={80}
              onError={() => setImgOk(false)}
            />
          )}
        </ArticleThumbnail>
        <ArticleContent>
          <ArticleCategory>{article.category.name}</ArticleCategory>
          <ArticleTitle>{article.title}</ArticleTitle>
          {article.subTitle && <ArticleExcerpt>{article.subTitle}</ArticleExcerpt>}
        </ArticleContent>
      </ArticleCardContainer>
    </Link>
  );
};

