'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, SectionTitle, Subtitle, HeadCentered, Card, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';

const SectionAlt = styled(Section)`
  background: ${tk.colors.bgSection};
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
`;

const Tab = styled.button<{ active: boolean }>`
  font-family: ${tk.fonts.heading};
  font-size: 14px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ${tk.easing};
  border: 1px solid ${({ active }) => (active ? 'transparent' : tk.colors.border)};
  background: ${({ active }) => (active ? tk.gradients.brand : 'rgba(255,255,255,0.03)')};
  color: ${({ active }) => (active ? '#06121f' : tk.colors.textSecondary)};

  &:hover { border-color: ${({ active }) => (active ? 'transparent' : tk.colors.borderActive)}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;

const FTitle = styled.h3`
  font-family: ${tk.fonts.heading};
  font-size: 16px;
  font-weight: 700;
  color: ${tk.colors.textPrimary};
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 8px; height: 8px; border-radius: 3px;
    background: ${tk.gradients.brand};
    flex-shrink: 0;
  }
`;

const FDesc = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 13.5px;
  line-height: 1.6;
  color: ${tk.colors.textSecondary};
`;

export function FeaturesSection() {
  const { copy } = usePortal();
  const f = copy.features;
  const [active, setActive] = useState(0);
  const group = f.groups[active];

  return (
    <SectionAlt id="features">
      <Glow y="-5%" x="40%" color="rgba(84,218,137,0.1)" />
      <Inner>
        <HeadCentered>
          <SectionTitle>{f.title}</SectionTitle>
          <Subtitle>{f.subtitle}</Subtitle>
        </HeadCentered>

        <Tabs>
          {f.groups.map((g, i) => (
            <Tab key={g.tag} active={i === active} onClick={() => setActive(i)}>{g.tag}</Tab>
          ))}
        </Tabs>

        <Grid>
          {group.items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 2) * 0.08}>
              <Card style={{ height: '100%' }}>
                <FTitle>{it.title}</FTitle>
                <FDesc>{it.desc}</FDesc>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Inner>
    </SectionAlt>
  );
}
