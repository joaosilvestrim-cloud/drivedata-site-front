'use client';

import styled from '@emotion/styled';
import { daltTheme } from './theme';
import { HeroSection } from './sections/HeroSection';
import { ClientsSection } from './sections/ClientsSection';
import { InnovationSection } from './sections/InnovationSection';
import { ForYouSection } from './sections/ForYouSection';
import { ServicesSection } from './sections/ServicesSection';
import { CtaSection } from './sections/CtaSection';

const Wrapper = styled.main`
  background: ${daltTheme.colors.bg};
  min-height: 100vh;
  overflow-x: hidden;
  font-family: ${daltTheme.fonts.body};
  color: ${daltTheme.colors.textPrimary};

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Custom scrollbar to match the dark premium aesthetic */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: ${daltTheme.colors.bg};
  }
  ::-webkit-scrollbar-thumb {
    background: ${daltTheme.colors.border};
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 229, 160, 0.25);
  }
`;

export function DaltLanding() {
  return (
    <Wrapper>
      <HeroSection />
      <ClientsSection />
      <InnovationSection />
      <ForYouSection />
      <ServicesSection />
      <CtaSection />
    </Wrapper>
  );
}
