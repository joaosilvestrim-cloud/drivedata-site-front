'use client';

import styled from '@emotion/styled';
import { Header } from '@/common/components/header';
import { useScopedTheme } from '@/common/theme/useThemeMode';
import { portalTheme as tk } from './theme';
import { usePortal } from './usePortal';
import { HeroSection } from './sections/HeroSection';
import { VideoSection } from './sections/VideoSection';
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

export function PortalFabricLanding({ videoUrl }: { videoUrl?: string | null }) {
  const { copy } = usePortal();
  const year = new Date().getFullYear();

  // Tema claro vale só enquanto esta rota estiver aberta — ao sair, volta ao
  // escuro, que é o padrão das páginas ainda não migradas.
  useScopedTheme();

  return (
    <Wrapper>
      {/* Cabeçalho padrão do site (pílula flutuante, seletor de idioma, contato) */}
      <Header />

      <HeroSection />
      <PillarsSection />
      <HowSection />
      <VideoSection url={videoUrl} />
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
