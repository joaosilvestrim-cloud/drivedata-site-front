'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { portalTheme as tk } from './theme';
import { usePortal } from './usePortal';
import { HeroSection } from './sections/HeroSection';
import { PillarsSection } from './sections/PillarsSection';
import { HowSection } from './sections/HowSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { RoiSection } from './sections/RoiSection';
import { ComparisonSection } from './sections/ComparisonSection';
import { ProofSection } from './sections/ProofSection';
import { CtaSection } from './sections/CtaSection';

const Wrapper = styled.main`
  background: ${tk.colors.bg};
  min-height: 100vh;
  overflow-x: hidden;
  font-family: ${tk.fonts.body};
  color: ${tk.colors.textPrimary};

  *, *::before, *::after { box-sizing: border-box; }

  ::-webkit-scrollbar { width: 7px; }
  ::-webkit-scrollbar-track { background: ${tk.colors.bg}; }
  ::-webkit-scrollbar-thumb { background: ${tk.colors.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${tk.colors.borderActive}; }
`;

const Nav = styled.header`
  position: sticky;
  top: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 32px;
  background: rgba(7, 12, 22, 0.82);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid ${tk.colors.border};

  @media (max-width: 640px) { padding: 12px 18px; }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;

  img { height: 26px; width: auto; }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 26px;

  @media (max-width: 900px) { display: none; }
`;

const NavLink = styled.a`
  font-family: ${tk.fonts.body};
  font-size: 14px;
  font-weight: 600;
  color: ${tk.colors.textSecondary};
  text-decoration: none;
  transition: color 0.18s ease;

  &:hover { color: ${tk.colors.primary}; }
`;

const NavCta = styled.button`
  flex-shrink: 0;
  padding: 10px 20px;
  border: none;
  border-radius: 999px;
  background: ${tk.gradients.brand};
  color: #06121f;
  font-family: ${tk.fonts.heading};
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover { transform: translateY(-1px); box-shadow: ${tk.shadows.glow}; }
`;

const Foot = styled.footer`
  border-top: 1px solid ${tk.colors.border};
  padding: 34px 32px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: ${tk.colors.bg};

  span {
    font-family: ${tk.fonts.body};
    font-size: 12.5px;
    color: ${tk.colors.textMuted};
  }
  a { color: ${tk.colors.textSecondary}; text-decoration: none; }
  a:hover { color: ${tk.colors.primary}; }
`;

export function PortalFabricLanding() {
  const { copy } = usePortal();
  const { openTypebot } = useTypebot();
  const year = new Date().getFullYear();

  return (
    <Wrapper>
      <Nav>
        <Brand href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logotipo-drivedata.png" alt="DriveData" />
        </Brand>
        <NavLinks>
          {copy.nav.map((n) => (
            <NavLink key={n.href} href={n.href}>{n.label}</NavLink>
          ))}
        </NavLinks>
        <NavCta type="button" onClick={openTypebot}>{copy.hero.ctaPrimary}</NavCta>
      </Nav>

      <HeroSection />
      <PillarsSection />
      <HowSection />
      <ArchitectureSection />
      <FeaturesSection />
      <RoiSection />
      <ComparisonSection />
      <ProofSection />
      <CtaSection />

      <Foot>
        <span>{copy.footer.tagline}</span>
        <span>
          <a href="mailto:contato@drivedata.com.br">contato@drivedata.com.br</a> · © {year} DriveData. {copy.footer.rights}
        </span>
      </Foot>
    </Wrapper>
  );
}
