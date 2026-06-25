'use client';

import { EntityManager } from '@/common/components/admin/EntityManager';

export default function Page() {
  return (
    <EntityManager
      entity="article-category"
      title="Categorias"
      description="Categorias usadas nos artigos do blog."
      canPublish={false}
      fields={[{ key: 'name', label: 'Nome', type: 'text' }]}
    />
  );
}
