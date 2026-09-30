// Consultas públicas do site guardadas em cache por pouco tempo. Sem isso cada
// visita consultava o banco de novo (o layout é force-dynamic). Mudança feita no
// admin aparece em até REVALIDATE segundos. As funções originais continuam
// disponíveis para quem precisa do dado na hora (admin, sitemap).
import { unstable_cache } from 'next/cache';
import { findArticleReadOnly, listArticlesReadOnly } from '@/common/components/site-clean/articles-data';
import {
  getFaqs,
  getPartners,
  getPortalFabricVideoUrl,
  getProfiles,
  getSolutions,
  getTestimonials,
  type Lang,
} from './content-db';

const REVALIDATE = 120;
const opts = { revalidate: REVALIDATE, tags: ['site-content'] };

export const cachedProfiles = unstable_cache((lang: Lang) => getProfiles(lang), ['site:profiles'], opts);
export const cachedSolutions = unstable_cache((lang: Lang) => getSolutions(lang), ['site:solutions'], opts);
export const cachedTestimonials = unstable_cache((lang: Lang) => getTestimonials(lang), ['site:testimonials'], opts);
export const cachedFaqs = unstable_cache((lang: Lang) => getFaqs(lang), ['site:faqs'], opts);
export const cachedPartners = unstable_cache(() => getPartners(), ['site:partners'], opts);
export const cachedFabricVideo = unstable_cache(() => getPortalFabricVideoUrl(), ['site:fabric-video'], opts);
export const cachedArticles = unstable_cache((lang: Lang) => listArticlesReadOnly(lang), ['site:articles'], opts);
export const cachedArticle = unstable_cache((idOrSlug: string, lang: Lang) => findArticleReadOnly(idOrSlug, lang), ['site:article'], opts);
