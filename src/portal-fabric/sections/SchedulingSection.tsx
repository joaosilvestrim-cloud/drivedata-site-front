'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, SectionTitle, Subtitle, HeadCentered, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';
import { BOOKING_URL } from '../booking';

// Moldura de vidro com anel de gradiente da marca em volta do agendador do Bookings.
// O interior (iframe da Microsoft) é claro e não pode ser estilizado; a moldura
// suaviza o contraste e dá cara de widget intencional na página escura.
// Moldura justa ao formulário do Bookings (~560px), borda rente ao iframe e cantos
// arredondados clipando o branco. O anel de gradiente fica por cima da borda.
const Frame = styled.div`
  position: relative;
  max-width: 560px;
  margin: 0 auto;
  border-radius: ${tk.radius.lg};
  overflow: hidden;
  border: 1px solid ${tk.colors.border};
  box-shadow: ${tk.shadows.card};
  background: #fff;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: ${tk.gradients.brandSoft};
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 1;
  }

  iframe {
    display: block;
    width: 100%;
    height: 760px;
    border: 0;
    background: #fff;
    @media (max-width: 640px) { height: 880px; }
  }
`;

export function SchedulingSection() {
  const { copy } = usePortal();
  const s = copy.schedule;

  return (
    <Section id="agenda">
      <Glow y="-8%" x="50%" color="rgba(84,218,137,0.16)" />
      <Inner>
        <HeadCentered>
          <SectionTitle>{s.title}</SectionTitle>
          <Subtitle>{s.subtitle}</Subtitle>
        </HeadCentered>

        <Reveal>
          <Frame>
            {/* Agenda pública do Microsoft Bookings embutida — agendamentos caem no Outlook do time. */}
            <iframe src={BOOKING_URL} title={s.title} scrolling="yes" loading="lazy" />
          </Frame>
        </Reveal>
      </Inner>
    </Section>
  );
}
