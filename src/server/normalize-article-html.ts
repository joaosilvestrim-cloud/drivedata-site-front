import { HTMLElement, parse } from 'node-html-parser';

// Normaliza o HTML do artigo vindo do CMS ANTES de renderizar. Resolve três
// achados da auditoria de SEO/GEO de uma vez, no servidor (então SSR e cliente
// recebem exatamente o mesmo HTML):
//
//  1. Múltiplos <h1> por página (~9): a página já tem UM <h1> (o título do
//     artigo). Todo <h1> do corpo vira <h2> para a hierarquia fazer sentido.
//  2. React hydration #418: bloco dentro de <p> faz o browser re-aninhar o DOM
//     e divergir do SSR. Um <p> que contém bloco passa a <div> (aceita bloco),
//     eliminando a correção do browser.
//  3. <img> sem alt: prejudica acessibilidade e SEO. Preenche o alt que falta.

const BLOCK = new Set([
  'div', 'p', 'ul', 'ol', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'figure', 'figcaption',
  'section', 'article', 'header', 'footer', 'hr', 'aside', 'main', 'nav',
]);

export function normalizeArticleHtml(html: string, fallbackAlt = ''): string {
  if (!html || typeof html !== 'string') return html ?? '';

  let root;
  try {
    root = parse(html, { comment: false });
  } catch {
    return html; // conteúdo estranho: não arrisca, devolve como veio
  }

  // 0) Limpa estilo embutido do HTML colado (Word/Docs/IA). Larguras fixas,
  //    white-space, float, position, cores e fontes coladas quebram o layout,
  //    ex.: texto vazando para fora do container de 800px. O artigo deve seguir
  //    a tipografia do site, então removemos style + atributos de dimensão de
  //    TODAS as tags. A imagem é tratada pelo CSS (max-width:100%).
  root.querySelectorAll('*').forEach((el) => {
    ['style', 'width', 'height', 'align', 'valign', 'bgcolor', 'face', 'color', 'class', 'dir'].forEach((attr) => {
      if (el.hasAttribute(attr)) el.removeAttribute(attr);
    });
  });

  // 1) h1 do corpo → h2 (o título da página é o único h1)
  root.querySelectorAll('h1').forEach((el) => {
    el.rawTagName = 'h2';
  });

  // 2) <p> que contém bloco → <div> (defesa extra contra o hydration #418;
  //    o próprio parser já separa a maioria dos casos ao reserializar).
  root.querySelectorAll('p').forEach((p) => {
    const hasBlock = p.childNodes.some(
      (c) => c instanceof HTMLElement && BLOCK.has((c.rawTagName || '').toLowerCase()),
    );
    if (hasBlock) p.rawTagName = 'div';
  });

  // 3) Texto solto direto dentro de tabela (fora de td/th). O browser move esse
  //    texto para FORA da tabela ao renderizar, divergindo do SSR (hydration
  //    #418). Removemos o texto órfão — ele não deveria estar ali e não aparece
  //    de forma útil de qualquer jeito.
  root.querySelectorAll('table, thead, tbody, tfoot, tr').forEach((el) => {
    el.childNodes
      .filter((c) => c.nodeType === 3 && (c.text || '').trim() !== '')
      .forEach((textNode) => textNode.remove());
  });

  // 4) alt em toda imagem + lazy/async (ajuda a performance do corpo)
  root.querySelectorAll('img').forEach((img) => {
    const alt = img.getAttribute('alt');
    if (alt == null || alt.trim() === '') img.setAttribute('alt', fallbackAlt);
    if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
  });

  return root.toString();
}
