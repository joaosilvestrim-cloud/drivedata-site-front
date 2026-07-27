'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, Eyebrow, SectionTitle, Subtitle, HeadCentered, Card, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';

const SectionAlt = styled(Section)`
  background: ${tk.colors.bgSection};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1000px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const StepNum = styled.span`
  display: block;
  font-family: ${tk.fonts.heading};
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(84, 218, 137, 0.5);
  margin-bottom: 16px;
`;

const StepTitle = styled.h3`
  font-family: ${tk.fonts.heading};
  font-size: 17px;
  font-weight: 700;
  color: ${tk.colors.textPrimary};
  margin-bottom: 10px;
`;

const StepDesc = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 13.5px;
  line-height: 1.6;
  color: ${tk.colors.textSecondary};
`;

export function HowSection() {
  const { copy } = usePortal();
  const h = copy.how;

  return (
    <SectionAlt id="como-funciona">
      <Glow y="-10%" x="30%" />
      <Inner>
        <HeadCentered>
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <SectionTitle>{h.title}</SectionTitle>
          <Subtitle>{h.subtitle}</Subtitle>
        </HeadCentered>
        <Grid>
          {h.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <Card style={{ height: '100%' }}>
                <StepNum>{String(i + 1).padStart(2, '0')}</StepNum>
                <StepTitle>{s.title}</StepTitle>
                <StepDesc>{s.desc}</StepDesc>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Inner>
    </SectionAlt>
  );
}
