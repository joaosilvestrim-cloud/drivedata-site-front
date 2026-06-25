'use client';

import { EntityManager } from '@/common/components/admin/EntityManager';

export default function Page() {
  return (
    <EntityManager
      entity="faq"
      title="FAQ"
      description="Perguntas e respostas da página Sobre."
      fields={[
        { key: 'title', label: 'Pergunta', type: 'text' },
        { key: 'description', label: 'Resposta', type: 'textarea' },
      ]}
    />
  );
}
