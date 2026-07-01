'use client';

import { Container } from '@/common/components/container';
import { SITE_CONTACT } from '@/common/config/site';
import { httpCreateContactRequest } from '@/modules/contact/api/create-contact-request/http-create-contact-request';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ContactDescription,
  ContactDetails,
  ContactForm,
  ContactIcon,
  ContactInfo,
  ContactItem,
  ContactSectionContainer,
  ContactSectionContent,
  ContactText,
  ContactTitle,
  FormButton,
  FormError,
  FormField,
  FormGlobalError,
  FormInput,
  FormLabel,
  FormSuccess,
  FormTextarea,
} from './styles';
import { ContactFormData, ContactSectionProps } from './types';

export const ContactSection = ({ className }: ContactSectionProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contactSection.form.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contactSection.form.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contactSection.form.emailInvalid');
    }

    if (!formData.company.trim()) {
      newErrors.company = t('contactSection.form.companyRequired');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contactSection.form.messageRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setServerError(null);
    setIsSuccess(false);
    setIsSubmitting(true);

    try {
      await httpCreateContactRequest(formData);

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
      });
      setErrors({});

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setServerError(
        error instanceof Error
          ? error.message
          : t('contactSection.form.error'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  return (
    <ContactSectionContainer id="contato" className={className}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="contactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="30.36%" style={{ stopColor: '#54DA89', stopOpacity: 1 }} />
            <stop offset="132.34%" style={{ stopColor: '#0A96EC', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
      <Container>
        <ContactSectionContent>
          <ContactInfo>
            <ContactTitle>{t('contactSection.title')}</ContactTitle>
            <ContactDescription>
              {t('contactSection.description')}
            </ContactDescription>

            <ContactDetails>
              <ContactItem>
                <ContactIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </ContactIcon>
                <ContactText>{SITE_CONTACT.phone}</ContactText>
              </ContactItem>

              <ContactItem>
                <ContactIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="10"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </ContactIcon>
                <ContactText>
                  {SITE_CONTACT.addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < SITE_CONTACT.addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </ContactText>
              </ContactItem>
            </ContactDetails>
          </ContactInfo>

          <ContactForm onSubmit={handleSubmit}>
            {serverError && <FormGlobalError>{serverError}</FormGlobalError>}
            {isSuccess && (
              <FormSuccess>
                {t('contactSection.form.success')}
              </FormSuccess>
            )}

            <FormField>
              <FormLabel htmlFor="name">{t('contactSection.form.name')}</FormLabel>
              <FormInput
                id="name"
                name="name"
                type="text"
                placeholder={t('contactSection.form.namePlaceholder')}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <FormError>{errors.name}</FormError>}
            </FormField>

            <FormField>
              <FormLabel htmlFor="email">{t('contactSection.form.email')}</FormLabel>
              <FormInput
                id="email"
                name="email"
                type="email"
                placeholder={t('contactSection.form.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <FormError>{errors.email}</FormError>}
            </FormField>

            <FormField>
              <FormLabel htmlFor="company">{t('contactSection.form.company')}</FormLabel>
              <FormInput
                id="company"
                name="company"
                type="text"
                placeholder={t('contactSection.form.companyPlaceholder')}
                value={formData.company}
                onChange={handleChange}
              />
              {errors.company && <FormError>{errors.company}</FormError>}
            </FormField>

            <FormField>
              <FormLabel htmlFor="message">{t('contactSection.form.message')}</FormLabel>
              <FormTextarea
                id="message"
                name="message"
                placeholder={t('contactSection.form.messagePlaceholder')}
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <FormError>{errors.message}</FormError>}
            </FormField>

            <FormButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('contactSection.form.submitting') : t('contactSection.form.submit')}
            </FormButton>
          </ContactForm>
        </ContactSectionContent>
      </Container>
    </ContactSectionContainer>
  );
};

