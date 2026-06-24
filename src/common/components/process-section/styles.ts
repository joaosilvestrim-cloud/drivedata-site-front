import styled from '@emotion/styled';
import { theme } from '../../theme';

export const ProcessSectionContainer = styled.section`
  width: 100%;
  min-height: 700px;
  padding: ${theme.spacing['4xl']} 0;
  background-color: #000000;
  position: relative;
  overflow: visible;

  /* Imagem de fundo */
  &::before {
    content: '';
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/businnes-graph.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }

  /* Overlay escuro - gradiente sutil */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.6) 40%,
      rgba(0, 0, 0, 0.5) 100%
    );
    z-index: 1;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 600px;
    padding: ${theme.spacing['4xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 500px;
    padding: ${theme.spacing['4xl']} 0;
  }
`;

export const ProcessSectionContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xl};
  }
`;

export const ProcessHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  text-align: center;
  max-width: 900px;
`;

export const ProcessTitle = styled.h2`
  background: linear-gradient(
    to bottom,
    #009fff,
    #00b0ff,
    #00c0ff,
    #00cffd,
    #00dcf7,
    #2ce3f4,
    #45eaf1,
    #5bf1ee,
    #68f5f0,
    #74f8f1,
    #7ffcf3,
    #8afff5
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: 40px;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 32px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const ProcessSubtitle = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: #E6E9FA;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};
  max-width: 700px;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 18px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
  width: 100%;
  max-width: 1200px;
  margin-top: ${theme.spacing.xl};
  padding: 0 ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin-top: ${theme.spacing.lg};
    padding: 0 ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.lg};
    padding: 0 ${theme.spacing.sm};
  }
`;

export const ProcessCard = styled.div`
  background: rgba(6, 10, 19, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  text-align: center;
  transition: all 0.3s ease;
  padding-top: ${theme.spacing['2xl']};
  height: 100%;
  justify-content: flex-start;
`;

export const ProcessCardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }

  &:hover ${ProcessCard} {
    border-color: rgba(138, 255, 245, 0.5);
    box-shadow: 0 12px 40px rgba(138, 255, 245, 0.15);
  }
`;


export const StepNumber = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 92px;
  line-height: 1;
  font-weight: ${theme.typography.fontWeight.bold};
  background: linear-gradient(
    to bottom,
    #009fff,
    #00b0ff,
    #00c0ff,
    #00cffd,
    #00dcf7,
    #2ce3f4,
    #45eaf1,
    #5bf1ee,
    #68f5f0,
    #74f8f1,
    #7ffcf3,
    #8afff5
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 64px;
    top: -32px;
  }
`;

export const StepTitle = styled.h3`
  font-size: 20px;
  line-height: 1.3;
  font-weight: ${theme.typography.fontWeight.semibold};
  margin: 0;
  background: linear-gradient(
    to bottom,
    #009fff,
    #00b0ff,
    #00c0ff,
    #00cffd,
    #00dcf7,
    #2ce3f4,
    #45eaf1,
    #5bf1ee,
    #68f5f0,
    #74f8f1,
    #7ffcf3,
    #8afff5
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 18px;
  }
`;

export const StepDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #9CB0C2;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

