import { getPartners } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return Response.json(await getPartners());
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
