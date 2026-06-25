'use client';

import { EntityManager } from '@/common/components/admin/EntityManager';

export default function Page() {
  return (
    <EntityManager
      entity="solution"
      title="Soluções"
      description="Os cards de soluções da página Sobre."
      fields={[
        { key: 'title', label: 'Título', type: 'text' },
        { key: 'content', label: 'Descrição', type: 'textarea' },
        { key: 'icon', label: 'Ícone (imagem)', type: 'image' },
        { key: 'order', label: 'Ordem', type: 'int' },
      ]}
    />
  );
}
