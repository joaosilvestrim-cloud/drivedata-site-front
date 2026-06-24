'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { SectionReveal } from '../components/SectionReveal';
import { daltTheme } from '../theme';

const Section = styled.section`
  id: contato;
  padding: 8rem 1.5rem 4rem;
  background: ${daltTheme.colors.bg};
  position: relative;
  overflow: hidden;
`;

const GlowOrb = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${daltTheme.colors.primaryDim} 0%,
    transparent 65%
  );
  pointer-events: none;
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-family: ${daltTheme.fonts.heading};
  font-size: clamp(1.875rem, 4vw, 3rem);
  font-weight: 800;
  color: ${daltTheme.colors.textPrimary};
  line-height: 1.15;
  margin-bottom: 1.25rem;
`;

const GradientSpan = styled.span`
  background: ${daltTheme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-family: ${daltTheme.fonts.body};
  font-size: 1.0625rem;
  color: ${daltTheme.colors.textSecondary};
  margin-bottom: 3rem;
  line-height: 1.7;
`;

const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.125rem 2.75rem;
  background: ${daltTheme.colors.primary};
  color: #05050a;
  font-family: ${daltTheme.fonts.heading};
  font-weight: 700;
  font-size: 0.9375rem;
  letter-spacing: 0.04em;
  border-radius: ${daltTheme.radius.full};
  border: none;
  cursor: pointer;
  box-shadow: ${daltTheme.shadows.glowPrimary};
  transition: opacity 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    opacity: 0.88;
    box-shadow: ${daltTheme.shadows.glowPrimaryStrong};
  }

  svg {
    flex-shrink: 0;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${daltTheme.colors.border};
  margin: 5rem 0 2.5rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  max-width: 900px;
  margin: 0 auto;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const BrandName = styled.span`
  font-family: ${daltTheme.fonts.heading};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: ${daltTheme.colors.textMuted};
  text-transform: uppercase;
`;

const Copyright = styled.span`
  font-family: ${daltTheme.fonts.body};
  font-size: 0.75rem;
  color: ${daltTheme.colors.textMuted};
`;

export function CtaSection() {
  const { openTypebot } = useTypebot();

  return (
    <Section id="contato">
      <GlowOrb />
      <Inner>
        <SectionReveal>
          <Title>
            Pronto para transformar gargalos em{' '}
            <GradientSpan>eficiência e ROI</GradientSpan>?
          </Title>
          <Subtitle>
            Converse com nossos especialistas e descubra como escalar sua operação de dados.
          </Subtitle>
        </SectionReveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
        >
          <CtaButton type="button" onClick={openTypebot}>
            Agendar Reunião de Viabilidade
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
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
      </Inner>

      <Divider />

      <Footer>
        <BrandName>Dalt DriveData</BrandName>
        <Copyright>© {new Date().getFullYear()} Dalt DriveData. Todos os direitos reservados.</Copyright>
      </Footer>
    </Section>
  );
}
