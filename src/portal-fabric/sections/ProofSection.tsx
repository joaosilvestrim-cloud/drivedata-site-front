'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, Eyebrow, SectionTitle, Subtitle, HeadCentered, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';

const SectionAlt = styled(Section)`
  background: ${tk.colors.bgSection};
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 56px;

  @media (max-width: 800px) { grid-template-columns: repeat(2, 1fr); }
`;

const Stat = styled.div`
  text-align: center;
  padding: 28px 16px;
  border-radius: ${tk.radius.lg};
  border: 1px solid ${tk.colors.border};
  background: ${tk.colors.bgCard};
  backdrop-filter: blur(12px);

  strong {
    display: block;
    font-family: ${tk.fonts.heading};
    font-size: clamp(28px, 3.6vw, 40px);
    font-weight: 800;
    background: ${tk.gradients.brand};
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  span {
    display: block;
    font-family: ${tk.fonts.body};
    font-size: 13px;
    line-height: 1.5;
    color: ${tk.colors.textSecondary};
    margin-top: 10px;
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
  background: rgba(255, 255, 255, 0.03);
`;

export function ProofSection() {
  const { copy } = usePortal();
  const p = copy.proof;

  return (
    <SectionAlt>
      <Glow y="-10%" x="50%" />
      <Inner>
        <HeadCentered>
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <SectionTitle>{p.title}</SectionTitle>
          <Subtitle>{p.subtitle}</Subtitle>
        </HeadCentered>

        <Stats>
          {p.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <Stat>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </Stat>
            </Reveal>
          ))}
        </Stats>

        <CompatTitle>{p.compatTitle}</CompatTitle>
        <Chips>
          {p.compat.map((c) => <Chip key={c}>{c}</Chip>)}
        </Chips>
      </Inner>
    </SectionAlt>
  );
}
