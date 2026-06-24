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

export default function TermsOfUsePage() {
  return (
    <PageContainer>
      <PageContent>
        <PageTitle>Termos de Uso - Tambasa Operações</PageTitle>
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
        </Section>

        <Section>
          <SectionTitle>2. Aceitação dos Termos</SectionTitle>
          <Paragraph>
            Ao acessar e utilizar o aplicativo <strong>Tambasa Operações</strong>, você
            concorda integralmente com estes Termos de Uso.
          </Paragraph>
          <InfoBox>
            <Paragraph>
              <strong>
                Se você não concordar com qualquer parte destes termos, não
                utilize o aplicativo.
              </strong>
            </Paragraph>
          </InfoBox>
          <Paragraph>
            A utilização continuada do aplicativo após atualizações destes
            Termos implica em aceitação das novas condições.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>3. Descrição do Serviço</SectionTitle>

          <SubSection>
            <SubSectionTitle>3.1 Propósito</SubSectionTitle>
            <Paragraph>
              O <strong>Tambasa Operações</strong> é um aplicativo corporativo
              desenvolvido para gerenciamento de operações logísticas, incluindo:
            </Paragraph>
            <List>
              <ListItem>Controle de agendamentos em docas</ListItem>
              <ListItem>Escanear QR codes de docas e veículos</ListItem>
              <ListItem>Check-in e check-out de veículos</ListItem>
              <ListItem>Validação de lacres</ListItem>
              <ListItem>Upload de fotos para validação de processos</ListItem>
              <ListItem>
                Gerenciamento de vagas e áreas de estacionamento
              </ListItem>
              <ListItem>Notificações sobre operações</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>3.2 Natureza do Aplicativo</SubSectionTitle>
            <Paragraph>
              Este é um <strong>aplicativo de uso corporativo interno</strong>,
              destinado exclusivamente a:
            </Paragraph>
            <List>
              <ListItem>
                Colaboradores autorizados da Tambasa Atacadistas
              </ListItem>
              <ListItem>Parceiros e prestadores de serviço autorizados</ListItem>
              <ListItem>
                Operadores, validadores, motoristas e manobristas com
                credenciais fornecidas pela empresa
              </ListItem>
            </List>
            <InfoBox>
              <Paragraph>
                <strong>
                  Este aplicativo NÃO é destinado ao público em geral.
                </strong>
              </Paragraph>
            </InfoBox>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>4. Elegibilidade e Cadastro</SectionTitle>

          <SubSection>
            <SubSectionTitle>4.1 Requisitos de Elegibilidade</SubSectionTitle>
            <Paragraph>Para utilizar o aplicativo, você deve:</Paragraph>
            <List>
              <ListItem>Ter 18 anos ou mais</ListItem>
              <ListItem>
                Ser colaborador ativo da Tambasa Atacadistas ou parceiro
                autorizado
              </ListItem>
              <ListItem>
                Possuir credenciais de acesso válidas (e-mail e senha
                corporativos)
              </ListItem>
              <ListItem>
                Ter autorização formal da empresa para usar o aplicativo
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>4.2 Conta de Usuário</SubSectionTitle>
            <List>
              <ListItem>
                Seu acesso é <strong>pessoal e intransferível</strong>
              </ListItem>
              <ListItem>
                Você é responsável por manter a confidencialidade de suas
                credenciais
              </ListItem>
              <ListItem>
                <strong>Não compartilhe sua senha com terceiros</strong>
              </ListItem>
              <ListItem>
                Você é responsável por todas as atividades realizadas sob sua
                conta
              </ListItem>
              <ListItem>
                Notifique imediatamente a empresa caso suspeite de uso não
                autorizado
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>4.3 Suspensão e Encerramento</SubSectionTitle>
            <Paragraph>A Tambasa Atacadistas reserva-se o direito de:</Paragraph>
            <List>
              <ListItem>Suspender ou encerrar sua conta a qualquer momento</ListItem>
              <ListItem>
                Recusar acesso ao aplicativo sem aviso prévio
              </ListItem>
              <ListItem>
                Revogar credenciais em caso de desligamento ou término de
                contrato
              </ListItem>
              <ListItem>
                Bloquear acesso em caso de uso indevido ou violação destes
                Termos
              </ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>5. Uso Aceitável</SectionTitle>

          <SubSection>
            <SubSectionTitle>5.1 Você Concorda em:</SubSectionTitle>
            <List>
              <ListItem>
                Utilizar o aplicativo apenas para fins profissionais e
                autorizados
              </ListItem>
              <ListItem>Fornecer informações verdadeiras e precisas</ListItem>
              <ListItem>Manter seus dados de perfil atualizados</ListItem>
              <ListItem>
                Seguir todas as políticas e procedimentos internos da empresa
              </ListItem>
              <ListItem>Utilizar o aplicativo de forma ética e responsável</ListItem>
              <ListItem>
                Capturar fotos e escanear QR codes apenas durante operações
                legítimas
              </ListItem>
              <ListItem>Respeitar a privacidade de terceiros</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>5.2 Você NÃO Pode:</SubSectionTitle>
            <List>
              <ListItem>
                Compartilhar suas credenciais de acesso com terceiros
              </ListItem>
              <ListItem>
                Utilizar o aplicativo para fins pessoais não autorizados
              </ListItem>
              <ListItem>
                Acessar áreas restritas ou dados que não lhe foram autorizados
              </ListItem>
              <ListItem>
                Realizar engenharia reversa, descompilar ou modificar o
                aplicativo
              </ListItem>
              <ListItem>
                Burlar medidas de segurança ou controles de acesso
              </ListItem>
              <ListItem>
                Utilizar o aplicativo para atividades ilegais ou fraudulentas
              </ListItem>
              <ListItem>Inserir dados falsos ou enganosos</ListItem>
              <ListItem>
                Interferir no funcionamento do aplicativo ou dos servidores
              </ListItem>
              <ListItem>
                Realizar ataques de segurança, testar vulnerabilidades sem
                autorização
              </ListItem>
              <ListItem>
                Extrair dados em massa (scraping) ou usar bots/automação não
                autorizada
              </ListItem>
              <ListItem>
                Utilizar o aplicativo de forma que prejudique outros usuários ou
                a operação
              </ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>6. Propriedade Intelectual</SectionTitle>

          <SubSection>
            <SubSectionTitle>6.1 Direitos de Propriedade</SubSectionTitle>
            <Paragraph>
              Todos os direitos sobre o aplicativo{' '}
              <strong>Tambasa Operações</strong>, incluindo:
            </Paragraph>
            <List>
              <ListItem>Código-fonte</ListItem>
              <ListItem>Design e interface</ListItem>
              <ListItem>Logos e marcas</ListItem>
              <ListItem>Conteúdo e documentação</ListItem>
              <ListItem>Funcionalidades e recursos</ListItem>
            </List>
            <Paragraph>
              São de propriedade exclusiva da <strong>Tambasa Atacadistas</strong>{' '}
              e <strong>Drivedata LTDA</strong>.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>6.2 Licença de Uso</SubSectionTitle>
            <Paragraph>
              Você recebe uma licença{' '}
              <strong>limitada, não exclusiva, não transferível e revogável</strong>{' '}
              para usar o aplicativo conforme estes Termos.
            </Paragraph>
            <Paragraph>Esta licença <strong>não lhe confere</strong>:</Paragraph>
            <List>
              <ListItem>Direitos de propriedade sobre o aplicativo</ListItem>
              <ListItem>
                Permissão para copiar, modificar ou distribuir o aplicativo
              </ListItem>
              <ListItem>Direitos de sublicenciar ou revender o acesso</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>6.3 Dados e Conteúdo Gerado</SubSectionTitle>
            <Paragraph>
              Os dados operacionais gerados através do aplicativo (agendamentos,
              check-ins, fotos, etc.) são de propriedade da{' '}
              <strong>Tambasa Atacadistas</strong> para fins operacionais e legais.
            </Paragraph>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>7. Responsabilidades e Limitações</SectionTitle>

          <SubSection>
            <SubSectionTitle>7.1 Disponibilidade do Serviço</SubSectionTitle>
            <Paragraph>
              A Tambasa Atacadistas e Drivedata LTDA se esforçam para manter o
              aplicativo disponível, mas:
            </Paragraph>
            <List>
              <ListItem>
                <strong>Não garantimos disponibilidade ininterrupta</strong> (99%
                ou 100%)
              </ListItem>
              <ListItem>
                Pode haver manutenções programadas ou emergenciais
              </ListItem>
              <ListItem>Podem ocorrer falhas técnicas temporárias</ListItem>
              <ListItem>
                Não nos responsabilizamos por interrupções de serviço de
                terceiros (internet, servidores)
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>7.2 Limitação de Responsabilidade</SubSectionTitle>
            <Paragraph>
              <strong>Na máxima extensão permitida pela lei:</strong>
            </Paragraph>
            <List>
              <ListItem>
                O aplicativo é fornecido{' '}
                <strong>"no estado em que se encontra"</strong>
              </ListItem>
              <ListItem>
                Não garantimos que o aplicativo seja livre de erros ou falhas
              </ListItem>
              <ListItem>
                Não nos responsabilizamos por danos diretos, indiretos,
                incidentais ou consequentes
              </ListItem>
              <ListItem>
                Não nos responsabilizamos por perdas de dados causadas por falhas
                de dispositivo ou conectividade
              </ListItem>
              <ListItem>
                Não nos responsabilizamos por uso inadequado ou não autorizado do
                aplicativo
              </ListItem>
              <ListItem>
                Não garantimos que o aplicativo atenderá a todas as suas
                expectativas específicas
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>7.3 Suas Responsabilidades</SubSectionTitle>
            <Paragraph>Você é responsável por:</Paragraph>
            <List>
              <ListItem>
                Garantir que possui dispositivo compatível e conexão adequada
              </ListItem>
              <ListItem>Manter seu dispositivo seguro e atualizado</ListItem>
              <ListItem>
                Realizar backup de dados importantes (se aplicável)
              </ListItem>
              <ListItem>
                Utilizar o aplicativo conforme treinamentos e orientações
                recebidas
              </ListItem>
              <ListItem>
                Reportar problemas técnicos ou de segurança imediatamente
              </ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>8. Privacidade e Dados Pessoais</SectionTitle>
          <Paragraph>
            O tratamento de dados pessoais no aplicativo está sujeito à nossa{' '}
            <Link href="/tambasa/privacy-policy">Política de Privacidade</Link>,
            que faz parte integrante destes Termos de Uso.
          </Paragraph>
          <Paragraph>
            Ao aceitar estes Termos, você também concorda com a Política de
            Privacidade.
          </Paragraph>
          <Paragraph>
            <strong>Principais pontos:</strong>
          </Paragraph>
          <List>
            <ListItem>
              Coletamos dados necessários para operação e segurança
            </ListItem>
            <ListItem>Seguimos a LGPD (Lei Geral de Proteção de Dados)</ListItem>
            <ListItem>
              Você tem direitos sobre seus dados (acesso, correção, exclusão)
            </ListItem>
            <ListItem>Implementamos medidas de segurança adequadas</ListItem>
          </List>
          <Paragraph>
            Para mais informações, consulte a{' '}
            <Link href="/tambasa/privacy-policy">Política de Privacidade completa</Link>.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. Atualizações do Aplicativo</SectionTitle>

          <SubSection>
            <SubSectionTitle>9.1 Atualizações Automáticas</SubSectionTitle>
            <Paragraph>O aplicativo pode ser atualizado automaticamente para:</Paragraph>
            <List>
              <ListItem>Corrigir bugs e problemas de segurança</ListItem>
              <ListItem>Adicionar novas funcionalidades</ListItem>
              <ListItem>Melhorar desempenho e estabilidade</ListItem>
              <ListItem>Adequar-se a mudanças legais ou regulatórias</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>9.2 Compatibilidade</SubSectionTitle>
            <List>
              <ListItem>
                Você deve manter o aplicativo atualizado para a versão mais
                recente
              </ListItem>
              <ListItem>
                Versões antigas podem ter funcionalidades limitadas ou ser
                desativadas
              </ListItem>
              <ListItem>
                A Tambasa Atacadistas pode descontinuar suporte a versões antigas
                a qualquer momento
              </ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>10. Monitoramento e Auditoria</SectionTitle>

          <SubSection>
            <SubSectionTitle>10.1 Direito de Monitoramento</SubSectionTitle>
            <Paragraph>A Tambasa Atacadistas reserva-se o direito de:</Paragraph>
            <List>
              <ListItem>
                Monitorar o uso do aplicativo para fins de segurança e
                conformidade
              </ListItem>
              <ListItem>Auditar logs de acesso e atividades</ListItem>
              <ListItem>Analisar padrões de uso para melhorias</ListItem>
              <ListItem>
                Investigar violações de políticas ou suspeitas de uso indevido
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>10.2 Logs e Registros</SubSectionTitle>
            <Paragraph>
              Todas as atividades no aplicativo são registradas, incluindo:
            </Paragraph>
            <List>
              <ListItem>Horários de login e logout</ListItem>
              <ListItem>
                Operações realizadas (check-ins, QR codes escaneados, etc.)
              </ListItem>
              <ListItem>Fotos capturadas e enviadas</ListItem>
              <ListItem>Localização de operações (quando aplicável)</ListItem>
            </List>
            <Paragraph>Estes registros podem ser utilizados para:</Paragraph>
            <List>
              <ListItem>Auditoria operacional</ListItem>
              <ListItem>Investigações internas</ListItem>
              <ListItem>Conformidade legal e regulatória</ListItem>
              <ListItem>Resolução de disputas</ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>11. Modificações dos Termos</SectionTitle>

          <SubSection>
            <SubSectionTitle>11.1 Direito de Alteração</SubSectionTitle>
            <Paragraph>
              A Tambasa Atacadistas e Drivedata LTDA reservam-se o direito de
              modificar estes Termos de Uso a qualquer momento.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>11.2 Notificação de Mudanças</SubSectionTitle>
            <Paragraph>Quando houver alterações significativas:</Paragraph>
            <List>
              <ListItem>Você será notificado através do aplicativo</ListItem>
              <ListItem>
                A versão atualizada será disponibilizada no aplicativo
              </ListItem>
              <ListItem>A data de "Última atualização" será alterada</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>11.3 Aceitação das Mudanças</SubSectionTitle>
            <List>
              <ListItem>
                O uso continuado do aplicativo após as alterações implica em
                aceitação
              </ListItem>
              <ListItem>
                Se você não concordar com as mudanças, deve cessar o uso do
                aplicativo
              </ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>12. Rescisão</SectionTitle>

          <SubSection>
            <SubSectionTitle>12.1 Rescisão por Você</SubSectionTitle>
            <Paragraph>
              Você pode cessar o uso do aplicativo a qualquer momento:
            </Paragraph>
            <List>
              <ListItem>Desinstalando o aplicativo do seu dispositivo</ListItem>
              <ListItem>
                Solicitando desativação da sua conta (entre em contato com RH/TI)
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>12.2 Rescisão pela Tambasa</SubSectionTitle>
            <Paragraph>Seu acesso pode ser encerrado:</Paragraph>
            <List>
              <ListItem>
                Por término do vínculo empregatício ou contratual
              </ListItem>
              <ListItem>Por violação destes Termos de Uso</ListItem>
              <ListItem>Por motivos de segurança ou compliance</ListItem>
              <ListItem>
                A critério da administração, sem necessidade de justificativa
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>12.3 Efeitos da Rescisão</SubSectionTitle>
            <Paragraph>Após o encerramento:</Paragraph>
            <List>
              <ListItem>Seu acesso será imediatamente revogado</ListItem>
              <ListItem>Você deve cessar todo uso do aplicativo</ListItem>
              <ListItem>
                Dados operacionais permanecerão armazenados conforme Política de
                Privacidade
              </ListItem>
              <ListItem>
                Você pode solicitar exclusão de dados pessoais (sujeito a
                obrigações legais)
              </ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>13. Disposições Gerais</SectionTitle>

          <SubSection>
            <SubSectionTitle>13.1 Legislação Aplicável</SubSectionTitle>
            <Paragraph>
              Estes Termos são regidos pelas leis da República Federativa do
              Brasil.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>13.2 Foro</SubSectionTitle>
            <Paragraph>
              Fica eleito o foro da comarca de Contagem/MG para dirimir quaisquer
              controvérsias oriundas destes Termos, com exclusão de qualquer
              outro, por mais privilegiado que seja.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>13.3 Independência das Cláusulas</SubSectionTitle>
            <Paragraph>
              Se qualquer disposição destes Termos for considerada inválida ou
              inexequível, as demais disposições permanecerão em pleno vigor e
              efeito.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>13.4 Integralidade do Acordo</SubSectionTitle>
            <Paragraph>
              Estes Termos de Uso, juntamente com a Política de Privacidade,
              constituem o acordo integral entre você e a Tambasa Atacadistas
              quanto ao uso do aplicativo.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>13.5 Não Renúncia</SubSectionTitle>
            <Paragraph>
              A falha em exercer ou fazer cumprir qualquer direito ou disposição
              destes Termos não constituirá renúncia a tal direito ou disposição.
            </Paragraph>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>14. Suporte e Contato</SectionTitle>

          <SubSection>
            <SubSectionTitle>14.1 Suporte Técnico</SubSectionTitle>
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
            <SubSectionTitle>14.2 Questões sobre os Termos</SubSectionTitle>
            <Paragraph>Para dúvidas sobre estes Termos de Uso:</Paragraph>
            <Paragraph>
              <strong>E-mail:</strong>{' '}
              <Link href="mailto:juridico@drivedatateam.com.br">
                juridico@drivedatateam.com.br
              </Link>
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>14.3 Questões sobre Privacidade</SubSectionTitle>
            <Paragraph>
              Para questões relacionadas à privacidade e proteção de dados:
            </Paragraph>
            <Paragraph>
              <strong>E-mail:</strong>{' '}
              <Link href="mailto:privacidade@drivedatateam.com.br">
                privacidade@drivedatateam.com.br
              </Link>
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>14.4 Endereços</SubSectionTitle>
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
          <SectionTitle>15. Declaração de Aceitação</SectionTitle>
          <Paragraph>
            Ao utilizar o aplicativo <strong>Tambasa Operações</strong>, você
            declara que:
          </Paragraph>
          <List>
            <ListItem>
              Leu e compreendeu estes Termos de Uso integralmente
            </ListItem>
            <ListItem>
              Concorda com todas as condições aqui estabelecidas
            </ListItem>
            <ListItem>Leu e concorda com a Política de Privacidade</ListItem>
            <ListItem>
              É colaborador autorizado ou parceiro da Tambasa Atacadistas
            </ListItem>
            <ListItem>Tem 18 anos ou mais</ListItem>
            <ListItem>
              Utilizará o aplicativo apenas para fins profissionais autorizados
            </ListItem>
            <ListItem>Manterá a confidencialidade de suas credenciais</ListItem>
            <ListItem>Seguirá as políticas e procedimentos da empresa</ListItem>
          </List>
        </Section>

        <Divider />

        <Paragraph style={{ textAlign: 'center', color: '#e0e0e0' }}>
          <strong>Tambasa Atacadistas</strong> |{' '}
          <strong>Drivedata LTDA</strong>
          <br />© 2026 - Todos os direitos reservados
        </Paragraph>

        <Paragraph style={{ textAlign: 'center', color: '#c4c4c4', marginTop: '1rem' }}>
          <strong>Versão 1.0 - Vigente a partir de 10 de fevereiro de 2026</strong>
        </Paragraph>
      </PageContent>
    </PageContainer>
  );
}
