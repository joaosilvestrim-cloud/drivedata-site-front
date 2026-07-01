import styled from '@emotion/styled';
import { theme } from '../../theme';

export const ContactSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['2xl']} 0;
  background: transparent;
  position: relative;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} 0 ${theme.spacing['2xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} 0;
  }
`;

export const ContactSectionContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['4xl']};
  align-items: start;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['3xl']};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing['2xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xl};
  }
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

export const ContactTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -0.6px;
  font-size: 48px;
  line-height: 1.2;
  font-weight: ${theme.typography.fontWeight.bold};
  background: linear-gradient(156.28deg, #54DA89 16.11%, #0A96EC 100.01%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const ContactDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: white;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 16px;
    line-height: 1.5;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 1.4;
  }
`;

export const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing.lg};
    margin-top: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.md};
  }
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

export const ContactIcon = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  svg path,
  svg circle,
  svg line,
  svg polyline,
  svg rect {
    stroke: url(#contactGradient);
  }
`;

export const ContactText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: white;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 15px;
    line-height: 1.5;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 1.4;
  }
`;

export const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: #8AFFF5;
  font-family: 'Inter', sans-serif;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 13px;
  }
`;

export const FormInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: 16px;
  color: white;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: #8AFFF5;
    background: rgba(255, 255, 255, 0.08);
  }

  &:hover {
    border-color: rgba(138, 255, 245, 0.3);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: 14px;
  }
`;

export const FormTextarea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 16px;
  border-radius: 8px;
  color: white;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: #8AFFF5;
    background: rgba(255, 255, 255, 0.08);
  }

  &:hover {
    border-color: rgba(138, 255, 245, 0.3);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: 14px;
    min-height: 100px;
  }
`;

export const FormButton = styled.button`
  background: linear-gradient(153.42deg, #54DA89 30.36%, #0A96EC 132.34%);
  border: none;
  border-radius: 8px;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: 16px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: #0A0A0F;
  font-family: 'Satoshi', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: ${theme.spacing.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 24px rgba(84, 218, 137, 0.3);
  }

  &:active {
    transform: translateY(0px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 15px;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    width: 100%;
  }
`;

export const FormError = styled.span`
  font-size: 12px;
  color: #FF6B6B;
  font-family: 'Inter', sans-serif;
  margin-top: ${theme.spacing.xs};
`;

export const FormGlobalError = styled.div`
  background: rgba(255, 107, 107, 0.08);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: ${theme.spacing.md};
  color: #FF6B6B;
  font-size: 14px;
  text-align: center;
  font-family: 'Inter', sans-serif;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
    font-size: 13px;
  }
`;

export const FormSuccess = styled.div`
  background: rgba(84, 218, 137, 0.1);
  border: 1px solid rgba(84, 218, 137, 0.3);
  border-radius: 8px;
  padding: ${theme.spacing.md};
  color: #54DA89;
  font-size: 14px;
  text-align: center;
  font-family: 'Inter', sans-serif;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
    font-size: 13px;
  }
`;

