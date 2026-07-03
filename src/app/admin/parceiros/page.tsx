'use client';

import { EntityManager } from '@/common/components/admin/EntityManager';

export default function Page() {
  return (
    <EntityManager
      entity="partner"
      title="Parceiros"
      description="Logos de clientes/parceiros do carrossel da home. Marque 'Top' para o logo rodar no carrossel; os demais ficam atrás do botão 'Ver mais'."
      icon="image"
      fields={[
        { key: 'imageUrl', label: 'Logo', type: 'image' },
        { key: 'name', label: 'Nome (opcional)', type: 'text' },
        { key: 'featured', label: 'Top (roda no carrossel)', type: 'bool' },
        { key: 'order', label: 'Ordem', type: 'int' },
      ]}
    />
  );
}
