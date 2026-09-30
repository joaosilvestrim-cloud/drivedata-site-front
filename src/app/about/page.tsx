import { AboutClean, type AboutPartner } from '@/common/components/site-clean/about';
import type { CleanArticleCard } from '@/common/components/site-clean/articles-data';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { FaqModel } from '@/common/model/faq.model';
import { SolutionModel } from '@/common/model/solution.model';
import { TestimonialModel } from '@/common/model/testimonial.model';
import { cachedArticles, cachedFaqs, cachedPartners, cachedSolutions, cachedTestimonials } from '@/server/site-cache';
import { SITE_BASE_URL, SITE_COUNTRY } from '@/common/config/site';
import { localizedMetadata } from '@/common/seo/localized';

export const generateMetadata = () =>
  localizedMetadata('/about', {
    pt: {
      title: 'Sobre a DriveData · BI, Engenharia de Dados e IA',
      description:
        'Conheça a DriveData: consultoria em Business Intelligence, engenharia de dados, Microsoft Fabric e IA para operações de médio e grande porte. Soluções, clientes e cases.',
    },
    en: {
      title: 'About DriveData · BI, Data Engineering and AI',
      description:
        'Meet DriveData: Business Intelligence, data engineering, Microsoft Fabric and AI consulting for mid-size and large operations. Solutions, clients and case studies.',
    },
    es: {
      title: 'Sobre DriveData · BI, Ingeniería de Datos e IA',
      description:
        'Conozca DriveData: consultoría en Business Intelligence, ingeniería de datos, Microsoft Fabric e IA para operaciones medianas y grandes. Soluciones, clientes y casos.',
    },
    fr: {
      title: 'À propos de DriveData · BI, ingénierie des données et IA',
      description:
        'Découvrez DriveData : conseil en Business Intelligence, ingénierie des données, Microsoft Fabric et IA pour les moyennes et grandes organisations. Solutions, clients et études de cas.',
    },
  });


export default async function About() {
  const lang = await getLanguageSafeAsync();

  // Consultas em PARALELO. Antes eram 4 awaits SEQUENCIAIS (getSolutions →
  // getTestimonials → getArticles → getFaqs) e a latência somava, travando a
  // navegação até tudo carregar. Com Promise.all o tempo cai para o da consulta
  // mais lenta. Cada uma degrada para lista vazia se falhar.
  const [solutions, testimonials, articles, faqs, partners] = await Promise.all([
    cachedSolutions(lang).then(r => r as SolutionModel[]).catch(() => [] as SolutionModel[]),
    cachedTestimonials(lang).then(r => r as TestimonialModel[]).catch(() => [] as TestimonialModel[]),
    cachedArticles(lang).then(r => r.slice(0, 3)).catch(() => [] as CleanArticleCard[]),
    cachedFaqs(lang).then(r => r as FaqModel[]).catch(() => [] as FaqModel[]),
    // Logos do carrossel: vêm do servidor já filtrados por país. Antes a seção
    // buscava sozinha no cliente e, com a hidratação quebrada, o efeito nunca
    // rodava: a página ficava presa na lista de reserva do código.
    cachedPartners().then(r => r.map((p): AboutPartner => ({ imageUrl: p.imageUrl as string, name: p.name, featured: p.featured })))
      .catch(() => [] as AboutPartner[]),
  ]);

  // Texto puro a partir de HTML (respostas do FAQ e conteúdo das soluções).
  const plain = (s?: string) => (s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // JSON-LD: Service (soluções) + FAQPage (FAQ global). Ataca dois pontos da
  // auditoria: Schema.org fraco e "FAQ com Schema" crítico (0/100).
  const graph: Record<string, unknown>[] = [];
  for (const s of solutions) {
    graph.push({
      '@type': 'Service',
      name: s.title,
      description: plain(s.content).slice(0, 300) || undefined,
      provider: { '@id': `${SITE_BASE_URL}/#organization` },
      areaServed: SITE_COUNTRY,
      serviceType: s.title,
    });
  }
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_BASE_URL}/about#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.title,
        acceptedAnswer: { '@type': 'Answer', text: plain(f.description) },
      })),
    });
  }
  const aboutLd = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <>
      {graph.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }}
        />
      )}
      <AboutClean solutions={solutions} testimonials={testimonials} articles={articles} faqs={faqs} partners={partners} />
    </>
  );
}
