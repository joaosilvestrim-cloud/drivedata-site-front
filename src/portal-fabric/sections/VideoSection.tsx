'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, SectionTitle, Subtitle, HeadCentered, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';

// Moldura 16:9 com anel de gradiente da marca (mesmo estilo dos cards).
const Frame = styled.div`
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  border-radius: ${tk.radius.lg};
  overflow: hidden;
  border: 1px solid ${tk.colors.border};
  box-shadow: ${tk.shadows.card};
  background: ${tk.colors.bgCard};

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    /* Sem interação: não dá para pausar e o player não mostra título/canal no hover. */
    pointer-events: none;
  }
`;

// Camada transparente por cima: garante que nenhum clique/hover chegue ao player,
// em qualquer navegador (reforça o pointer-events:none do iframe).
const Shield = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  cursor: default;
`;

/** Extrai o ID (11 chars) de uma URL do YouTube (watch?v=, youtu.be, embed, shorts) ou de um ID puro. */
function youtubeId(input: string): string | null {
  const s = (input || '').trim();
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0] || null;
    const v = u.searchParams.get('v');
    if (v) return v;
    const m = u.pathname.match(/\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
  } catch {
    /* não é URL — cai no regex abaixo */
  }
  const m = s.match(/[A-Za-z0-9_-]{11}/);
  return m ? m[0] : null;
}

export function VideoSection({ url }: { url?: string | null }) {
  const { copy } = usePortal();
  const id = youtubeId(url ?? '');
  if (!id) return null; // sem vídeo configurado no admin → seção não aparece

  const v = copy.video;
  // Autoplay exige mudo; controls=0 tira a barra; loop repete; nocookie/modestbranding
  // + pointer bloqueado escondem o dono do canal e impedem pausar.
  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    `&controls=0&modestbranding=1&rel=0&disablekb=1&playsinline=1&fs=0&iv_load_policy=3`;

  return (
    <Section id="video">
      <Glow y="-10%" x="50%" />
      <Inner>
        <HeadCentered>
          <SectionTitle>{v.title}</SectionTitle>
          <Subtitle>{v.subtitle}</Subtitle>
        </HeadCentered>

        <Reveal>
          <Frame>
            <iframe
              src={src}
              title={v.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              tabIndex={-1}
              aria-hidden
            />
            <Shield />
          </Frame>
        </Reveal>
      </Inner>
    </Section>
  );
}
