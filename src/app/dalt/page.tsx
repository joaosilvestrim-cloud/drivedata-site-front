import { redirect } from 'next/navigation';
import { DaltClean } from '@/common/components/site-clean/dalt';
import { SHOW_DALT } from '@/common/config/site';

// Metadata, fontes e scripts de rastreamento ficam no layout.tsx desta rota.
export default function DaltPage() {
  if (!SHOW_DALT) redirect('/');
  return <DaltClean />;
}
