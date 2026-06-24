'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { ParticleParallax } from '../fx/ParticleParallax';
import { daltTheme } from '../theme';
import { heroServices } from '../content';

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 1.5rem;
  background: ${daltTheme.colors.bg};
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${daltTheme.gradients.heroBg};
  z-index: 1;
  pointer-events: none;
`;

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.03;
  background-image:
    linear-gradient(rgba(0, 229, 160, 1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 160, 1) 1px, transparent 1px);
  background-size: 64px 64px;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const Eyebrow = styled.p`
  font-family: ${daltTheme.fonts.heading};
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${daltTheme.colors.primary};
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Headline = styled.h1`
  font-family: ${daltTheme.fonts.heading};
  font-size: clamp(2.25rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: ${daltTheme.colors.textPrimary};
  margin-bottom: 1rem;
`;

const GradientSpan = styled.span`
  background: ${daltTheme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.625rem;
  margin-top: 2.5rem;
`;

const Pill = styled.span`
  padding: 0.5rem 1.25rem;
  border-radius: ${daltTheme.radius.full};
  border: 1px solid ${daltTheme.colors.border};
  font-size: 0.8125rem;
  color: ${daltTheme.colors.textSecondary};
  font-family: ${daltTheme.fonts.body};
  cursor: default;
  transition: border-color 0.3s ease, color 0.3s ease;

  &:hover {
    border-color: ${daltTheme.colors.borderActive};
    color: ${daltTheme.colors.textPrimary};
  }
`;

const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2.25rem;
  background: ${daltTheme.colors.primary};
  color: #05050a;
  font-family: ${daltTheme.fonts.heading};
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  border-radius: ${daltTheme.radius.full};
  border: none;
  cursor: pointer;
  box-shadow: ${daltTheme.shadows.glowPrimary};
  transition: opacity 0.25s ease, box-shadow 0.25s ease;
  margin-top: 3.5rem;

  &:hover {
    opacity: 0.88;
    box-shadow: ${daltTheme.shadows.glowPrimaryStrong};
  }

  svg {
    flex-shrink: 0;
  }
`;

const BottomLine = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${daltTheme.colors.primary} 30%,
    ${daltTheme.colors.accent} 70%,
    transparent 100%
  );
  z-index: 2;
`;

export function HeroSection() {
  const { openTypebot } = useTypebot();

  return (
    <Section>
      <ParticleParallax />
      <GridPattern />
      <Overlay />

      <Content>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Eyebrow>Dalt DriveData</Eyebrow>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
        >
          <Headline>
            Transformando desafios complexos em{' '}
            <GradientSpan>eficiência e resultados</GradientSpan>{' '}
            tangíveis
          </Headline>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
        >
          <Pills>
            {heroServices.map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </Pills>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <CtaButton type="button" onClick={openTypebot}>
            Fale com um especialista
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </CtaButton>
        </motion.div>
      </Content>

      <BottomLine />
    </Section>
  );
}
