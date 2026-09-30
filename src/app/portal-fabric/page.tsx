import { PortalFabricClean } from '@/common/components/site-clean/portal-fabric';
import { getPortalFabricVideoUrl } from '@/server/content-db';

// Revalida a cada 60s: mudança no admin reflete na landing em até 1 min.
// Metadata e scripts ficam no layout.tsx desta rota.
export const revalidate = 60;

export default async function PortalFabricPage() {
  let videoUrl: string | null = null;
  try {
    videoUrl = await getPortalFabricVideoUrl();
  } catch (error) {
    console.error(error);
  }
  return <PortalFabricClean videoUrl={videoUrl} />;
}
