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

  let solutions: SolutionModel[] = [];
  let testimonials: TestimonialModel[] = [];
  let articles: FindManyArticleResult = [];
  let faqs: FaqModel[] = [];

  try {
    solutions = (await getSolutions(lang)) as SolutionModel[];
  } catch {}

  try {
    testimonials = (await getTestimonials(lang)) as TestimonialModel[];
  } catch {}

  try {
    articles = (await getArticles({ limit: 3 }, lang)) as FindManyArticleResult;
  } catch {}

  try {
    faqs = (await getFaqs(lang)) as FaqModel[];
  } catch {}

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
