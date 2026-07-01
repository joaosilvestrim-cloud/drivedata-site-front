import styled from '@emotion/styled';
import { theme } from '../../theme';

export const IntegrationsSectionContainer = styled.section`
  width: 100%;
  background: transparent;
  padding: ${theme.spacing['4xl']} 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(10, 150, 236, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }
`;

export const IntegrationsSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing['3xl']};
  position: relative;
  z-index: 1;
`;

export const IntegrationsHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  max-width: 900px;
  margin: 0 auto;
`;

export const IntegrationsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -0.6px;
  font-size: 48px;
  line-height: 1.2;
  font-weight: ${theme.typography.fontWeight.bold};
  color: #FFFFFF;
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const IntegrationsTitleHighlight = styled.span`
  color: #0A96EC;
`;

export const IntegrationsDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.66);
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const IntegrationsImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  img {
    width: 100%;
    height: auto;
    border-radius: ${theme.borderRadius['2xl']};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md};
  }
`;

