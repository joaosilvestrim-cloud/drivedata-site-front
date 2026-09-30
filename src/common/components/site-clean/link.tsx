'use client';

// Link do site: endereço interno ("/about", "/cases/…") usa a navegação do Next,
// sem recarregar a página e com pré-carregamento quando o link aparece na tela.
// Externo, âncora (#), e-mail, telefone ou link que abre em outra aba segue <a>.
import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function SmartLink({ href, ...rest }: Props) {
  const internal = href.startsWith('/') && !href.startsWith('//') && !rest.target;
  if (!internal) return <a href={href} {...rest} />;
  return <Link href={href} {...rest} />;
}
