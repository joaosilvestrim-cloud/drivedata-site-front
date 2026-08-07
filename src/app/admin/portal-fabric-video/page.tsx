'use client';

import { EntityManager } from '@/common/components/admin/EntityManager';

export default function Page() {
  return (
    <EntityManager
      entity="portal-fabric-video"
      title="Vídeo Portal (Fabric)"
      description="Vídeo do YouTube exibido na página /portal-fabric. Cole o link do YouTube (ex.: https://www.youtube.com/watch?v=...). Use o botão de publicar/despublicar para exibir ou ocultar o vídeo na página. A landing usa o mais recente publicado."
      fields={[{ key: 'videoUrl', label: 'Link do YouTube', type: 'text' }]}
    />
  );
}
