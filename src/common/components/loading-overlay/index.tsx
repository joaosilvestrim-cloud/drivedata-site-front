'use client';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(6, 11, 22, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: ${fadeIn} 0.2s ease-in;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(84, 218, 137, 0.15);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  if (!isLoading) {
    return null;
  }

  return (
    <Overlay>
      <Spinner />
    </Overlay>
  );
};
