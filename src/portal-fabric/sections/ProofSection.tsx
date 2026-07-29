'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, SectionTitle, Subtitle, HeadCentered, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';

const SectionAlt = styled(Section)`
  background: ${tk.colors.bgSection};
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 64px;

  @media (max-width: 800px) { grid-template-columns: repeat(2, 1fr); gap: 32px 8px; }
`;

const Stat = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 6px 22px;

  /* divisor sutil entre as colunas (não no primeiro item de cada linha) */
  & + &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: linear-gradient(180deg, transparent, ${tk.colors.border}, transparent);
  }
  @media (max-width: 800px) {
    & + &::before { display: none; }
  }

  strong {
    display: block;
    font-family: ${tk.fonts.heading};
    font-size: clamp(38px, 4.6vw, 56px);
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
    background: ${tk.gradients.brand};
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  span {
    display: block;
    font-family: ${tk.fonts.body};
    font-size: 13.5px;
    line-height: 1.5;
    color: ${tk.colors.textSecondary};
    max-width: 210px;
  }
`;

const CompatTitle = styled.p`
  text-align: center;
  font-family: ${tk.fonts.body};
  font-size: 13px;
  font-weight: 600;
  color: ${tk.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 820px;
  margin: 0 auto;
`;

const Chip = styled.span`
  font-family: ${tk.fonts.body};
  font-size: 13.5px;
  font-weight: 600;
  color: ${tk.colors.textSecondary};
  padding: 9px 18px;
  border-radius: 999px;
  border: 1px solid ${tk.colors.border};
  background: ${tk.colors.surfaceSubtle};
`;

export function ProofSection() {
  const { copy } = usePortal();
  const p = copy.proof;

  return (
    <SectionAlt>
      <Glow y="-10%" x="50%" />
      <Inner>
        <HeadCentered style={{ marginBottom: 68 }}>
          <SectionTitle>{p.title}</SectionTitle>
          <Subtitle>{p.subtitle}</Subtitle>
        </HeadCentered>

        <Reveal>
          <Stats>
            {p.stats.map((s) => (
              <Stat key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </Stat>
            ))}
          </Stats>
        </Reveal>

        <CompatTitle>{p.compatTitle}</CompatTitle>
        <Chips>
          {p.compat.map((c) => <Chip key={c}>{c}</Chip>)}
        </Chips>
      </Inner>
    </SectionAlt>
  );
}
