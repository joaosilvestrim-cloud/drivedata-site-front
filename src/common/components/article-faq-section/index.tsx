'use client';

import { ArticleFaq } from '@/common/model/article.model';
import { FaqBlock, FaqItem, FaqQ, FaqA, FaqTitle, Wrap } from './styles';

// FAQ do artigo. Usa <details>/<summary> nativos: abre/fecha sem JavaScript,
// é acessível e o conteúdo já vem no HTML (crawlers e IAs leem direto). O
// schema FAQPage correspondente é injetado na página do artigo.
export function ArticleFaqSection({ faqs }: { faqs?: ArticleFaq[] }) {
  const items = (faqs || []).filter((f) => f?.q?.trim() && f?.a?.trim());
  if (!items.length) return null;

  return (
    <Wrap>
      <FaqBlock>
        <FaqTitle>Perguntas frequentes</FaqTitle>
        {items.map((f, i) => (
          <FaqItem key={i}>
            <FaqQ>{f.q}</FaqQ>
            <FaqA>{f.a}</FaqA>
          </FaqItem>
        ))}
      </FaqBlock>
    </Wrap>
  );
}
