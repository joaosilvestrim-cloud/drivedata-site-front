'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { portalTheme as tk } from '../theme';

// ── Section wrapper com glow de foco ──
export const Section = styled.section`
  position: relative;
  padding: 120px 24px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 84px 20px;
  }
`;

export const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Glow = styled.div<{ x?: string; y?: string; color?: string }>`
  position: absolute;
  top: ${({ y }) => y ?? '-10%'};
  left: ${({ x }) => x ?? '50%'};
  transform: translateX(-50%);
  width: 620px;
  height: 620px;
  border-radius: 50%;
  background: radial-gradient(circle, ${({ color }) => color ?? 'rgba(10,150,236,0.14)'} 0%, transparent 62%);
  filter: blur(24px);
  pointer-events: none;
  z-index: 0;
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${tk.colors.primaryDim};
  border: 1px solid ${tk.colors.borderActive};
  color: ${tk.colors.primary};
  font-family: ${tk.fonts.body};
  font-size: 13px;
  font-weight: 600;
  padding: 7px 15px;
  border-radius: 999px;
  backdrop-filter: blur(6px);

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${tk.colors.primary};
    box-shadow: 0 0 10px ${tk.colors.primary};
  }
`;

export const SectionTitle = styled.h2`
  font-family: ${tk.fonts.heading};
  font-size: clamp(28px, 3.4vw, 44px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.8px;
  color: ${tk.colors.textPrimary};
  margin: 18px 0 0;

  b {
    background: ${tk.gradients.brand};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
  }
`;

export const Subtitle = styled.p`
  font-family: ${tk.fonts.body};
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.7;
  color: ${tk.colors.textSecondary};
  max-width: 720px;
  margin: 16px 0 0;
`;

export const HeadCentered = styled.div`
  text-align: center;
  max-width: 760px;
  margin: 0 auto 56px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${Subtitle} {
    margin-left: auto;
    margin-right: auto;
  }
`;

// ── Card de vidro com anel de gradiente ──
export const Card = styled.div`
  position: relative;
  background: ${tk.colors.bgCard};
  backdrop-filter: blur(14px);
  border: 1px solid ${tk.colors.border};
  border-radius: ${tk.radius.lg};
  padding: 28px;
  box-shadow: ${tk.shadows.card};
  transition: transform 0.3s ${tk.easing}, border-color 0.3s ${tk.easing};

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
    opacity: 0;
    transition: opacity 0.3s ${tk.easing};
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: ${tk.colors.borderActive};

    &::before {
      opacity: 1;
    }
  }
`;

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
