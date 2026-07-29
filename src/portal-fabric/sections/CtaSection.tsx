'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow } from '../components/primitives';
import { usePortal } from '../usePortal';

const Wrap = styled(Inner)`
  max-width: 760px;
  text-align: center;
`;

const Title = styled.h2`
  font-family: ${tk.fonts.heading};
  font-size: clamp(28px, 3.8vw, 46px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.8px;
  color: ${tk.colors.textPrimary};
`;

const Sub = styled.p`
  font-family: ${tk.fonts.body};
  font-size: clamp(15px, 1.5vw, 17px);
  line-height: 1.7;
  color: ${tk.colors.textSecondary};
  margin: 18px auto 34px;
  max-width: 600px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
`;

const Primary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  border: none;
  border-radius: ${tk.radius.full};
  background: ${tk.gradients.brand};
  color: ${tk.colors.onBrand};
  font-family: ${tk.fonts.heading};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${tk.shadows.glow};
  transition: transform 0.2s ${tk.easing}, box-shadow 0.2s ${tk.easing};

  &:hover { transform: translateY(-2px); box-shadow: ${tk.shadows.glowStrong}; }
`;

const Ghost = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 28px;
  border-radius: ${tk.radius.full};
  border: 1px solid ${tk.colors.border};
  background: ${tk.colors.surfaceStrong};
  color: ${tk.colors.textPrimary};
  font-family: ${tk.fonts.heading};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ${tk.easing}, background 0.2s ${tk.easing};

  &:hover { border-color: ${tk.colors.borderActive}; background: rgba(84, 218, 137, 0.08); }
`;

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
`;

const Badge = styled.span`
  font-family: ${tk.fonts.body};
  font-size: 12.5px;
  font-weight: 600;
  color: ${tk.colors.textSecondary};
  padding: 7px 15px;
  border-radius: 999px;
  border: 1px solid ${tk.colors.border};
  background: ${tk.colors.surfaceSubtle};
`;

export function CtaSection() {
  const { copy } = usePortal();
  const { openTypebot } = useTypebot();
  const c = copy.cta;

  return (
    <Section id="cta">
      <Glow y="0%" x="50%" color="rgba(84,218,137,0.16)" />
      <Wrap>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
        >
          <Title>{c.title}</Title>
          <Sub>{c.subtitle}</Sub>
          <Actions>
            <Primary type="button" onClick={openTypebot}>{c.ctaPrimary}</Primary>
            <Ghost type="button" onClick={openTypebot}>{c.ctaSecondary}</Ghost>
          </Actions>
          <Badges>
            {c.badges.map((b) => <Badge key={b}>{b}</Badge>)}
          </Badges>
        </motion.div>
      </Wrap>
    </Section>
  );
}
