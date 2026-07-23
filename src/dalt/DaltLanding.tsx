'use client';

import { useTranslation } from 'react-i18next';

import styled from '@emotion/styled';
import Link from 'next/link';
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

const DaltNav = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 32px;
  background: rgba(6, 11, 13, 0.72);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${daltTheme.colors.border};

  @media (max-width: 640px) {
    padding: 12px 18px;
  }
`;

const DaltBrand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${daltTheme.fonts.body};
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.3px;
  color: ${daltTheme.colors.textPrimary};
  text-decoration: none;

  img {
    height: 26px;
    width: auto;
  }
`;

const DaltBack = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${daltTheme.fonts.body};
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid ${daltTheme.colors.border};
  border-radius: 999px;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    color: #00e5a0;
    border-color: rgba(0, 229, 160, 0.5);
    background: rgba(0, 229, 160, 0.06);
  }
`;

export function DaltLanding() {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <DaltNav>
        <DaltBrand href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/drive-data-icon.png" alt="DriveData" />
          DriveData
        </DaltBrand>
        <DaltBack href="/">{t('dalt.back')}</DaltBack>
      </DaltNav>
      <HeroSection />
      <ClientsSection />
      <InnovationSection />
      <ForYouSection />
      <ServicesSection />
      <CtaSection />
    </Wrapper>
  );
}
