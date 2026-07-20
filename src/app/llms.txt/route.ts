// /llms.txt — mapa do site em Markdown para motores generativos (padrão llms.txt).
// Ajuda ChatGPT, Gemini, Claude e afins a entenderem e citarem o conteúdo da
// DriveData. Gerado dinamicamente a partir da camada de conteúdo (soluções +
// artigos), então acompanha o que é publicado. Resiliente: se o banco falhar,
// ainda entrega o mapa base.
import { getArticles, getSolutions } from '@/server/content-db';

export const runtime = 'nodejs';
export const revalidate = 3600; // 1h

const BASE = 'https://drivedata.com.br';

export async function GET() {
  const lines: string[] = [
    '# DriveData',
    '',
    '> Consultoria brasileira em dados, Business Intelligence e Inteligência Artificial. Transformamos dados operacionais e comerciais em suporte à decisão para empresas orientadas a crescimento.',
    '',
    'A DriveData atua com engenharia de dados, dashboards de BI, modelos preditivos, governança de dados e automação com IA. Atende operações de médio e grande porte, com forte presença em indústria, logística, varejo e áreas comerciais.',
    '',
    '## Páginas principais',
    `- [Início](${BASE}/): visão geral das soluções de dados, BI e IA.`,
    `- [Sobre](${BASE}/about): quem somos, soluções, clientes e resultados.`,
    `- [Blog](${BASE}/article): artigos sobre BI, IA, logística, indústria e análise de dados.`,
    `- [Política de Privacidade](${BASE}/privacy-policy): tratamento de dados pessoais.`,
  ];

  try {
    const solutions = (await getSolutions('pt')) as Array<{ title: string; content: string }>;
    if (solutions.length) {
      lines.push('', '## Soluções');
      for (const s of solutions) {
        const desc = (s.content || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);
        lines.push(`- ${s.title}${desc ? `: ${desc}` : ''}`);
      }
    }
  } catch {
    /* sem soluções: segue com o mapa base */
  }

  try {
    const articles = (await getArticles({ limit: 50 }, 'pt')) as Array<{
      id: string; slug?: string | null; title: string; description?: string;
    }>;
    if (articles.length) {
      lines.push('', '## Artigos');
      for (const a of articles) {
        const url = `${BASE}/article/${a.slug || a.id}`;
        const desc = (a.description || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 140);
        lines.push(`- [${a.title}](${url})${desc ? `: ${desc}` : ''}`);
      }
    }
  } catch {
    /* sem artigos: segue com o mapa base */
  }

  lines.push('', '## Contato', `- Site: ${BASE}`, '- LinkedIn: https://www.linkedin.com/company/drivedatabi/', '');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
