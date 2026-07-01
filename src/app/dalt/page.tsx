import { redirect } from 'next/navigation';
import { DaltLanding } from '@/dalt';
import { SHOW_DALT } from '@/common/config/site';

export default function DaltPage() {
  // A DALT só existe no Brasil; no Canadá a rota redireciona para a home.
  if (!SHOW_DALT) redirect('/');
  return <DaltLanding />;
}
