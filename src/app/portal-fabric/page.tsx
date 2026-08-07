import { PortalFabricLanding } from '@/portal-fabric';
import { getPortalFabricVideoUrl } from '@/server/content-db';

// Revalida a cada 60s: mudança no admin reflete na landing em até 1 min.
export const revalidate = 60;

export default async function PortalFabricPage() {
  const videoUrl = await getPortalFabricVideoUrl();
  return <PortalFabricLanding videoUrl={videoUrl} />;
}
