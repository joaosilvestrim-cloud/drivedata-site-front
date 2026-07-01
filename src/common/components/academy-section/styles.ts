import styled from '@emotion/styled';
import { theme } from '../../theme';

export const AcademySectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['2xl']} 0;
  position: relative;
`;

export const AcademyCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.xl};
  border-radius: 24px;
  padding: ${theme.spacing['2xl']};
  background:
    radial-gradient(600px 240px at 12% 0%, rgba(84, 218, 137, 0.16), transparent 70%),
    radial-gradient(600px 240px at 100% 120%, rgba(10, 150, 236, 0.16), transparent 70%),
    rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(14px);
  clip-path: polygon(0 0, 94% 0, 100% 22%, 100% 100%, 0 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    clip-path: polygon(0 0, 94% 0, 100% 22%, 100% 100%, 0 100%);
    background: linear-gradient(130deg, rgba(84, 218, 137, 0.55), transparent 44%, rgba(10, 150, 236, 0.5));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    padding: ${theme.spacing.xl};
    clip-path: none;
    &::before {
      clip-path: none;
    }
  }
`;

export const AcademyText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 640px;
`;

export const AcademyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: #54da89;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const AcademyTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: -0.6px;
  margin: 0;
  color: #ffffff;
  font-weight: 800;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 26px;
  }
`;

export const AcademyDescription = styled.p`
  font-size: 17px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.7);
  margin: 0;
`;

export const AcademyButton = styled.a`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(120deg, #54da89, #0a96ec);
  color: #04121f;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: 16px;
  text-decoration: none;
  padding: 16px 28px;
  border-radius: 9999px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 8px 30px rgba(10, 150, 236, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(10, 150, 236, 0.4);
  }
`;
