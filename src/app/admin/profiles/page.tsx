'use client';

import { EntityManager } from '@/common/components/admin/EntityManager';

export default function Page() {
  return (
    <EntityManager
      entity="target-audience-profile"
      title="Público-alvo"
      description='Cards "Para quem a DriveData é / não é" da home.'
      fields={[
        {
          key: 'type',
          label: 'Tipo',
          type: 'select',
          options: [
            { value: 'CUSTOMER', label: 'É para (cliente ideal)' },
            { value: 'NON_CUSTOMER', label: 'Não é para' },
          ],
        },
        { key: 'title', label: 'Título', type: 'text' },
        { key: 'description', label: 'Descrição', type: 'textarea' },
        { key: 'order', label: 'Ordem', type: 'int' },
      ]}
    />
  );
}
