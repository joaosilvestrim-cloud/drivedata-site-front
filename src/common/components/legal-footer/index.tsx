'use client';

import {
  FooterContainer,
  FooterContent,
  CompaniesSection,
  CompanyCard,
  CompanyName,
  CompanyInfo,
  LinksSection,
  LinksTitle,
  LinksList,
  FooterLink,
  CopyrightSection,
  Copyright,
} from './styles';
import { LegalFooterProps } from './types';

export const LegalFooter = ({ className }: LegalFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer className={className}>
      <FooterContent>
        <CompaniesSection>
          <CompanyCard>
            <CompanyName>Tambasa Atacadistas</CompanyName>
            <CompanyInfo>CNPJ: 17.359.233/0001-88</CompanyInfo>
            <CompanyInfo>
              Av Municipal Manoel Jacinto Coelho Jr, S/N - Tapera
            </CompanyInfo>
            <CompanyInfo>CEP: 32.060-514 - Contagem/MG</CompanyInfo>
          </CompanyCard>

          <CompanyCard>
            <CompanyName>Drivedata LTDA</CompanyName>
            <CompanyInfo>CNPJ: 55.175.790/0001-38</CompanyInfo>
            <CompanyInfo>
              Al Rio Negro, 503, Sala 2020 - Alphaville Centro Industrial e
              Empresarial
            </CompanyInfo>
            <CompanyInfo>CEP: 06.454-000 - Barueri/SP</CompanyInfo>
          </CompanyCard>
        </CompaniesSection>

        <LinksSection>
          <LinksTitle>Documentos Legais</LinksTitle>
          <LinksList>
            <FooterLink href="/tambasa/privacy-policy">
              Política de Privacidade
            </FooterLink>
            <FooterLink href="/tambasa/terms-of-use">
              Termos de Uso
            </FooterLink>
            <FooterLink href="/tambasa/data-deletion">
              Exclusão de Dados
            </FooterLink>
            <FooterLink href="/tambasa/support">Suporte</FooterLink>
          </LinksList>
        </LinksSection>

        <CopyrightSection>
          <Copyright>
            © {currentYear} Tambasa Atacadistas | Drivedata LTDA - Todos os
            direitos reservados
          </Copyright>
        </CopyrightSection>
      </FooterContent>
    </FooterContainer>
  );
};
