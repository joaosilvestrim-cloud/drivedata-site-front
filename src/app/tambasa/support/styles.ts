import styled from '@emotion/styled';
import { theme } from '@/common/theme';

export const PageContainer = styled.section`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    #0a0e1a 0%,
    #0f1419 50%,
    #0a0e1a 100%
  );
  padding: ${theme.spacing['4xl']} 0;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} 0;
  }
`;

export const PageContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md};
  }
`;

export const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize['4xl'][0]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: #0dd0d0;
  margin-bottom: ${theme.spacing.sm};
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl'][0]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize['2xl'][0]};
  }
`;

export const PageSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.sm[0]};
  color: #c4c4c4;
  margin-bottom: ${theme.spacing['2xl']};
  line-height: 1.6;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: ${theme.spacing['2xl']} 0;
`;

export const Section = styled.div`
  margin-bottom: ${theme.spacing['3xl']};

  @media (max-width: ${theme.breakpoints.md}) {
    margin-bottom: ${theme.spacing['2xl']};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl'][0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: #0dd0d0;
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.xl[0]};
  }
`;

export const Paragraph = styled.p`
  font-size: ${theme.typography.fontSize.base[0]};
  line-height: 1.7;
  color: #c4c4c4;
  margin-bottom: ${theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.sm[0]};
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  max-width: 640px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const Label = styled.label`
  font-size: ${theme.typography.fontSize.sm[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  color: #e0e0e0;
`;

const inputBase = `
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: ${theme.borderRadius.md};
  color: #ffffff;
  font-size: ${theme.typography.fontSize.base[0]};
  padding: ${theme.spacing.md};
  transition: border-color 0.2s ease-in-out, background 0.2s ease-in-out;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: #666;
  }

  &:focus {
    border-color: #0dd0d0;
    background: rgba(13, 208, 208, 0.05);
  }
`;

export const Input = styled.input`
  ${inputBase}
`;

export const Textarea = styled.textarea`
  ${inputBase}
  resize: vertical;
  min-height: 140px;
  font-family: inherit;
  line-height: 1.6;
`;

export const SubmitButton = styled.button<{ isLoading?: boolean }>`
  background: #0dd0d0;
  color: #0a0e1a;
  font-size: ${theme.typography.fontSize.base[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing['2xl']};
  cursor: ${({ isLoading }) => (isLoading ? 'not-allowed' : 'pointer')};
  opacity: ${({ isLoading }) => (isLoading ? 0.7 : 1)};
  transition: background 0.2s ease-in-out, opacity 0.2s ease-in-out;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background: #1fe5e5;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const SuccessMessage = styled.div`
  background: rgba(13, 208, 208, 0.1);
  border: 1px solid rgba(13, 208, 208, 0.4);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  color: #0dd0d0;
  font-size: ${theme.typography.fontSize.base[0]};
  line-height: 1.6;
  text-align: center;

  strong {
    display: block;
    font-size: ${theme.typography.fontSize.lg[0]};
    margin-bottom: ${theme.spacing.sm};
  }
`;

export const InfoBox = styled.div`
  background: rgba(13, 208, 208, 0.08);
  border-left: 4px solid #0dd0d0;
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};

  ${Paragraph} {
    margin-bottom: 0;
    color: #e0e0e0;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md};
  }
`;
