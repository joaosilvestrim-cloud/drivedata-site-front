'use client';

import { Footer } from '@/common/components/footer';
import { Header } from '@/common/components/header';
import {
  CompanyDetails,
  CompanyInfo,
  CompanyName,
  CookieTable,
  Divider,
  InfoBox,
  Link,
  List,
  ListItem,
  PageContainer,
  PageContent,
  PageSubtitle,
  PageTitle,
  Paragraph,
  Section,
  SectionTitle,
  SubSection,
  SubSectionTitle,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './styles';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <PageContent>
          <PageTitle>Política de Privacidade e Proteção de Dados</PageTitle>
          <PageSubtitle>
            <strong>Última atualização:</strong> 19 de junho de 2026 &nbsp;|&nbsp;
            <strong>Versão:</strong> 1.0
          </PageSubtitle>

          <Divider />

          <Section>
            <SectionTitle>1. Identificação do Controlador</SectionTitle>
            <Paragraph>
              Esta Política de Privacidade se aplica ao site{' '}
              <Link href="https://drivedata.com.br">drivedata.com.br</Link> e a
              todos os serviços prestados pela:
            </Paragraph>
            <CompanyInfo>
              <CompanyName>Drivedata LTDA</CompanyName>
              <CompanyDetails>CNPJ: 55.175.790/0001-38</CompanyDetails>
              <CompanyDetails>
                Al Rio Negro, 503, Sala 2020 — Alphaville Centro Industrial e
                Empresarial
              </CompanyDetails>
              <CompanyDetails>CEP: 06.454-000 — Barueri/SP — Brasil</CompanyDetails>
              <CompanyDetails>
                E-mail:{' '}
                <Link href="mailto:privacidade@drivedatateam.com.br">
                  privacidade@drivedatateam.com.br
                </Link>
              </CompanyDetails>
            </CompanyInfo>
          </Section>

          <Section>
            <SectionTitle>2. Informações Gerais</SectionTitle>
            <Paragraph>
              A Drivedata LTDA, doravante denominada <strong>Drive Data</strong>,
              está comprometida com a privacidade e proteção dos dados pessoais de
              seus visitantes e clientes, em conformidade com a{' '}
              <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>{' '}
              e demais legislações aplicáveis.
            </Paragraph>
            <Paragraph>
              Ao acessar e utilizar nosso site, você declara ter lido, compreendido e
              concordado com os termos desta Política de Privacidade. Caso não concorde
              com alguma disposição, recomendamos que não utilize nossos serviços.
            </Paragraph>
            <InfoBox>
              <Paragraph>
                Esta política descreve como coletamos, usamos, armazenamos e protegemos
                suas informações. Dúvidas? Entre em contato pelo e-mail{' '}
                <Link href="mailto:privacidade@drivedatateam.com.br">
                  privacidade@drivedatateam.com.br
                </Link>
                .
              </Paragraph>
            </InfoBox>
          </Section>

          <Section>
            <SectionTitle>3. Dados Pessoais Coletados</SectionTitle>

            <SubSection>
              <SubSectionTitle>3.1 Dados fornecidos voluntariamente</SubSectionTitle>
              <Paragraph>
                Ao preencher formulários de contato, solicitar demonstrações ou
                interagir com nossos canais, coletamos:
              </Paragraph>
              <List>
                <ListItem>
                  <strong>Nome completo</strong>
                </ListItem>
                <ListItem>
                  <strong>Endereço de e-mail</strong>
                </ListItem>
                <ListItem>
                  <strong>Número de telefone / WhatsApp</strong>
                </ListItem>
                <ListItem>
                  <strong>Nome da empresa</strong> (quando aplicável)
                </ListItem>
                <ListItem>
                  <strong>Cargo / função</strong> (quando informado)
                </ListItem>
                <ListItem>
                  <strong>Mensagens e comunicações</strong> enviadas por meio do chat ou
                  formulários
                </ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubSectionTitle>3.2 Dados coletados automaticamente</SubSectionTitle>
              <Paragraph>
                Ao navegar pelo site, coletamos automaticamente informações técnicas por
                meio de cookies e tecnologias semelhantes:
              </Paragraph>
              <List>
                <ListItem>
                  <strong>Endereço IP</strong> e localização geográfica aproximada
                </ListItem>
                <ListItem>
                  <strong>Tipo e versão do navegador</strong> e sistema operacional
                </ListItem>
                <ListItem>
                  <strong>Páginas visitadas</strong> e tempo de permanência
                </ListItem>
                <ListItem>
                  <strong>Origem da visita</strong> (mecanismos de busca, redes sociais,
                  links diretos)
                </ListItem>
                <ListItem>
                  <strong>Interações com o site</strong> (cliques, rolagem, eventos)
                </ListItem>
                <ListItem>
                  <strong>Identificadores de sessão</strong> gerados pelos cookies
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
              <SubSectionTitle>4.1 Atendimento e suporte</SubSectionTitle>
              <List>
                <ListItem>
                  Responder a solicitações de contato, demonstrações e informações sobre
                  produtos e serviços
                </ListItem>
                <ListItem>Prestar suporte técnico e atendimento ao cliente</ListItem>
                <ListItem>Estabelecer e manter relacionamento comercial</ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubSectionTitle>4.2 Marketing e comunicação</SubSectionTitle>
              <List>
                <ListItem>
                  Enviar materiais informativos, novidades e conteúdos relevantes
                  (mediante consentimento)
                </ListItem>
                <ListItem>
                  Exibir anúncios personalizados em plataformas de terceiros (mediante
                  consentimento)
                </ListItem>
                <ListItem>Realizar análises de desempenho de campanhas de marketing</ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubSectionTitle>4.3 Melhoria do site e serviços</SubSectionTitle>
              <List>
                <ListItem>
                  Analisar o comportamento de navegação para aprimorar a experiência do
                  usuário
                </ListItem>
                <ListItem>Identificar e corrigir erros e falhas técnicas</ListItem>
                <ListItem>
                  Desenvolver novas funcionalidades com base no uso real do site
                </ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubSectionTitle>4.4 Obrigações legais</SubSectionTitle>
              <List>
                <ListItem>
                  Cumprir obrigações legais, regulatórias e contratuais
                </ListItem>
                <ListItem>
                  Exercer direitos em processos judiciais, administrativos ou arbitrais
                </ListItem>
              </List>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>5. Base Legal para o Tratamento</SectionTitle>
            <Paragraph>
              O tratamento dos dados pessoais é realizado com fundamento nas seguintes
              bases legais previstas pela LGPD (art. 7º):
            </Paragraph>
            <List>
              <ListItem>
                <strong>Consentimento (art. 7º, I):</strong> para comunicações de
                marketing, cookies analíticos e de marketing
              </ListItem>
              <ListItem>
                <strong>Execução de contrato (art. 7º, V):</strong> para atendimento de
                solicitações e prestação de serviços
              </ListItem>
              <ListItem>
                <strong>Legítimo interesse (art. 7º, IX):</strong> para análise de
                segurança, prevenção de fraudes e melhoria do site
              </ListItem>
              <ListItem>
                <strong>Cumprimento de obrigação legal (art. 7º, II):</strong> para
                atender requisitos legais e regulatórios
              </ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>6. Política de Cookies</SectionTitle>
            <Paragraph>
              Utilizamos cookies e tecnologias similares para melhorar sua experiência,
              analisar o tráfego do site e personalizar conteúdos. Você pode gerenciar
              suas preferências de cookies a qualquer momento pelo banner de
              consentimento exibido ao acessar o site.
            </Paragraph>

            <SubSection>
              <SubSectionTitle>6.1 O que são cookies?</SubSectionTitle>
              <Paragraph>
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo
                quando você visita um site. Eles permitem que o site reconheça seu
                dispositivo e lembre de informações sobre sua visita.
              </Paragraph>
            </SubSection>

            <SubSection>
              <SubSectionTitle>6.2 Categorias de cookies utilizados</SubSectionTitle>

              <CookieTable>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Categoria</TableHeader>
                      <TableHeader>Cookie / Serviço</TableHeader>
                      <TableHeader>Finalidade</TableHeader>
                      <TableHeader>Duração</TableHeader>
                      <TableHeader>Obrigatório</TableHeader>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    <TableRow>
                      <TableCell>
                        <strong style={{ color: '#ffffff' }}>Necessários</strong>
                      </TableCell>
                      <TableCell>cc_cookie</TableCell>
                      <TableCell>
                        Armazena as preferências de consentimento de cookies do usuário
                      </TableCell>
                      <TableCell>6 meses</TableCell>
                      <TableCell style={{ color: '#0dd0d0' }}>Sim</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong style={{ color: '#ffffff' }}>Analíticos</strong>
                      </TableCell>
                      <TableCell>_ga, _ga_*</TableCell>
                      <TableCell>
                        Google Analytics — análise de comportamento, origem de tráfego e
                        desempenho de páginas
                      </TableCell>
                      <TableCell>2 anos</TableCell>
                      <TableCell>Não</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong style={{ color: '#ffffff' }}>Analíticos</strong>
                      </TableCell>
                      <TableCell>_gid</TableCell>
                      <TableCell>
                        Google Analytics — distingue usuários únicos para análise de
                        sessão
                      </TableCell>
                      <TableCell>24 horas</TableCell>
                      <TableCell>Não</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong style={{ color: '#ffffff' }}>Analíticos</strong>
                      </TableCell>
                      <TableCell>_gat</TableCell>
                      <TableCell>
                        Google Analytics — controla a taxa de requisições ao servidor
                      </TableCell>
                      <TableCell>1 minuto</TableCell>
                      <TableCell>Não</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong style={{ color: '#ffffff' }}>Marketing</strong>
                      </TableCell>
                      <TableCell>typebot-*</TableCell>
                      <TableCell>
                        Typebot — mantém o estado da conversa do chat e personaliza a
                        experiência de atendimento
                      </TableCell>
                      <TableCell>Sessão</TableCell>
                      <TableCell>Não</TableCell>
                    </TableRow>
                  </tbody>
                </Table>
              </CookieTable>
            </SubSection>

            <SubSection>
              <SubSectionTitle>6.3 Como gerenciar seus cookies</SubSectionTitle>
              <Paragraph>
                Você pode controlar os cookies de três formas:
              </Paragraph>
              <List>
                <ListItem>
                  <strong>Banner de consentimento:</strong> ao acessar o site pela
                  primeira vez, um banner permite que você aceite, rejeite ou personalize
                  as categorias de cookies
                </ListItem>
                <ListItem>
                  <strong>Reabertura das preferências:</strong> clique no ícone de
                  configurações de cookies exibido no canto da tela para revisar suas
                  escolhas a qualquer momento
                </ListItem>
                <ListItem>
                  <strong>Configurações do navegador:</strong> você pode bloquear ou
                  excluir cookies diretamente nas configurações do seu navegador, embora
                  isso possa afetar a funcionalidade do site
                </ListItem>
              </List>
              <InfoBox>
                <Paragraph>
                  <strong>Atenção:</strong> a desativação de cookies necessários pode
                  impactar o funcionamento correto do site. Cookies analíticos e de
                  marketing só são ativados após o seu consentimento explícito.
                </Paragraph>
              </InfoBox>
            </SubSection>

            <SubSection>
              <SubSectionTitle>6.4 Google Tag Manager</SubSectionTitle>
              <Paragraph>
                Utilizamos o <strong>Google Tag Manager (GTM-PQVNX8CR)</strong> para
                gerenciar e implantar tags de rastreamento no site. O GTM é carregado
                apenas após o consentimento da categoria de cookies analíticos. Para mais
                informações, consulte a{' '}
                <Link
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de Privacidade do Google
                </Link>
                .
              </Paragraph>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>7. Compartilhamento de Dados</SectionTitle>

            <SubSection>
              <SubSectionTitle>7.1 Serviços de terceiros</SubSectionTitle>
              <Paragraph>
                Para operar o site e prestar nossos serviços, utilizamos provedores
                terceiros que podem ter acesso a dados pessoais:
              </Paragraph>
              <List>
                <ListItem>
                  <strong>Google (Analytics / Tag Manager):</strong> análise de
                  tráfego e comportamento — sujeito à{' '}
                  <Link
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidade do Google
                  </Link>
                </ListItem>
                <ListItem>
                  <strong>Typebot:</strong> plataforma de atendimento via chat —
                  sujeito à{' '}
                  <Link
                    href="https://typebot.io/privacy-policies"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidade do Typebot
                  </Link>
                </ListItem>
                <ListItem>
                  <strong>Provedores de infraestrutura:</strong> servidores e serviços
                  em nuvem utilizados para hospedar o site, sob acordos de
                  confidencialidade e proteção de dados
                </ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubSectionTitle>7.2 Não vendemos seus dados</SubSectionTitle>
              <Paragraph>
                A Drive Data <strong>não vende, aluga ou cede dados pessoais a
                terceiros</strong> para fins comerciais próprios de terceiros. O
                compartilhamento ocorre somente quando necessário para a prestação dos
                serviços descritos nesta política ou por obrigação legal.
              </Paragraph>
            </SubSection>

            <SubSection>
              <SubSectionTitle>7.3 Transferências internacionais</SubSectionTitle>
              <Paragraph>
                Alguns provedores de serviços (como Google e Typebot) podem processar
                dados fora do Brasil. Nestes casos, garantimos que os provedores
                adotam mecanismos adequados de proteção de dados, como cláusulas
                contratuais-padrão ou certificações equivalentes.
              </Paragraph>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>8. Armazenamento e Segurança</SectionTitle>

            <SubSection>
              <SubSectionTitle>8.1 Prazo de retenção</SubSectionTitle>
              <List>
                <ListItem>
                  <strong>Dados de contato e leads:</strong> mantidos enquanto houver
                  interesse legítimo ou relação comercial ativa — e por até 5 anos após
                  o encerramento, para fins de auditoria
                </ListItem>
                <ListItem>
                  <strong>Dados de navegação (cookies analíticos):</strong> conforme o
                  prazo de expiração de cada cookie (ver tabela da seção 6.2)
                </ListItem>
                <ListItem>
                  <strong>Registros de consentimento de cookies:</strong> por 6 meses
                  ou conforme exigido por lei
                </ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubSectionTitle>8.2 Medidas de segurança</SubSectionTitle>
              <Paragraph>
                Adotamos medidas técnicas e organizacionais para proteger seus dados:
              </Paragraph>
              <List>
                <ListItem>Comunicação criptografada via HTTPS/TLS</ListItem>
                <ListItem>Controle de acesso restrito aos dados pessoais</ListItem>
                <ListItem>Monitoramento contínuo de segurança e logs de acesso</ListItem>
                <ListItem>Backups regulares com retenção segura</ListItem>
                <ListItem>Políticas internas de segurança da informação</ListItem>
              </List>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>9. Seus Direitos (LGPD)</SectionTitle>
            <Paragraph>
              Nos termos da LGPD (art. 18), você tem os seguintes direitos sobre seus
              dados pessoais:
            </Paragraph>

            <SubSection>
              <SubSectionTitle>9.1 Direito de Acesso</SubSectionTitle>
              <Paragraph>
                Confirmar se tratamos seus dados e obter cópia das informações que
                mantemos sobre você.
              </Paragraph>
            </SubSection>

            <SubSection>
              <SubSectionTitle>9.2 Direito de Correção</SubSectionTitle>
              <Paragraph>
                Solicitar a atualização ou correção de dados incompletos, inexatos ou
                desatualizados.
              </Paragraph>
            </SubSection>

            <SubSection>
              <SubSectionTitle>9.3 Direito de Exclusão</SubSectionTitle>
              <Paragraph>
                Solicitar a eliminação dos dados pessoais tratados com base no seu
                consentimento, exceto nos casos em que a manutenção for exigida por lei.
              </Paragraph>
            </SubSection>

            <SubSection>
              <SubSectionTitle>9.4 Direito de Portabilidade</SubSectionTitle>
              <Paragraph>
                Solicitar seus dados em formato estruturado, de uso comum e de leitura
                automática, para transferência a outro fornecedor.
              </Paragraph>
            </SubSection>

            <SubSection>
              <SubSectionTitle>9.5 Direito de Oposição</SubSectionTitle>
              <Paragraph>
                Opor-se ao tratamento realizado com fundamento no legítimo interesse ou
                outras bases que não o consentimento.
              </Paragraph>
            </SubSection>

            <SubSection>
              <SubSectionTitle>9.6 Direito de Revogação do Consentimento</SubSectionTitle>
              <Paragraph>
                Retirar o consentimento a qualquer momento, sem prejudicar a legalidade
                do tratamento realizado anteriormente.
              </Paragraph>
            </SubSection>

            <SubSection>
              <SubSectionTitle>9.7 Como exercer seus direitos</SubSectionTitle>
              <Paragraph>
                Envie sua solicitação para{' '}
                <Link href="mailto:privacidade@drivedatateam.com.br">
                  privacidade@drivedatateam.com.br
                </Link>{' '}
                identificando-se e descrevendo o direito que deseja exercer.
              </Paragraph>
              <InfoBox>
                <Paragraph>
                  <strong>Prazo de resposta:</strong> até 15 dias úteis a partir do
                  recebimento da solicitação, conforme a LGPD.
                </Paragraph>
              </InfoBox>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>10. Uso por Menores de Idade</SectionTitle>
            <Paragraph>
              Nosso site não é direcionado a menores de 18 anos. Não coletamos
              intencionalmente dados pessoais de crianças ou adolescentes. Caso
              identifiquemos que dados de menores foram coletados sem o consentimento
              dos responsáveis legais, procederemos à exclusão imediata.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>11. Alterações nesta Política</SectionTitle>
            <Paragraph>
              Esta Política de Privacidade pode ser atualizada periodicamente para
              refletir mudanças em nossos serviços, práticas de dados ou na legislação
              aplicável. Quando houver alterações relevantes, notificaremos por meio de
              destaque no site ou por e-mail, quando aplicável.
            </Paragraph>
            <Paragraph>
              <strong>
                Recomendamos que você revise esta política regularmente.
              </strong>{' '}
              A versão mais recente estará sempre disponível em{' '}
              <Link href="/privacy-policy">drivedata.com.br/privacy-policy</Link>.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>12. Legislação Aplicável</SectionTitle>
            <Paragraph>
              Esta Política de Privacidade é regida pelas leis da República Federativa
              do Brasil, em especial:
            </Paragraph>
            <List>
              <ListItem>Lei nº 13.709/2018 — Lei Geral de Proteção de Dados (LGPD)</ListItem>
              <ListItem>Lei nº 12.965/2014 — Marco Civil da Internet</ListItem>
              <ListItem>Lei nº 8.078/1990 — Código de Defesa do Consumidor</ListItem>
            </List>
            <Paragraph>
              Fica eleito o foro da Comarca de Barueri/SP para dirimir quaisquer
              controvérsias decorrentes desta política.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>13. Contato e Encarregado de Dados (DPO)</SectionTitle>

            <SubSection>
              <SubSectionTitle>13.1 Canal de privacidade</SubSectionTitle>
              <Paragraph>
                Para exercer seus direitos, esclarecer dúvidas ou reportar questões
                relacionadas à privacidade:
              </Paragraph>
              <Paragraph>
                <strong>E-mail:</strong>{' '}
                <Link href="mailto:privacidade@drivedatateam.com.br">
                  privacidade@drivedatateam.com.br
                </Link>
              </Paragraph>
              <Paragraph>
                <strong>Encarregado de Dados (DPO):</strong> Tamires Cavani
              </Paragraph>
              <Paragraph>
                <strong>E-mail DPO:</strong>{' '}
                <Link href="mailto:tamirescavani@drivedata.com.br">
                  tamirescavani@drivedata.com.br
                </Link>
              </Paragraph>
              <Paragraph>
                <strong>Telefone:</strong>{' '}
                <Link href="tel:+5515981165998">(15) 98116-5998</Link>
              </Paragraph>
            </SubSection>

            <SubSection>
              <SubSectionTitle>13.2 Endereço</SubSectionTitle>
              <CompanyInfo>
                <CompanyName>Drivedata LTDA</CompanyName>
                <CompanyDetails>CNPJ: 55.175.790/0001-38</CompanyDetails>
                <CompanyDetails>
                  Al Rio Negro, 503, Sala 2020 — Alphaville Centro Industrial e
                  Empresarial
                </CompanyDetails>
                <CompanyDetails>CEP: 06.454-000 — Barueri/SP — Brasil</CompanyDetails>
              </CompanyInfo>
            </SubSection>

            <SubSection>
              <SubSectionTitle>13.3 Autoridade Nacional de Proteção de Dados</SubSectionTitle>
              <Paragraph>
                Caso não obtenha resposta satisfatória, você tem o direito de apresentar
                reclamação à{' '}
                <Link
                  href="https://www.gov.br/anpd/pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ANPD — Autoridade Nacional de Proteção de Dados
                </Link>
                .
              </Paragraph>
            </SubSection>
          </Section>

          <Divider />

          <Paragraph style={{ textAlign: 'center', color: '#e0e0e0' }}>
            <strong>Drive Data — Drivedata LTDA</strong>
            <br />© {new Date().getFullYear()} — Todos os direitos reservados
          </Paragraph>
        </PageContent>
      </PageContainer>
      <Footer />
    </>
  );
}
