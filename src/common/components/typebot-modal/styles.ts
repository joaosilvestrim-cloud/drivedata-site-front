import styled from '@emotion/styled';
import { theme } from '../../theme';

export const TypebotModalBackdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(7, 12, 22, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: ${theme.zIndex.modal};
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const TypebotModalContainer = styled.div<{ isOpen: boolean }>`
  width: 100%;
  max-width: 560px;
  height: 90vh;
  max-height: 720px;
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(7, 12, 22, 0.28);
  html[data-site-theme='dark'] & { background: #0d192c; box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5); }
  @media (max-width: 560px) { height: 100%; max-height: none; border-radius: 22px; }
  transform: ${(props) =>
    props.isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)'};
  transition: transform 0.3s ease-in-out;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const TypebotModalCloseButton = styled.button`
  position: absolute;
  top: 21px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(234, 240, 251, 0.12);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  line-height: 1;
  z-index: 10;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    background: rgba(234, 240, 251, 0.22);
  }

  &:focus-visible {
    outline: 3px solid rgba(84, 218, 137, 0.6);
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const TypebotWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

