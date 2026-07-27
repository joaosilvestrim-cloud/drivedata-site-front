'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, Eyebrow, SectionTitle, Subtitle, HeadCentered, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 880px;
  margin: 0 auto;
`;

const Layer = styled.div<{ depth: number }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 22px 26px;
  border-radius: ${tk.radius.lg};
  border: 1px solid ${tk.colors.border};
  background: linear-gradient(135deg, rgba(10,150,236,${({ depth }) => 0.05 + depth * 0.03}) 0%, rgba(84,218,137,${({ depth }) => 0.03 + depth * 0.02}) 100%);
  backdrop-filter: blur(10px);
`;

const Index = styled.span`
  flex-shrink: 0;
  width: 34px; height: 34px;
  display: grid; place-items: center;
  border-radius: 10px;
  background: ${tk.gradients.brand};
  color: #06121f;
  font-family: ${tk.fonts.heading};
  font-weight: 800;
  font-size: 15px;
`;

const LTitle = styled.h3`
  font-family: ${tk.fonts.heading};
  font-size: 16.5px;
  font-weight: 700;
  color: ${tk.colors.textPrimary};
  margin-bottom: 5px;
`;

const LDesc = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 13.5px;
  line-height: 1.55;
  color: ${tk.colors.textSecondary};
`;

const Connector = styled.div`
  width: 1px;
  height: 14px;
  margin: -14px auto -1px;
  background: linear-gradient(180deg, transparent, ${tk.colors.borderActive});
`;

export function ArchitectureSection() {
  const { copy } = usePortal();
  const a = copy.arch;

  return (
    <Section id="arquitetura">
      <Glow y="-10%" x="70%" />
      <Inner>
        <HeadCentered>
          <Eyebrow>{a.eyebrow}</Eyebrow>
          <SectionTitle>{a.title}</SectionTitle>
          <Subtitle>{a.subtitle}</Subtitle>
        </HeadCentered>
        <Stack>
          {a.layers.map((l, i) => (
            <div key={l.title}>
              {i > 0 && <Connector />}
              <Reveal delay={i * 0.08}>
                <Layer depth={a.layers.length - 1 - i}>
                  <Index>{i + 1}</Index>
                  <div>
                    <LTitle>{l.title}</LTitle>
                    <LDesc>{l.desc}</LDesc>
                  </div>
                </Layer>
              </Reveal>
            </div>
          ))}
        </Stack>
      </Inner>
    </Section>
  );
}
