'use client';

import { usePathname } from 'next/navigation';
import {
  HeaderContainer,
  HeaderContent,
  LogoContainer,
  LogoImage,
  Navigation,
  NavLink,
} from './styles';
import { LegalHeaderProps, NavigationItem } from './types';

const navigationItems: NavigationItem[] = [
  { href: '/tambasa/privacy-policy', label: 'Política de Privacidade' },
  { href: '/tambasa/terms-of-use', label: 'Termos de Uso' },
  { href: '/tambasa/data-deletion', label: 'Exclusão de Dados' },
  { href: '/tambasa/support', label: 'Suporte' },
];

export const LegalHeader = ({ className }: LegalHeaderProps) => {
  const pathname = usePathname();

  return (
    <HeaderContainer className={className}>
      <HeaderContent>
        <LogoContainer>
          <LogoImage src="/logotipo-drivedata.png" alt="DriveData" />
        </LogoContainer>

        <Navigation>
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              isActive={pathname === item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};
