import type { Metadata } from 'next';
import { TambasaLayoutClient } from './layout-client';

export const metadata: Metadata = {
  title: {
    template: '%s | Tambasa Operações',
    default: 'Documentos Legais | Tambasa Operações',
  },
  description:
    'Documentos legais do aplicativo Tambasa Operações - Política de Privacidade, Termos de Uso e Exclusão de Dados',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TambasaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TambasaLayoutClient>{children}</TambasaLayoutClient>;
}
