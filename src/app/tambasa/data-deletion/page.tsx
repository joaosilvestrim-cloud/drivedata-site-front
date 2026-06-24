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

export default function DataDeletionPage() {
  return (
    <PageContainer>
      <PageContent>
        <PageTitle>Exclusão de Dados Pessoais - Tambasa Operações</PageTitle>
        <PageSubtitle>
          <strong>Última atualização:</strong> 10 de fevereiro de 2026 <br />
          <strong>Versão:</strong> 1.0
        </PageSubtitle>

        <Divider />

        <Section>
          <SectionTitle>Seu Direito à Exclusão de Dados</SectionTitle>
          <Paragraph>
            Conforme a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> -
            Lei nº 13.709/2018, especialmente o{' '}
            <strong>Artigo 18, inciso VI</strong>, você tem o direito de
            solicitar a <strong>eliminação dos seus dados pessoais</strong>{' '}
            tratados pela Tambasa Atacadistas e Drivedata LTDA.
          </Paragraph>
          <Paragraph>
            Este direito é garantido, exceto nas seguintes situações onde somos
            obrigados legalmente a manter os dados:
          </Paragraph>
          <List>
            <ListItem>Cumprimento de obrigação legal ou regulatória</ListItem>
            <ListItem>
              Exercício regular de direitos em processo judicial, administrativo
              ou arbitral
            </ListItem>
            <ListItem>
              Obrigações fiscais e trabalhistas (conforme legislação vigente)
            </ListItem>
            <ListItem>Dados anonimizados para fins estatísticos</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>O Que Será Excluído</SectionTitle>
          <Paragraph>
            Ao solicitar a exclusão, os seguintes dados pessoais serão removidos:
          </Paragraph>

          <SubSection>
            <SubSectionTitle>✓ Dados de Perfil</SubSectionTitle>
            <List>
              <ListItem>Nome</ListItem>
              <ListItem>
                E-mail (exceto se houver obrigação legal de retenção)
              </ListItem>
              <ListItem>Telefone</ListItem>
              <ListItem>Foto de perfil</ListItem>
              <ListItem>
                Documento (CPF/CNPJ) - sujeito a retenção legal
              </ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>✓ Dados Operacionais</SubSectionTitle>
            <List>
              <ListItem>Fotos capturadas por você</ListItem>
              <ListItem>Observações e comentários pessoais</ListItem>
              <ListItem>Preferências e configurações do aplicativo</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>✓ Dados Técnicos</SubSectionTitle>
            <List>
              <ListItem>Tokens de autenticação</ListItem>
              <ListItem>Tokens de notificações push</ListItem>
              <ListItem>Device ID</ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>O Que Pode Ser Mantido</SectionTitle>
          <Paragraph>
            Alguns dados podem ser{' '}
            <strong>mantidos de forma anonimizada ou por obrigação legal</strong>:
          </Paragraph>

          <SubSection>
            <SubSectionTitle>Dados Anonimizados</SubSectionTitle>
            <List>
              <ListItem>
                Estatísticas operacionais (sem identificação pessoal)
              </ListItem>
              <ListItem>Métricas de uso do aplicativo</ListItem>
              <ListItem>Dados agregados para análises</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>Retenção por Obrigação Legal</SubSectionTitle>
            <List>
              <ListItem>
                Registros fiscais e contábeis (por até 5 anos, conforme
                legislação)
              </ListItem>
              <ListItem>
                Registros trabalhistas (conforme CLT e legislação específica)
              </ListItem>
              <ListItem>
                Dados necessários para defesa em processos judiciais
              </ListItem>
              <ListItem>
                Logs de auditoria necessários para conformidade regulatória
              </ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>Como Solicitar a Exclusão</SectionTitle>
          <Paragraph>
            Para solicitar a exclusão dos seus dados pessoais, preencha o
            formulário abaixo e envie para nosso e-mail de privacidade.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>📋 Formulário de Solicitação de Exclusão de Dados</SectionTitle>
          <Paragraph>
            Por favor, preencha as informações abaixo e envie para:{' '}
            <strong>
              <Link href="mailto:privacidade@drivedatateam.com.br">
                privacidade@drivedatateam.com.br
              </Link>
            </strong>
          </Paragraph>

          <Divider />

          <SubSection>
            <SubSectionTitle>Dados do Solicitante</SubSectionTitle>
            <Paragraph>
              <strong>Nome Completo:</strong>
              <br />
              _______________________________________________________
            </Paragraph>
            <Paragraph>
              <strong>E-mail:</strong>
              <br />
              _______________________________________________________
            </Paragraph>
            <Paragraph>
              <strong>Telefone:</strong>
              <br />
              _______________________________________________________
            </Paragraph>
            <Paragraph>
              <strong>Documento (CPF ou CNPJ):</strong>
              <br />
              _______________________________________________________
            </Paragraph>
            <Paragraph>
              <strong>Tipo de Vínculo com a Tambasa:</strong>
              <br />☐ Ex-colaborador
              <br />☐ Colaborador atual solicitando desligamento
              <br />☐ Parceiro/Prestador de serviço
              <br />☐ Outro: _______________________
            </Paragraph>
            <Paragraph>
              <strong>Data de Desligamento (se aplicável):</strong>
              <br />
              _______________________________________________________
            </Paragraph>
          </SubSection>

          <Divider />

          <SubSection>
            <SubSectionTitle>Dados da Solicitação</SubSectionTitle>
            <Paragraph>
              <strong>Motivo da Solicitação (opcional):</strong>
              <br />
              _______________________________________________________
              <br />
              _______________________________________________________
              <br />
              _______________________________________________________
            </Paragraph>
            <Paragraph>
              <strong>Confirmo que:</strong>
              <br />☐ Li e compreendi que alguns dados podem ser mantidos por
              obrigação legal
              <br />☐ Entendo que esta ação é irreversível
              <br />☐ Confirmo que os dados fornecidos são verdadeiros
              <br />☐ Autorizo a Tambasa a validar minha identidade antes de
              processar a solicitação
            </Paragraph>
            <Paragraph>
              <strong>Data da Solicitação:</strong>
              <br />
              _______________________________________________________
            </Paragraph>
            <Paragraph>
              <strong>
                Assinatura (se enviado digitalmente, digite seu nome completo):
              </strong>
              <br />
              _______________________________________________________
            </Paragraph>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>📧 Como Enviar a Solicitação</SectionTitle>

          <SubSection>
            <SubSectionTitle>Opção 1: E-mail (Recomendado)</SubSectionTitle>
            <Paragraph>Envie este formulário preenchido para:</Paragraph>
            <Paragraph>
              <strong>E-mail:</strong>{' '}
              <Link href="mailto:privacidade@drivedatateam.com.br">
                privacidade@drivedatateam.com.br
              </Link>
              <br />
              <strong>Assunto:</strong> Solicitação de Exclusão de Dados - [Seu
              Nome]
            </Paragraph>
            <Paragraph>Você pode:</Paragraph>
            <List>
              <ListItem>Copiar este formulário e preencher em um e-mail</ListItem>
              <ListItem>
                Preencher em um documento Word/PDF e anexar
              </ListItem>
              <ListItem>Imprimir, preencher, escanear e enviar por e-mail</ListItem>
            </List>
          </SubSection>

          <SubSection>
            <SubSectionTitle>Opção 2: Presencial (se aplicável)</SubSectionTitle>
            <Paragraph>
              Você pode entregar a solicitação presencialmente no endereço:
            </Paragraph>
            <CompanyInfo>
              <CompanyName>Tambasa Atacadistas</CompanyName>
              <CompanyDetails>
                Av Municipal Manoel Jacinto Coelho Jr, S/N - Tapera
              </CompanyDetails>
              <CompanyDetails>CEP: 32.060-514 - Contagem/MG</CompanyDetails>
            </CompanyInfo>
            <Paragraph>
              <strong>Setor:</strong> Recursos Humanos ou Departamento de TI
            </Paragraph>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>⏱️ Prazo de Atendimento</SectionTitle>
          <Paragraph>
            Sua solicitação será analisada e processada em até{' '}
            <strong>15 dias úteis</strong> a partir do recebimento.
          </Paragraph>
          <Paragraph>Você receberá uma confirmação por e-mail assim que:</Paragraph>
          <List>
            <ListItem>✉️ Recebermos sua solicitação</ListItem>
            <ListItem>✅ Validarmos sua identidade</ListItem>
            <ListItem>🗑️ Concluirmos a exclusão dos dados</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>🔒 Verificação de Identidade</SectionTitle>
          <Paragraph>
            Para garantir a segurança dos seus dados, podemos solicitar
            documentos adicionais para verificar sua identidade antes de
            processar a exclusão.
          </Paragraph>
          <Paragraph>Isso pode incluir:</Paragraph>
          <List>
            <ListItem>Cópia de documento de identidade (RG ou CNH)</ListItem>
            <ListItem>Selfie segurando documento</ListItem>
            <ListItem>Confirmação de informações cadastrais</ListItem>
          </List>
          <InfoBox>
            <Paragraph>
              <strong>Importante:</strong> Estes documentos serão utilizados
              APENAS para validação e serão descartados após a confirmação.
            </Paragraph>
          </InfoBox>
        </Section>

        <Section>
          <SectionTitle>⚠️ Consequências da Exclusão</SectionTitle>
          <Paragraph>Ao solicitar a exclusão dos seus dados:</Paragraph>
          <List>
            <ListItem>
              ❌ Você <strong>perderá acesso imediato</strong> ao aplicativo
              Tambasa Operações
            </ListItem>
            <ListItem>
              ❌ Não será possível <strong>recuperar os dados</strong>{' '}
              posteriormente
            </ListItem>
            <ListItem>
              ❌ <strong>Histórico operacional</strong> será removido ou
              anonimizado
            </ListItem>
            <ListItem>
              ⚠️ Se houver <strong>obrigações legais pendentes</strong>, alguns
              dados podem ser mantidos
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>📞 Dúvidas ou Problemas</SectionTitle>
          <Paragraph>
            Se você tiver dúvidas sobre o processo de exclusão de dados ou
            precisar de assistência, entre em contato:
          </Paragraph>

          <SubSection>
            <SubSectionTitle>
              Encarregado de Proteção de Dados (DPO)
            </SubSectionTitle>
            <Paragraph>
              <strong>E-mail:</strong>{' '}
              <Link href="mailto:privacidade@drivedatateam.com.br">
                privacidade@drivedatateam.com.br
              </Link>
              <br />
              <strong>Telefone:</strong> A ser definido
              <br />
              <strong>Horário de atendimento:</strong> Segunda a sexta, das 8h às
              18h
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>Suporte Técnico</SubSectionTitle>
            <Paragraph>
              <strong>E-mail:</strong>{' '}
              <Link href="mailto:suporte@drivedatateam.com.br">
                suporte@drivedatateam.com.br
              </Link>
              <br />
              <strong>Telefone:</strong> A ser definido
            </Paragraph>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>🏛️ Seus Direitos Além da Exclusão</SectionTitle>
          <Paragraph>
            Além do direito à exclusão, você também tem outros direitos
            garantidos pela LGPD:
          </Paragraph>

          <SubSection>
            <SubSectionTitle>Direito de Acesso</SubSectionTitle>
            <Paragraph>
              Solicitar informações sobre quais dados pessoais mantemos sobre
              você.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>Direito de Correção</SubSectionTitle>
            <Paragraph>
              Solicitar correção de dados incompletos, inexatos ou desatualizados.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>Direito de Portabilidade</SubSectionTitle>
            <Paragraph>
              Solicitar seus dados em formato estruturado e de uso comum.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>Direito de Oposição</SubSectionTitle>
            <Paragraph>
              Opor-se ao tratamento de dados em determinadas situações.
            </Paragraph>
          </SubSection>

          <SubSection>
            <SubSectionTitle>Direito de Informação</SubSectionTitle>
            <Paragraph>
              Obter informações sobre as entidades públicas e privadas com as
              quais compartilhamos seus dados.
            </Paragraph>
          </SubSection>

          <InfoBox>
            <Paragraph>
              <strong>
                Para exercer qualquer um desses direitos, utilize os mesmos
                canais de contato indicados acima.
              </strong>
            </Paragraph>
          </InfoBox>
        </Section>

        <Section>
          <SectionTitle>📋 Checklist Antes de Solicitar</SectionTitle>
          <Paragraph>Antes de enviar sua solicitação de exclusão, verifique:</Paragraph>
          <List>
            <ListItem>
              Você realmente deseja excluir seus dados permanentemente?
            </ListItem>
            <ListItem>
              Você fez backup de informações importantes (se aplicável)?
            </ListItem>
            <ListItem>
              Você entende que alguns dados podem ser mantidos por obrigação
              legal?
            </ListItem>
            <ListItem>
              Você preencheu todos os campos obrigatórios do formulário?
            </ListItem>
            <ListItem>
              Os dados fornecidos no formulário estão corretos?
            </ListItem>
            <ListItem>
              Você tem acesso ao e-mail informado para receber confirmações?
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>📜 Base Legal</SectionTitle>
          <Paragraph>Esta página foi elaborada em conformidade com:</Paragraph>
          <List>
            <ListItem>
              <strong>LGPD</strong> - Lei nº 13.709/2018 (Lei Geral de Proteção
              de Dados)
            </ListItem>
            <ListItem>
              <strong>Marco Civil da Internet</strong> - Lei nº 12.965/2014
            </ListItem>
            <ListItem>
              <strong>Código de Defesa do Consumidor</strong> - Lei nº 8.078/1990
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>🔗 Links Relacionados</SectionTitle>
          <List>
            <ListItem>
              <Link href="/tambasa/privacy-policy">Política de Privacidade</Link>
            </ListItem>
            <ListItem>
              <Link href="/tambasa/terms-of-use">Termos de Uso</Link>
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Informações das Empresas</SectionTitle>

          <SubSection>
            <CompanyInfo>
              <CompanyName>Tambasa Atacadistas</CompanyName>
              <CompanyDetails>CNPJ: 17.359.233/0001-88</CompanyDetails>
              <CompanyDetails>
                Endereço: Av Municipal Manoel Jacinto Coelho Jr, S/N - Tapera
              </CompanyDetails>
              <CompanyDetails>CEP: 32.060-514 - Contagem/MG</CompanyDetails>
            </CompanyInfo>

            <CompanyInfo>
              <CompanyName>Drivedata LTDA (Desenvolvedora)</CompanyName>
              <CompanyDetails>CNPJ: 55.175.790/0001-38</CompanyDetails>
              <CompanyDetails>
                Endereço: Al Rio Negro, 503, Sala 2020 - Alphaville Centro
                Industrial e Empresarial
              </CompanyDetails>
              <CompanyDetails>CEP: 06.454-000 - Barueri/SP</CompanyDetails>
            </CompanyInfo>
          </SubSection>
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
