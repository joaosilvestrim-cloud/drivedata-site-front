'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow } from '../components/primitives';
import { usePortal } from '../usePortal';

const HeroSection_ = styled(Section)`
  padding-top: 138px;
  background: ${tk.gradients.heroGlow};

  @media (max-width: 768px) {
    padding-top: 104px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${tk.colors.accentDim};
  border: 1px solid rgba(10, 150, 236, 0.35);
  color: #58baf5;
  font-family: ${tk.fonts.body};
  font-size: 13px;
  font-weight: 600;
  padding: 7px 15px;
  border-radius: 999px;

  &::before {
    content: '';
    width: 7px; height: 7px; border-radius: 50%;
    background: #58baf5; box-shadow: 0 0 10px #58baf5;
  }
`;

const Title = styled.h1`
  font-family: ${tk.fonts.heading};
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -1.4px;
  color: ${tk.colors.textPrimary};
  margin: 22px 0 0;
  max-width: 620px;

  b {
    background: ${tk.gradients.brand};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Sub = styled.p`
  font-family: ${tk.fonts.body};
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.7;
  color: ${tk.colors.textSecondary};
  margin: 20px 0 0;
  max-width: 560px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
`;

const Primary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 26px;
  border: none;
  border-radius: ${tk.radius.full};
  background: ${tk.gradients.brand};
  color: #06121f;
  font-family: ${tk.fonts.heading};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${tk.shadows.glow};
  transition: transform 0.2s ${tk.easing}, box-shadow 0.2s ${tk.easing};

  &:hover { transform: translateY(-2px); box-shadow: ${tk.shadows.glowStrong}; }
`;

const Ghost = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: ${tk.radius.full};
  border: 1px solid ${tk.colors.border};
  background: rgba(255, 255, 255, 0.05);
  color: ${tk.colors.textPrimary};
  font-family: ${tk.fonts.heading};
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  backdrop-filter: blur(4px);
  transition: border-color 0.2s ${tk.easing}, background 0.2s ${tk.easing};

  &:hover { border-color: ${tk.colors.borderActive}; background: rgba(84, 218, 137, 0.08); }
`;

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 32px;
`;

const Badge = styled.span`
  font-family: ${tk.fonts.body};
  font-size: 12.5px;
  font-weight: 600;
  color: ${tk.colors.textSecondary};
  padding: 6px 13px;
  border-radius: 999px;
  border: 1px solid ${tk.colors.border};
  background: rgba(255, 255, 255, 0.03);
`;

// ── Dashboard card ──
const Dash = styled(motion.div)`
  position: relative;
  background: ${tk.colors.bgCard};
  backdrop-filter: blur(16px);
  border: 1px solid ${tk.colors.border};
  border-radius: 22px;
  padding: 26px;
  box-shadow: ${tk.shadows.card};

  &::before {
    content: '';
    position: absolute; inset: 0; border-radius: inherit; padding: 1px;
    background: ${tk.gradients.brandSoft};
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
  }
`;

const DashTitle = styled.p`
  font-family: ${tk.fonts.heading};
  font-size: 13px;
  font-weight: 700;
  color: ${tk.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 18px;
`;

const Kpis = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 22px;
`;

const Kpi = styled.div`
  text-align: center;
  padding: 14px 6px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${tk.colors.border};

  strong {
    display: block;
    font-family: ${tk.fonts.heading};
    font-size: clamp(20px, 2.4vw, 26px);
    font-weight: 800;
    background: ${tk.gradients.brand};
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  span {
    display: block;
    font-family: ${tk.fonts.body};
    font-size: 11.5px;
    color: ${tk.colors.textMuted};
    margin-top: 4px;
  }
`;

const Bars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const grow = (w: number) => keyframes`
  from { width: 0; }
  to { width: ${w}%; }
`;

const BarRow = styled.div`
  font-family: ${tk.fonts.body};
`;

const BarTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  font-size: 12.5px;
  color: ${tk.colors.textSecondary};
  margin-bottom: 7px;

  em { font-style: normal; color: ${tk.colors.primary}; font-weight: 600; font-size: 11.5px; }
`;

const BarTrack = styled.div`
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
`;

const BarFill = styled.div<{ w: number }>`
  height: 100%;
  border-radius: 999px;
  background: ${tk.gradients.brand};
  width: ${({ w }) => w}%;
  animation: ${({ w }) => grow(w)} 1.3s ${tk.easing} both;
`;

export function HeroSection() {
  const { copy } = usePortal();
  const { openTypebot } = useTypebot();
  const h = copy.hero;

  return (
    <HeroSection_ as="section">
      <Glow y="-20%" x="20%" />
      <Inner>
        <Grid>
          <div>
            <Eyebrow>{h.eyebrow}</Eyebrow>
            <Title>{h.title}</Title>
            <Sub>{h.subtitle}</Sub>
            <Actions>
              <Primary type="button" onClick={openTypebot}>
                {h.ctaPrimary}
              </Primary>
              <Ghost href="#roi">{h.ctaSecondary} →</Ghost>
            </Actions>
            <Badges>
              {h.badges.map((b) => <Badge key={b}>{b}</Badge>)}
            </Badges>
          </div>

          <Dash
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          >
            <DashTitle>{h.dashTitle}</DashTitle>
            <Kpis>
              {h.kpis.map((k) => (
                <Kpi key={k.label}>
                  <strong>{k.value}</strong>
                  <span>{k.label}</span>
                </Kpi>
              ))}
            </Kpis>
            <Bars>
              {h.bars.map((bar) => (
                <BarRow key={bar.label}>
                  <BarTop>
                    <span>{bar.label}</span>
                    <em>{bar.value}% · {bar.tag}</em>
                  </BarTop>
                  <BarTrack><BarFill w={bar.value} /></BarTrack>
                </BarRow>
              ))}
            </Bars>
          </Dash>
        </Grid>
      </Inner>
    </HeroSection_>
  );
}
