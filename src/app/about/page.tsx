import { AboutUsSection, DevicesShowcaseSection, Header, IntegrationsSection, MainAboutSection, PartnersSection, SolutionsAccordionSection, TestimonialsSection } from '@/common/components';
import { ThemeScope } from '@/common/components/theme-scope';
import { ArticlesSection } from '@/common/components/articles-section';
import { ContactSection } from '@/common/components/contact-section';
import { FaqSection } from '@/common/components/faq-section';
import { FloatingContact } from '@/common/components/floating-contact';
import { Footer } from '@/common/components/footer';
import { PreviewSolutionsSection } from '@/common/components/preview-solutions-section';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { FaqModel } from '@/common/model/faq.model';
import { SolutionModel } from '@/common/model/solution.model';
import { TestimonialModel } from '@/common/model/testimonial.model';
import { FindManyArticleResult } from '@/modules/article/types/find-many-article-case';
import { getArticles, getFaqs, getPartners, getSolutions, getTestimonials } from '@/server/content-db';
import { SITE_BASE_URL, SITE_COUNTRY } from '@/common/config/site';
import { pageMetadata } from '@/common/seo';

export const metadata = pageMetadata(
  SITE_COUNTRY === 'CA'
    ? {
        path: '/about',
        title: 'About DriveData · BI, Data Engineering and AI',
        description:
          'Meet DriveData: Business Intelligence, data engineering, Microsoft Fabric and AI consulting for mid-size and large operations. Solutions, clients and case studies.',
      }
    : {
        path: '/about',
        title: 'Sobre a DriveData · BI, Engenharia de Dados e IA',
        description:
          'Conheça a DriveData: consultoria em Business Intelligence, engenharia de dados, Microsoft Fabric e IA para operações de médio e grande porte. Soluções, clientes e cases.',
      },
);


export default async function About() {
  const lang = await getLanguageSafeAsync();

  // Consultas em PARALELO. Antes eram 4 awaits SEQUENCIAIS (getSolutions →
  // getTestimonials → getArticles → getFaqs) e a latência somava, travando a
  // navegação até tudo carregar. Com Promise.all o tempo cai para o da consulta
  // mais lenta. Cada uma degrada para lista vazia se falhar.
  const [solutions, testimonials, articles, faqs, partners] = await Promise.all([
    getSolutions(lang).then(r => r as SolutionModel[]).catch(() => [] as SolutionModel[]),
    getTestimonials(lang).then(r => r as TestimonialModel[]).catch(() => [] as TestimonialModel[]),
    getArticles({ limit: 3 }, lang).then(r => r as FindManyArticleResult).catch(() => [] as FindManyArticleResult),
    getFaqs(lang).then(r => r as FaqModel[]).catch(() => [] as FaqModel[]),
    // Logos do carrossel: vêm do servidor já filtrados por país. Antes a seção
    // buscava sozinha no cliente e, com a hidratação quebrada, o efeito nunca
    // rodava: a página ficava presa na lista de reserva do código.
    getPartners().then(r => r.map(p => ({ imageUrl: p.imageUrl as string, name: p.name, featured: p.featured })))
      .catch(() => [] as { imageUrl: string; name: string | null; featured: boolean }[]),
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
      areaServed: 'BR',
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
      <ThemeScope />
      <Header />
      <MainAboutSection />
      <PartnersSection partners={partners} />
      <SolutionsAccordionSection solutions={solutions} />
      <DevicesShowcaseSection />
      <IntegrationsSection />
      <AboutUsSection />
      <PreviewSolutionsSection />
      <TestimonialsSection testimonials={testimonials} />
      <ArticlesSection articles={articles} />
      <FaqSection faqs={faqs} />
      <ContactSection />
      <Footer />
      <FloatingContact />
    </>
  );
}
