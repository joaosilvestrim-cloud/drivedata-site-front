import styled from '@emotion/styled';
import { theme } from '../../theme';

export const HeaderContainer = styled.header`
  position: fixed;
  top: 34px;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out;

  &[data-mounted='true'] {
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    top: 16px;
  }
`;

export const HeaderContent = styled.div`
  width: 100%;
  height: 70px;
  background: linear-gradient(
    135deg,
    rgba(4, 5, 9, 0.14) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 80px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${theme.breakpoints.lg}) {
    height: 60px;
    padding: 12px 16px;
    border-radius: 40px;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const LogoImage = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${theme.breakpoints.lg}) {
    height: 32px;
  }
`;

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

export const NavLink = styled.a<{ isActive?: boolean }>`
  color: ${(props) => (props.isActive ? '#54DA89' : 'white')};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.base[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #54da89;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const LanguageSelectorWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

export const LanguageSelector = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border: none;
  color: inherit;
  font: inherit;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const LanguageDropdown = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  margin: 0;
  padding: 8px 0;
  list-style: none;
  background: rgba(15, 20, 30, 0.95);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: ${theme.zIndex.dropdown};
`;

export const LanguageDropdownItem = styled.li<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  color: white;
  font-size: ${theme.typography.fontSize.sm[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  background: ${(props) =>
    props.isActive ? 'rgba(84, 218, 137, 0.18)' : 'transparent'};
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    background: rgba(84, 218, 137, 0.12);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const FlagIcon = styled.span`
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const LanguageText = styled.span`
  color: white;
  font-size: ${theme.typography.fontSize.sm[0]};
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const ChevronIcon = styled.div<{ isOpen?: boolean }>`
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid white;
  transition: transform 0.2s ease-in-out;
  transform: rotate(${(props) => (props.isOpen ? '180deg' : '0deg')});
`;

export const MobileMenuButton = styled.button<{ isOpen?: boolean }>`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  z-index: ${theme.zIndex.modal + 1};

  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
  }
`;

export const MobileMenuIcon = styled.div<{ isOpen?: boolean }>`
  width: 24px;
  height: 2px;
  background: ${(props) => (props.isOpen ? 'transparent' : 'white')};
  position: relative;
  transition: background 0.3s ease-in-out;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: white;
    transition: all 0.3s ease-in-out;
  }

  &::before {
    top: ${(props) => (props.isOpen ? '0' : '-8px')};
    transform: ${(props) => (props.isOpen ? 'rotate(45deg)' : 'rotate(0)')};
  }

  &::after {
    top: ${(props) => (props.isOpen ? '0' : '8px')};
    transform: ${(props) => (props.isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
  }
`;

export const MobileMenuBackdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: ${theme.zIndex.modal - 1};
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

  @media (min-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

export const MobileMenu = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(15, 20, 30, 0.98) 0%,
    rgba(10, 15, 25, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 100px 24px 24px;
  z-index: ${theme.zIndex.modal};
  transform: ${(props) =>
    props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease-in-out;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

export const MobileNavLink = styled.a<{ isActive?: boolean }>`
  color: ${(props) => (props.isActive ? '#54DA89' : 'white')};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.lg[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  padding: 16px;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
  background: ${(props) =>
    props.isActive ? 'rgba(84, 218, 137, 0.1)' : 'transparent'};

  &:hover {
    color: #54da89;
    background: rgba(84, 218, 137, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ContactButtonWrapper = styled.div`
  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

export const MobileLanguageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const MobileLanguageToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  color: white;
  font-size: ${theme.typography.fontSize.base[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  background: rgba(255, 255, 255, 0.06);
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const MobileLanguageToggleContent = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MobileLanguageList = styled.ul<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const MobileLanguageOption = styled.li<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  color: ${(props) => (props.isActive ? '#54DA89' : 'white')};
  font-size: ${theme.typography.fontSize.base[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  background: ${(props) =>
    props.isActive ? 'rgba(84, 218, 137, 0.1)' : 'transparent'};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #54da89;
    background: rgba(84, 218, 137, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const MobileMenuContactButton = styled.div`
  margin-top: 24px;
  width: 100%;

  button {
    width: 100%;
  }
`;
