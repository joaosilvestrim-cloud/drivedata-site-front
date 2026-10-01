'use client';

import { EntityManager } from '@/common/components/admin/EntityManager';

export default function Page() {
  return (
    <EntityManager
      entity="partner"
      title="Parceiros"
      description="Logos de clientes na faixa que passa na home e na página Sobre. Todos os logos ativos aparecem: os marcados como destaque (marcas globais conhecidas) passam na fileira de cima, em tamanho maior, e os demais na de baixo, na ordem do cadastro. Use 'Aparece em' quando o cliente for só de um país. Mudanças aparecem no site na hora."
      icon="image"
      fields={[
        { key: 'imageUrl', label: 'Logo', type: 'image' },
        { key: 'name', label: 'Nome (opcional)', type: 'text' },
        { key: 'featured', label: 'Destaque (fileira de cima, marcas globais)', type: 'bool' },
        {
          key: 'country',
          label: 'Aparece em',
          type: 'select',
          options: [
            { value: '', label: 'Os dois sites' },
            { value: 'BR', label: 'Só drivedata.com.br' },
            { value: 'CA', label: 'Só drivedata.ca' },
          ],
        },
        { key: 'order', label: 'Ordem', type: 'int' },
      ]}
    />
  );
}
