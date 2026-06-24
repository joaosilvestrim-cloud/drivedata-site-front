import styled from '@emotion/styled';
import { theme } from '../../theme';

export const TypebotModalBackdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
  max-width: 800px;
  height: 90vh;
  max-height: 800px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transform: ${(props) =>
    props.isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)'};
  transition: transform 0.3s ease-in-out;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const TypebotModalCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
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
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
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

