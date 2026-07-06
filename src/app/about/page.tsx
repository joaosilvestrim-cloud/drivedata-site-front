import { AboutUsSection, DevicesShowcaseSection, Header, IntegrationsSection, MainAboutSection, PartnersSection, SolutionsAccordionSection, TestimonialsSection } from '@/common/components';
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
import { getArticles, getFaqs, getSolutions, getTestimonials } from '@/server/content-db';


export default async function About() {
  const lang = await getLanguageSafeAsync();

  // Consultas em PARALELO. Antes eram 4 awaits SEQUENCIAIS (getSolutions →
  // getTestimonials → getArticles → getFaqs) e a latência somava, travando a
  // navegação até tudo carregar. Com Promise.all o tempo cai para o da consulta
  // mais lenta. Cada uma degrada para lista vazia se falhar.
  const [solutions, testimonials, articles, faqs] = await Promise.all([
    getSolutions(lang).then(r => r as SolutionModel[]).catch(() => [] as SolutionModel[]),
    getTestimonials(lang).then(r => r as TestimonialModel[]).catch(() => [] as TestimonialModel[]),
    getArticles({ limit: 3 }, lang).then(r => r as FindManyArticleResult).catch(() => [] as FindManyArticleResult),
    getFaqs(lang).then(r => r as FaqModel[]).catch(() => [] as FaqModel[]),
  ]);

  return (
    <>
      <Header />
      <MainAboutSection />
      <PartnersSection />
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
