import styled from '@emotion/styled';
import { theme } from '../../theme';

export const AcademySectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['2xl']} 0;
  background-color: #000000;
`;

export const AcademyCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.xl};
  border-radius: 24px;
  padding: ${theme.spacing['2xl']};
  background: linear-gradient(120deg, rgba(84, 218, 137, 0.12), rgba(10, 150, 236, 0.12));
  border: 1px solid rgba(84, 218, 137, 0.35);
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    padding: ${theme.spacing.xl};
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
  font-size: 32px;
  line-height: 1.25;
  margin: 0;
  color: #ffffff;
  font-weight: ${theme.typography.fontWeight.semibold};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 26px;
  }
`;

export const AcademyDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #b0b0b0;
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
