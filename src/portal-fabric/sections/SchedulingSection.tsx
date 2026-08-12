'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, SectionTitle, Subtitle, HeadCentered, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';
import { BOOKING_URL } from '../booking';

const Frame = styled.div`
  max-width: 960px;
  margin: 0 auto;
  border-radius: ${tk.radius.lg};
  overflow: hidden;
  border: 1px solid ${tk.colors.border};
  box-shadow: ${tk.shadows.card};
  background: #fff;

  iframe {
    display: block;
    width: 100%;
    height: 820px;
    border: 0;
    @media (max-width: 640px) { height: 900px; }
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
