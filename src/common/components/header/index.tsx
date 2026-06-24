'use client';

import { Button } from '@/common/components/button';
import { Container } from '@/common/components/container';
import { normalizeLanguageCode } from '@/common/i18n';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronIcon,
  ContactButtonWrapper,
  FlagIcon,
  HeaderActions,
  HeaderContainer,
  HeaderContent,
  LanguageDropdown,
  LanguageDropdownItem,
  LanguageSelector,
  LanguageSelectorWrapper,
  LanguageText,
  Logo,
  LogoImage,
  MobileLanguageList,
  MobileLanguageOption,
  MobileLanguageSection,
  MobileLanguageToggle,
  MobileLanguageToggleContent,
  MobileMenu,
  MobileMenuBackdrop,
  MobileMenuButton,
  MobileMenuContactButton,
  MobileMenuIcon,
  MobileNavLink,
  Navigation,
  NavLink,
} from './styles';
import { HeaderProps, LanguageOption, NavigationItem } from './types';

const languageOptions: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const navigationLinks: NavigationItem[] = [
  { href: '/', labelKey: 'header.navigation.home' },
  { href: '/about', labelKey: 'header.navigation.about' },
  { href: '/about#solucoes', labelKey: 'header.navigation.solutions' },
  { href: '/about#articles', labelKey: 'header.navigation.articles' },
  { href: '/about#clientes', labelKey: 'header.navigation.clients' },
];

const htmlLanguageMap: Record<LanguageOption['code'], string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
};

const findLanguageOptionByLanguage = (language?: string): LanguageOption => {
  const normalizedLanguage = normalizeLanguageCode(language);

  return (
    languageOptions.find((option) => option.code === normalizedLanguage) ??
    languageOptions[0]
  );
};

export const Header = ({ className }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const { openTypebot } = useTypebot();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(() =>
    findLanguageOptionByLanguage(i18n.resolvedLanguage ?? i18n.language),
  );
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileLanguageOpen, setIsMobileLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const languageSelectorRef = useRef<HTMLDivElement | null>(null);
  const [, forceUpdate] = useState(0);

  // Função para obter a URL completa atual (pathname + hash)
  const getCurrentFullPath = useCallback(() => {
    if (typeof window === 'undefined') {
      return pathname;
    }
    return pathname + window.location.hash;
  }, [pathname]);

  // Força re-renderização quando a URL muda (pathname ou hash)
  useEffect(() => {
    const handleHashChange = () => {
      forceUpdate((prev) => prev + 1);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = htmlLanguageMap[currentLanguage.code];
    }
  }, [currentLanguage.code, isMounted]);

  useEffect(() => {
    const handleLanguageChanged = (language: string) => {
      const nextLanguage = findLanguageOptionByLanguage(language);
      setCurrentLanguage(nextLanguage);

      // Garante que o cookie seja salvo com o código base do idioma (ex: 'pt', 'en', 'es', 'fr')
      if (typeof document !== 'undefined') {
        const normalizedLang = normalizeLanguageCode(language);
        document.cookie = `drive-data-lp:selected-language=${normalizedLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      }
    };

    handleLanguageChanged(i18n.resolvedLanguage ?? i18n.language);

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageSelectorRef.current &&
        !languageSelectorRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsMobileLanguageOpen(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const contactButtonLabel = t('header.contactButton');
  const languageSelectorLabel = t('header.languageSelectorLabel');

  const toggleLanguageDropdown = useCallback(() => {
    setIsLanguageDropdownOpen((prevState) => !prevState);
  }, []);

  const handleLanguageChange = useCallback(
    (language: LanguageOption) => {
      setIsLanguageDropdownOpen(false);
      setIsMobileLanguageOpen(false);
      setIsMobileMenuOpen(false);

      if (language.code === currentLanguage.code) {
        return;
      }

      void i18n.changeLanguage(language.code);
    },
    [currentLanguage.code, i18n],
  );

  const toggleMobileLanguage = useCallback(() => {
    setIsMobileLanguageOpen((prevState) => !prevState);
  }, []);

  const handleContactClick = useCallback(() => {
    openTypebot();
    setIsMobileMenuOpen(false);
  }, [openTypebot]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsMobileMenuOpen(false);

      const scrollToElement = (
        elementId: string,
        updateUrl: boolean = true,
        fullPath?: string,
      ) => {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
          // Calcula o offset do header fixo
          const headerOffset = 120;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });

          // Atualiza a URL após um pequeno delay para evitar conflito com o scroll
          if (updateUrl && fullPath) {
            setTimeout(() => {
              window.history.pushState(null, '', fullPath);
              // Dispara evento hashchange manualmente
              window.dispatchEvent(new HashChangeEvent('hashchange'));
            }, 100);
          }
        }
      };

      // Se for um link com âncora (começa com #)
      if (href.startsWith('#')) {
        // Se já estamos na página atual, apenas faz scroll
        const targetId = href.substring(1);
        const fullPath = pathname + href;
        scrollToElement(targetId, true, fullPath);
        return;
      }

      // Se for um link para outra página com âncora (ex: /about#articles)
      const [path, hash] = href.split('#');
      if (hash) {
        if (pathname === path) {
          // Já estamos na página, apenas faz scroll e atualiza URL
          scrollToElement(hash, true, href);
        } else {
          // Navega para a página e depois faz scroll
          router.push(href);
          // O scroll será feito após a navegação através do useEffect
        }
      } else {
        // Link normal sem âncora
        // Se estamos na mesma página, apenas remove o hash se existir
        if (pathname === path) {
          // Remove o hash se existir
          if (window.location.hash) {
            window.history.pushState(null, '', pathname);
            // Dispara evento hashchange manualmente para atualizar o estado
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }
        } else {
          router.push(href);
        }
      }
    },
    [pathname, router],
  );

  // Efeito para fazer scroll quando a página carrega com uma âncora na URL
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          // Calcula o offset do header fixo
          const headerOffset = 120;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    };

    // Aguarda um pouco para garantir que a página foi renderizada
    const timer = setTimeout(scrollToHash, 300);

    // Também tenta quando o window estiver totalmente carregado
    window.addEventListener('load', scrollToHash);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', scrollToHash);
    };
  }, [pathname]);

  // Função helper para determinar se um link está ativo
  const isLinkActive = useCallback(
    (href: string) => {
      // Obtém a URL atual completa
      const currentFullPath = getCurrentFullPath();

      // Se o currentFullPath corresponde exatamente ao href, está ativo
      if (currentFullPath === href) {
        return true;
      }

      // Separa pathname e hash do href
      const [hrefPath, hrefHash] = href.split('#');

      // Separa pathname e hash do currentFullPath
      const [currentPath, currentHash] = currentFullPath.split('#');

      // Se o pathname não corresponde, não está ativo
      if (hrefPath !== currentPath) {
        return false;
      }

      // Se ambos têm hash, compara os hashes exatamente
      if (hrefHash && currentHash) {
        return hrefHash === currentHash;
      }

      // Se o href tem hash mas o currentFullPath não, não está ativo
      if (hrefHash && !currentHash) {
        return false;
      }

      // Se o href não tem hash e o currentFullPath também não, está ativo
      if (!hrefHash && !currentHash) {
        return true;
      }

      // Se o href não tem hash mas o currentFullPath tem, não está ativo
      // (ex: estamos em /about#articles, então /about não deve estar ativo)
      return false;
    },
    [getCurrentFullPath],
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prevState) => !prevState);
  }, []);

  return (
    <>
      <HeaderContainer className={className} data-mounted={isMounted}>
        <Container>
          <HeaderContent>
            <Logo>
              <LogoImage src="/logotipo-drivedata.png" alt="DriveData Logo" />
            </Logo>

            <Navigation>
              {navigationLinks.map((item) => (
                <NavLink
                  key={item.labelKey}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  isActive={isLinkActive(item.href)}
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </Navigation>

            <HeaderActions>
              <LanguageSelectorWrapper ref={languageSelectorRef}>
                <LanguageSelector
                  type="button"
                  onClick={toggleLanguageDropdown}
                  aria-haspopup="true"
                  aria-expanded={isLanguageDropdownOpen}
                  aria-label={languageSelectorLabel}
                >
                  <FlagIcon>{currentLanguage.flag}</FlagIcon>
                  <LanguageText>{currentLanguage.label}</LanguageText>
                  <ChevronIcon isOpen={isLanguageDropdownOpen} />
                </LanguageSelector>

                {isLanguageDropdownOpen && (
                  <LanguageDropdown role="menu">
                    {languageOptions.map((language) => (
                      <LanguageDropdownItem
                        key={language.code}
                        role="menuitem"
                        onClick={() => handleLanguageChange(language)}
                        isActive={language.code === currentLanguage.code}
                        aria-current={
                          language.code === currentLanguage.code
                            ? 'true'
                            : undefined
                        }
                      >
                        <FlagIcon>{language.flag}</FlagIcon>
                        <LanguageText>{language.label}</LanguageText>
                      </LanguageDropdownItem>
                    ))}
                  </LanguageDropdown>
                )}
              </LanguageSelectorWrapper>

              <ContactButtonWrapper>
                <Button onClick={handleContactClick}>
                  {contactButtonLabel}
                </Button>
              </ContactButtonWrapper>

              <MobileMenuButton
                onClick={toggleMobileMenu}
                isOpen={isMobileMenuOpen}
              >
                <MobileMenuIcon isOpen={isMobileMenuOpen} />
              </MobileMenuButton>
            </HeaderActions>
          </HeaderContent>
        </Container>
      </HeaderContainer>

      <MobileMenuBackdrop
        isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <MobileMenu isOpen={isMobileMenuOpen}>
        {navigationLinks.map((item) => (
          <MobileNavLink
            key={item.labelKey}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            isActive={isLinkActive(item.href)}
          >
            {t(item.labelKey)}
          </MobileNavLink>
        ))}

        <MobileLanguageSection>
          <MobileLanguageToggle
            type="button"
            onClick={toggleMobileLanguage}
            aria-haspopup="listbox"
            aria-expanded={isMobileLanguageOpen}
            aria-label={languageSelectorLabel}
          >
            <MobileLanguageToggleContent>
              <FlagIcon>{currentLanguage.flag}</FlagIcon>
              <LanguageText>{currentLanguage.label}</LanguageText>
            </MobileLanguageToggleContent>
            <ChevronIcon isOpen={isMobileLanguageOpen} />
          </MobileLanguageToggle>

          <MobileLanguageList
            isOpen={isMobileLanguageOpen}
            role="listbox"
            aria-label={languageSelectorLabel}
          >
            {languageOptions.map((language) => (
              <MobileLanguageOption
                key={language.code}
                role="option"
                onClick={() => handleLanguageChange(language)}
                isActive={language.code === currentLanguage.code}
                aria-selected={language.code === currentLanguage.code}
              >
                <FlagIcon>{language.flag}</FlagIcon>
                <LanguageText>{language.label}</LanguageText>
              </MobileLanguageOption>
            ))}
          </MobileLanguageList>
        </MobileLanguageSection>

        <MobileMenuContactButton>
          <Button onClick={handleContactClick}>{contactButtonLabel}</Button>
        </MobileMenuContactButton>
      </MobileMenu>
    </>
  );
};
