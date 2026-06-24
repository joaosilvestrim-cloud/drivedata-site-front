'use client';

import { useState } from 'react';
import {
  PageContainer,
  PageContent,
  PageTitle,
  PageSubtitle,
  Section,
  SectionTitle,
  Paragraph,
  Divider,
  FormContainer,
  FormGroup,
  Label,
  Input,
  Textarea,
  SubmitButton,
  SuccessMessage,
  InfoBox,
} from './styles';

interface FormState {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

const initialState: FormState = {
  nome: '',
  email: '',
  telefone: '',
  mensagem: '',
};

export default function SupportPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <PageContainer>
      <PageContent>
        <PageTitle>Suporte</PageTitle>
        <PageSubtitle>
          Precisa de ajuda? Preencha o formulário abaixo e nossa equipe entrará
          em contato em breve.
        </PageSubtitle>

        <Divider />

        <Section>
          <SectionTitle>Entre em Contato</SectionTitle>

          <InfoBox>
            <Paragraph>
              Nossa equipe de suporte está disponível para ajudá-lo com dúvidas
              sobre o aplicativo Tambasa Operações, problemas técnicos,
              solicitações de dados ou qualquer outra questão.
            </Paragraph>
          </InfoBox>

          {submitted ? (
            <SuccessMessage>
              <strong>Mensagem enviada com sucesso!</strong>
              Obrigado pelo contato. Nossa equipe analisará sua solicitação e
              retornará em até 2 dias úteis.
            </SuccessMessage>
          ) : (
            <FormContainer onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={form.telefone}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="mensagem">Mensagem *</Label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  placeholder="Descreva sua dúvida ou solicitação..."
                  value={form.mensagem}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={isLoading} isLoading={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar mensagem'}
              </SubmitButton>
            </FormContainer>
          )}
        </Section>
      </PageContent>
    </PageContainer>
  );
}
