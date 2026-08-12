'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, SectionTitle, Subtitle, HeadCentered, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';
import { BOOKING_URL } from '../booking';

// Moldura de vidro com anel de gradiente da marca em volta do agendador do Bookings.
// O interior (iframe da Microsoft) é claro e não pode ser estilizado; a moldura
// suaviza o contraste e dá cara de widget intencional na página escura.
const Frame = styled.div`
  position: relative;
  max-width: 820px;
  margin: 0 auto;
  padding: 10px;
  border-radius: ${tk.radius.lg};
  border: 1px solid ${tk.colors.border};
  background: ${tk.colors.bgCard};
  backdrop-filter: blur(14px);
  box-shadow: ${tk.shadows.card};

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
  }

  iframe {
    display: block;
    width: 100%;
    height: 760px;
    border: 0;
    border-radius: 14px;
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
