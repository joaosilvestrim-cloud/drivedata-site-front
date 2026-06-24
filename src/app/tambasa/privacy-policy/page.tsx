'use client';

import type { Metadata } from 'next';
import {
  PageContainer,
  PageContent,
  PageTitle,
  PageSubtitle,
  Section,
  SectionTitle,
  SubSection,
  SubSectionTitle,
  Paragraph,
  List,
  ListItem,
  InfoBox,
  Link,
  Divider,
  CompanyInfo,
  CompanyName,
  CompanyDetails,
} from './styles';

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <PageContent>
        <PageTitle>Política de Privacidade - Tambasa Operações</PageTitle>
        <PageSubtitle>
          <strong>Última atualização:</strong> 10 de fevereiro de 2026 <br />
          <strong>Versão:</strong> 1.0
        </PageSubtitle>

        <Divider />

        <Section>
          <SectionTitle>1. Identificação</SectionTitle>

          <SubSection>
            <SubSectionTitle>1.1 Responsáveis pelo Aplicativo</SubSectionTitle>
            <Paragraph>
              O aplicativo <strong>Tambasa Operações</strong> foi desenvolvido
              em parceria entre:
            </Paragraph>

            <CompanyInfo>
              <CompanyName>Drivedata LTDA</CompanyName>
              <CompanyDetails>CNPJ: 55.175.790/0001-38</CompanyDetails>
              <CompanyDetails>
                Endereço: Al Rio Negro, 503, Sala 2020 - Alphaville Centro
                Industrial e Empresarial
              </CompanyDetails>
              <CompanyDetails>CEP: 06.454-000 - Barueri/SP</CompanyDetails>
            </CompanyInfo>

            <CompanyInfo>
              <CompanyName>Tambasa Atacadistas</CompanyName>
              <CompanyDetails>CNPJ: 17.359.233/0001-88</CompanyDetails>
              <CompanyDetails>
                Endereço: Av Municipal Manoel Jacinto Coelho Jr, S/N - Tapera
              </CompanyDetails>
              <CompanyDetails>CEP: 32.060-514 - Contagem/MG</CompanyDetails>
            </CompanyInfo>
          </SubSection>

          <SubSection>
            <SubSectionTitle>1.2 Natureza do Aplicativo</SubSectionTitle>
            <Paragraph>
              O <strong>Tambasa Operações</strong> é um aplicativo de{' '}
              <strong>uso corporativo interno</strong>, destinado exclusivamente
              a colaboradores e parceiros autorizados da{' '}
              <strong>Tambasa Atacadistas</strong> para gerenciamento de
              operações logísticas e controle de docas.
            </Paragraph>
            <InfoBox>
              <Paragraph>
                <strong>
                  Este aplicativo NÃO é direcionado ao público em geral.
                </strong>
              </Paragraph>
            </InfoBox>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>2. Informações Gerais</SectionTitle>
          <Paragraph>
            Esta Política de Privacidade descreve como coletamos, usamos,
            armazenamos e protegemos seus dados pessoais durante o uso do
            aplicativo <strong>Tambasa Operações</strong>, em conformidade com
            a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </Paragraph>
          <Paragraph>
            Ao utilizar o aplicativo, você declara ter lido, compreendido e
            concordado com os termos desta Política de Privacidade.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>3. Dados Coletados</SectionTitle>

          <SubSection>
            <SubSectionTitle>3.1 Dados de Autenticação</SubSectionTitle>
            <Paragraph>Para acessar o aplicativo, coletamos:</Paragraph>
            <List>
              <ListItem>
                <strong>E-mail corporativo</strong>
              </ListItem>
              <ListItem>
                <strong>Senha</strong> (armazenada de forma criptografada)
              </ListItem>
              <ListItem>
                <strong>Domínio</strong> (quando aplicável)
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>3.2 Dados de Perfil</SubSectionTitle>
            <Paragraph>Após o login, são coletados e mantidos:</Paragraph>
            <List>
              <ListItem>Nome completo</ListItem>
              <ListItem>Documento (CPF ou CNPJ)</ListItem>
              <ListItem>Telefone</ListItem>
              <ListItem>E-mail</ListItem>
              <ListItem>Foto de perfil (opcional)</ListItem>
              <ListItem>Data de cadastro</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>3.3 Dados de Loja</SubSectionTitle>
            <Paragraph>
              Informações sobre a loja/unidade na qual você atua:
            </Paragraph>
            <List>
              <ListItem>ID da loja</ListItem>
              <ListItem>Nome da loja</ListItem>
              <ListItem>Documento da loja</ListItem>
              <ListItem>Informações de contato da loja</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>3.4 Dados Operacionais</SubSectionTitle>
            <Paragraph>Durante o uso do aplicativo, coletamos:</Paragraph>
            <List>
              <ListItem>
                <strong>Agendamentos</strong> - registros de operações em docas
              </ListItem>
              <ListItem>
                <strong>Check-ins de veículos</strong> - informações sobre
                veículos, carretas e vagas
              </ListItem>
              <ListItem>
                <strong>Fotos de validação</strong> - imagens capturadas para
                validação de lacres e processos
              </ListItem>
              <ListItem>
                <strong>QR codes escaneados</strong> - identificação de docas e
                veículos
              </ListItem>
              <ListItem>
                <strong>Observações</strong> - notas e comentários sobre
                operações
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>3.5 Dados Técnicos</SubSectionTitle>
            <Paragraph>
              Para funcionamento adequado do aplicativo, coletamos:
            </Paragraph>
            <List>
              <ListItem>
                <strong>Tokens de autenticação</strong> (JWT)
              </ListItem>
              <ListItem>
                <strong>Tokens de notificações push</strong> (Expo Push Token)
              </ListItem>
              <ListItem>
                <strong>Identificador do dispositivo</strong> (Device ID)
              </ListItem>
              <ListItem>
                <strong>Plataforma</strong> (iOS ou Android)
              </ListItem>
              <ListItem>
                <strong>Fuso horário</strong> (timezone offset)
              </ListItem>
              <ListItem>
                <strong>Logs de acesso</strong> e uso do aplicativo
              </ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>4. Finalidade do Tratamento de Dados</SectionTitle>
          <Paragraph>
            Os dados coletados são utilizados para as seguintes finalidades:
          </Paragraph>

          <SubSection>
            <SubSectionTitle>4.1 Autenticação e Segurança</SubSectionTitle>
            <List>
              <ListItem>
                Verificar sua identidade e gerenciar seu acesso ao aplicativo
              </ListItem>
              <ListItem>
                Proteger sua conta contra acesso não autorizado
              </ListItem>
              <ListItem>Manter logs de auditoria para segurança</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>4.2 Operações Logísticas</SubSectionTitle>
            <List>
              <ListItem>Gerenciar agendamentos e operações em docas</ListItem>
              <ListItem>Controlar check-ins e check-outs de veículos</ListItem>
              <ListItem>Validar lacres e processos operacionais</ListItem>
              <ListItem>Gerar relatórios e estatísticas de operações</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>4.3 Comunicação</SubSectionTitle>
            <List>
              <ListItem>
                Enviar notificações push sobre agendamentos e operações
              </ListItem>
              <ListItem>Comunicar atualizações importantes do sistema</ListItem>
              <ListItem>
                Notificar sobre mudanças em processos operacionais
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>4.4 Melhoria do Serviço</SubSectionTitle>
            <List>
              <ListItem>Analisar o uso do aplicativo para melhorias</ListItem>
              <ListItem>Identificar e corrigir problemas técnicos</ListItem>
              <ListItem>Desenvolver novas funcionalidades</ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>5. Permissões Solicitadas</SectionTitle>
          <Paragraph>
            O aplicativo solicita as seguintes permissões do dispositivo:
          </Paragraph>

          <SubSection>
            <SubSectionTitle>5.1 Câmera</SubSectionTitle>
            <Paragraph>
              <strong>Por que precisamos:</strong> Para escanear QR codes de
              docas e veículos, e capturar fotos de validação de lacres.
            </Paragraph>
            <Paragraph>
              <strong>Quando é solicitada:</strong> Ao acessar o scanner de QR
              code ou ao tirar fotos.
            </Paragraph>
            <Paragraph>
              <strong>Como recusar:</strong> Você pode negar a permissão nas
              configurações do seu dispositivo, mas não conseguirá utilizar
              funcionalidades essenciais do aplicativo.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>5.2 Notificações Push</SubSectionTitle>
            <Paragraph>
              <strong>Por que precisamos:</strong> Para enviar alertas sobre
              agendamentos, mudanças de status e comunicações operacionais
              importantes.
            </Paragraph>
            <Paragraph>
              <strong>Quando é solicitada:</strong> No primeiro acesso ao
              aplicativo.
            </Paragraph>
            <Paragraph>
              <strong>Como recusar:</strong> Você pode desativar notificações
              nas configurações do dispositivo ou do aplicativo.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>5.3 Armazenamento Local</SubSectionTitle>
            <Paragraph>
              <strong>Por que precisamos:</strong> Para manter sua sessão ativa
              e armazenar dados de autenticação de forma segura.
            </Paragraph>
            <Paragraph>
              <strong>Quando é usada:</strong> Automaticamente após o login.
            </Paragraph>
            <Paragraph>
              <strong>Segurança:</strong> Utilizamos o Expo SecureStore para
              criptografia de dados sensíveis.
            </Paragraph>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>6. Compartilhamento de Dados</SectionTitle>

          <SubSection>
            <SubSectionTitle>6.1 Compartilhamento Interno</SubSectionTitle>
            <Paragraph>
              Seus dados são compartilhados <strong>apenas internamente</strong>{' '}
              entre:
            </Paragraph>
            <List>
              <ListItem>
                Tambasa Atacadistas (operadora do sistema)
              </ListItem>
              <ListItem>
                Drivedata LTDA (desenvolvedora e mantenedora)
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>
              6.2 Não Compartilhamos com Terceiros
            </SubSectionTitle>
            <Paragraph>
              <strong>
                NÃO vendemos, alugamos ou compartilhamos seus dados pessoais
                com terceiros
              </strong>
              , exceto:
            </Paragraph>
            <List>
              <ListItem>
                <strong>Por obrigação legal:</strong> Quando exigido por lei,
                ordem judicial ou órgão regulador
              </ListItem>
              <ListItem>
                <strong>Proteção de direitos:</strong> Para proteger nossos
                direitos, propriedade ou segurança
              </ListItem>
              <ListItem>
                <strong>Prestadores de serviço técnico:</strong> Provedores de
                infraestrutura (servidores, armazenamento em nuvem) sob acordo
                de confidencialidade
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>6.3 Serviços de Terceiros</SubSectionTitle>
            <Paragraph>O aplicativo utiliza os seguintes serviços:</Paragraph>
            <List>
              <ListItem>
                <strong>Firebase (Google):</strong> Analytics e notificações
                push
              </ListItem>
              <ListItem>
                <strong>AWS S3:</strong> Armazenamento de fotos e arquivos
              </ListItem>
              <ListItem>
                <strong>Expo:</strong> Infraestrutura de desenvolvimento e
                notificações
              </ListItem>
            </List>
            <Paragraph>
              Estes serviços estão sujeitos às suas próprias políticas de
              privacidade e utilizamos apenas os recursos necessários para o
              funcionamento do aplicativo.
            </Paragraph>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>7. Armazenamento e Segurança</SectionTitle>

          <SubSection>
            <SubSectionTitle>7.1 Onde os Dados São Armazenados</SubSectionTitle>
            <Paragraph>
              Os dados são armazenados em servidores seguros localizados no
              Brasil e/ou em provedores de nuvem com conformidade LGPD.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>7.2 Prazo de Armazenamento</SubSectionTitle>
            <List>
              <ListItem>
                <strong>Dados de perfil:</strong> Mantidos enquanto você for
                colaborador ativo
              </ListItem>
              <ListItem>
                <strong>Dados operacionais:</strong> Mantidos por até 5 anos
                para fins de auditoria e conformidade fiscal
              </ListItem>
              <ListItem>
                <strong>Logs técnicos:</strong> Mantidos por até 12 meses
              </ListItem>
              <ListItem>
                <strong>Fotos e anexos:</strong> Mantidos por até 5 anos ou
                conforme necessidade operacional/legal
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>7.3 Medidas de Segurança</SubSectionTitle>
            <Paragraph>
              Implementamos medidas técnicas e organizacionais para proteger
              seus dados:
            </Paragraph>
            <List>
              <ListItem>Criptografia de dados em trânsito (HTTPS/TLS)</ListItem>
              <ListItem>Criptografia de dados sensíveis em repouso</ListItem>
              <ListItem>
                Controle de acesso baseado em função (RBAC)
              </ListItem>
              <ListItem>
                Autenticação via JWT com refresh tokens
              </ListItem>
              <ListItem>Monitoramento e logs de segurança</ListItem>
              <ListItem>Backups regulares</ListItem>
              <ListItem>Políticas de segurança da informação</ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>8. Seus Direitos (LGPD)</SectionTitle>
          <Paragraph>
            Conforme a LGPD, você tem os seguintes direitos sobre seus dados
            pessoais:
          </Paragraph>

          <SubSection>
            <SubSectionTitle>8.1 Direito de Acesso</SubSectionTitle>
            <Paragraph>
              Solicitar cópia dos seus dados pessoais que mantemos.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>8.2 Direito de Correção</SubSectionTitle>
            <Paragraph>
              Solicitar correção de dados incompletos, inexatos ou
              desatualizados.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>8.3 Direito de Exclusão</SubSectionTitle>
            <Paragraph>
              Solicitar exclusão de dados pessoais, exceto quando houver
              obrigação legal de manutenção.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>8.4 Direito de Portabilidade</SubSectionTitle>
            <Paragraph>
              Solicitar seus dados em formato estruturado e de uso comum.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>8.5 Direito de Oposição</SubSectionTitle>
            <Paragraph>
              Opor-se ao tratamento de dados em determinadas situações.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>
              8.6 Direito de Revogação do Consentimento
            </SubSectionTitle>
            <Paragraph>Revogar consentimento quando aplicável.</Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>8.7 Como Exercer Seus Direitos</SubSectionTitle>
            <Paragraph>
              Para exercer qualquer um desses direitos, entre em contato através
              dos canais indicados na seção "Contato" ou acesse nossa página de
              exclusão de dados.
            </Paragraph>
            <InfoBox>
              <Paragraph>
                <strong>Prazo de resposta:</strong> Até 15 dias úteis.
              </Paragraph>
            </InfoBox>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>9. Exclusão de Dados</SectionTitle>
          <Paragraph>
            Para solicitar a exclusão dos seus dados pessoais, você pode:
          </Paragraph>
          <List>
            <ListItem>
              Acessar a página de exclusão de dados (veja seção "Contato")
            </ListItem>
            <ListItem>Preencher o formulário com suas informações</ListItem>
            <ListItem>Enviar a solicitação</ListItem>
          </List>
          <InfoBox>
            <Paragraph>
              <strong>Importante:</strong> Alguns dados podem ser mantidos por
              obrigação legal (fiscal, trabalhista) mesmo após a solicitação de
              exclusão.
            </Paragraph>
          </InfoBox>
        </Section>

        <Section>
          <SectionTitle>10. Uso por Menores de Idade</SectionTitle>
          <Paragraph>
            O aplicativo <strong>Tambasa Operações</strong> é destinado
            exclusivamente a colaboradores e parceiros{' '}
            <strong>maiores de 18 anos</strong>. Não coletamos intencionalmente
            dados de menores de idade.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>11. Alterações nesta Política</SectionTitle>
          <Paragraph>
            Podemos atualizar esta Política de Privacidade periodicamente.
            Quando houver mudanças significativas, você será notificado através
            do aplicativo ou por e-mail.
          </Paragraph>
          <Paragraph>
            <strong>
              Recomendamos que você revise esta política regularmente.
            </strong>
          </Paragraph>
          <Paragraph>
            A versão mais recente estará sempre disponível no aplicativo e em
            nosso site.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>12. Legislação Aplicável</SectionTitle>
          <Paragraph>
            Esta Política de Privacidade é regida pelas leis da República
            Federativa do Brasil, especialmente:
          </Paragraph>
          <List>
            <ListItem>
              Lei nº 13.709/2018 (LGPD - Lei Geral de Proteção de Dados)
            </ListItem>
            <ListItem>Lei nº 12.965/2014 (Marco Civil da Internet)</ListItem>
            <ListItem>
              Código de Defesa do Consumidor (quando aplicável)
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>13. Contato</SectionTitle>

          <SubSection>
            <SubSectionTitle>
              13.1 Dúvidas sobre Privacidade
            </SubSectionTitle>
            <Paragraph>
              Para questões relacionadas à privacidade e proteção de dados:
            </Paragraph>
            <Paragraph>
              <strong>E-mail:</strong>{' '}
              <Link href="mailto:privacidade@drivedatateam.com.br">
                privacidade@drivedatateam.com.br
              </Link>
            </Paragraph>
            <Paragraph>
              <strong>Encarregado de Dados (DPO):</strong> A ser definido
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>13.2 Exclusão de Dados</SubSectionTitle>
            <Paragraph>Para solicitar exclusão de dados pessoais, acesse:</Paragraph>
            <Paragraph>
              <Link href="/tambasa/data-deletion">
                Formulário de exclusão de dados
              </Link>
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>13.3 Suporte Técnico</SubSectionTitle>
            <Paragraph>Para questões técnicas sobre o aplicativo:</Paragraph>
            <Paragraph>
              <strong>E-mail:</strong>{' '}
              <Link href="mailto:suporte@drivedatateam.com.br">
                suporte@drivedatateam.com.br
              </Link>
            </Paragraph>
            <Paragraph>
              <strong>Telefone:</strong> A ser definido
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>13.4 Endereços</SubSectionTitle>
            <CompanyInfo>
              <CompanyName>Tambasa Atacadistas</CompanyName>
              <CompanyDetails>
                Av Municipal Manoel Jacinto Coelho Jr, S/N - Tapera
              </CompanyDetails>
              <CompanyDetails>CEP: 32.060-514 - Contagem/MG</CompanyDetails>
            </CompanyInfo>

            <CompanyInfo>
              <CompanyName>Drivedata LTDA</CompanyName>
              <CompanyDetails>
                Al Rio Negro, 503, Sala 2020 - Alphaville
              </CompanyDetails>
              <CompanyDetails>CEP: 06.454-000 - Barueri/SP</CompanyDetails>
            </CompanyInfo>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>14. Aceitação</SectionTitle>
          <Paragraph>
            Ao utilizar o aplicativo <strong>Tambasa Operações</strong>, você
            confirma que:
          </Paragraph>
          <List>
            <ListItem>
              Leu e compreendeu esta Política de Privacidade
            </ListItem>
            <ListItem>
              Concorda com a coleta, uso e armazenamento de seus dados conforme
              descrito
            </ListItem>
            <ListItem>
              É colaborador autorizado da Tambasa Atacadistas ou parceiro
              autorizado
            </ListItem>
            <ListItem>Tem 18 anos ou mais</ListItem>
          </List>
        </Section>

        <Divider />

        <Paragraph style={{ textAlign: 'center', color: '#e0e0e0' }}>
          <strong>Tambasa Atacadistas</strong> |{' '}
          <strong>Drivedata LTDA</strong>
          <br />© 2026 - Todos os direitos reservados
        </Paragraph>
      </PageContent>
    </PageContainer>
  );
}
