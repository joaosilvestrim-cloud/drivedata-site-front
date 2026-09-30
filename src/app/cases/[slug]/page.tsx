// Detalhe de um case de cliente.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseDetailClean } from '@/common/components/site-clean/cases';
import { CASES, caseMeta, findCase, publicCase } from '@/common/components/site-clean/cases-data';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { pageMetadata } from '@/common/seo';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = findCase((await params).slug);
  if (!item) return { title: 'Case · DriveData' };
  const m = caseMeta(item, await getLanguageSafeAsync());
  return pageMetadata({
    path: `/cases/${item.slug}`,
    title: `${m.client}: ${m.title.replace(/\.$/, '')} · DriveData`,
    description: m.summary,
  });
}

export default async function CasePage({ params }: Props) {
  const item = findCase((await params).slug);
  if (!item) notFound();
  // Outros cases: primeiro os que dividem algum tipo de projeto, depois o resto.
  const others = CASES.filter((c) => c.slug !== item.slug);
  const shares = (c: typeof item) => c.types.some((t) => item.types.includes(t));
  const related = [...others.filter(shares), ...others.filter((c) => !shares(c))].slice(0, 3);
  return <CaseDetailClean item={publicCase(item)} related={related.map(publicCase)} />;
}
