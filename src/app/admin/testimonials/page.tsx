'use client';

import { EntityManager } from '@/common/components/admin/EntityManager';

export default function Page() {
  return (
    <EntityManager
      entity="testimonial"
      title="Depoimentos"
      description="Depoimentos de clientes exibidos na página Sobre."
      fields={[
        { key: 'clientName', label: 'Nome do cliente', type: 'text' },
        { key: 'clientCompany', label: 'Empresa', type: 'text' },
        { key: 'clientAvatar', label: 'Foto (imagem)', type: 'image' },
        { key: 'testimonial', label: 'Depoimento', type: 'textarea' },
        { key: 'rating', label: 'Nota (1 a 5)', type: 'int' },
        { key: 'order', label: 'Ordem', type: 'int' },
        { key: 'isActive', label: 'Ativo', type: 'bool' },
      ]}
    />
  );
}
