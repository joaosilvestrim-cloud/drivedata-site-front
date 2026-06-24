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
import { httpFindManyArticle } from '@/modules/article/api/find-many-article/http-find-many-article';
import { FindManyArticleResult } from '@/modules/article/types/find-many-article-case';
import { httpFindManyFaq } from '@/modules/faq/api/find-many-faq/http-find-many-faq';
import { httpFindManySolution } from '@/modules/solution/api/find-many-solution/http-find-many-solution';
import { httpFindManyTestimonial } from '@/modules/testimonial/api/find-many-testimonial/http-find-many-testimonial';


export default async function About() {
  const lang = await getLanguageSafeAsync();
  
  let solutions: SolutionModel[] = [];
  let testimonials: TestimonialModel[] = [];
  let articles: FindManyArticleResult = [];
  let faqs: FaqModel[] = [];
  
  try {
    solutions = await httpFindManySolution({}, lang);
  } catch {}

  try {
    testimonials = await httpFindManyTestimonial({}, lang);
  } catch {}

  try {
    articles = await httpFindManyArticle({ limit: 3 }, lang);
  } catch {}

  try {
    faqs = await httpFindManyFaq({}, lang);
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
