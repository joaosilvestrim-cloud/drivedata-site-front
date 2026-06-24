'use client';

import { Container } from '@/common/components/container';
import Image from 'next/image';
import * as CookieConsent from 'vanilla-cookieconsent';
import { useTranslation } from 'react-i18next';
import {
  FooterBottom,
  FooterBottomContent,
  FooterBrand,
  FooterContainer,
  FooterContent,
  FooterCopyright,
  FooterLink,
  FooterLinkItem,
  FooterLinks,
  FooterLogo,
  FooterMadeBy,
  FooterSection,
  FooterSectionTitle,
  FooterUrl,
  SocialLink,
  SocialLinks,
} from './styles';
import { FooterProps } from './types';

export const Footer = ({ className }: FooterProps) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer className={className}>
      <Container>
        <FooterContent>
          <FooterBrand>
            <FooterLogo>
              <Image
                src="/logotipo-drivedata.png"
                alt="DriveData"
                width={215}
                height={52}
                loading="lazy"
                quality={85}
              />
            </FooterLogo>
            <FooterLogo>
              <Image
                src="/microsoftPartner.png"
                alt="microsoft partner"
                width={215}
                height={52}
                loading="lazy"
                quality={85}
              />
            </FooterLogo>
          </FooterBrand>

          <FooterSection>
            <FooterSectionTitle>{t('footer.usefulLinks')}</FooterSectionTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink href="/about#clientes">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="9 22 9 12 15 12 15 22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t('footer.projects')}
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/#solucoes">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="12 6 12 12 16 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t('footer.solutions')}
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/about#contato">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t('footer.contact')}
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/privacy-policy">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t('footer.privacyPolicy')}
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink
                  as="button"
                  onClick={() => CookieConsent.showPreferences()}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t('footer.cookiePreferences')}
                </FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterSectionTitle>{t('footer.social')}</FooterSectionTitle>
            <SocialLinks>
              <SocialLink
                href="https://www.linkedin.com/company/drivedatabi/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="2"
                    y="9"
                    width="4"
                    height="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="4"
                    cy="4"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                LinkedIn
              </SocialLink>
              <SocialLink
                href="https://www.instagram.com/_drivedata"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    ry="5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="17.5"
                    y1="6.5"
                    x2="17.51"
                    y2="6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Instagram
              </SocialLink>
              <SocialLink
                href="https://www.tiktok.com/@_drivedata"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                TikTok
              </SocialLink>
            </SocialLinks>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <FooterUrl
            href="https://drivedata.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            drivedata.com.br
          </FooterUrl>
          <FooterBottomContent>
            <FooterCopyright>
              {t('footer.copyright')} {currentYear}
            </FooterCopyright>
            <FooterMadeBy>
              {t('footer.madeBy')}{' '}
              <a
                href="https://drivedata.com.br"
                target="_blank"
                rel="noopener noreferrer"
              >
                DriveData
              </a>{' '}
              ❤
            </FooterMadeBy>
          </FooterBottomContent>
        </FooterBottom>
      </Container>
    </FooterContainer>
  );
};
