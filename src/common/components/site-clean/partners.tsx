'use client';

// Portal do Parceiro (/parceiros). Textos em pt, en, es e fr.
// O envio não muda: JSON para /api/parceria, com os mesmos campos,
// honeypot (website2) e aceite.
import { useState, type FormEvent } from 'react';
import {
  COMPANY_SIZES,
  DATA_MATURITY,
  HOW_HEARD,
  PARTNERSHIP_TYPES,
  type PartnershipType,
} from '@/common/model/partner-application.model';
import { useCopy, useLang, type Copy, type Lang } from './i18n';
import { CleanShell } from './shell';
import { Icon, PageHero, SectionHead } from './ui';
import s from './clean.module.css';
import f from './jobs.module.css';
import p from './partners.module.css';

type Item = { title: string; body: string };
type Model = { title: string; body: string; for: string };

// Mesma ordem dos textos em OFFER de cada idioma.
const OFFER_ICONS = [
  'M21 12a9 9 0 1 1-2.64-6.36L21 8M21 3v5h-5',
  'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5',
  'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5',
  'M3 4h18M5 4v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4M12 16v4M8 21h8',
  'M22 10L12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5',
  'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
];

// Mensagens de erro guardadas no estado ficam em português (as mesmas do servidor);
// na tela, cada uma é trocada pela versão do idioma atual.
const PT_ERRORS = {
  generic: 'Não conseguimos enviar seu contato. Tente novamente em instantes.',
  invalid: 'Envio inválido.',
  tooMany: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  required: 'Preencha empresa, seu nome e um e-mail válido.',
  consent: 'Precisamos do seu aceite para guardar os dados do contato.',
};
type ErrorKey = keyof typeof PT_ERRORS;

const PT = {
  heroTitle: 'Leve inteligência de dados para a sua carteira.',
  heroLead: 'Se você já atende empresas que precisam organizar dados, criar painéis ou modernizar a infraestrutura, a DriveData entra como o time técnico por trás. Você mantém a relação com o cliente. A gente entrega o projeto.',
  ctaPrimary: 'Quero ser parceiro',
  ctaSecondary: 'Ver modelos de parceria',
  factsAria: 'O programa em números',
  facts: [
    { value: '4 modelos', label: 'Da indicação simples ao white label completo.' },
    { value: '2 dias úteis', label: 'Prazo para responder quem se cadastra aqui.' },
    { value: '5 dias úteis', label: 'Prazo para devolver proposta e estimativa ao seu cliente.' },
  ],
  modelsTitle: 'Escolha o modelo que combina com a sua operação.',
  modelsLead: 'Você pode começar por um e migrar para outro conforme a parceria amadurece.',
  idealFor: 'Ideal para',
  pick: 'Quero este modelo',
  pickAria: (title: string) => `Quero o modelo ${title}`,
  models: {
    indicacao: {
      title: 'Indicação',
      body: 'Você apresenta o cliente e a DriveData conduz a venda e a entrega. Você acompanha o processo e recebe comissão sobre o contrato fechado.',
      for: 'consultores, contadores e profissionais com rede em empresas médias e grandes.',
    },
    revenda: {
      title: 'Revenda',
      body: 'Você vende com a sua marca na frente e a DriveData executa o projeto como time técnico, sem aparecer para o cliente final.',
      for: 'agências, integradoras e casas de software que querem ampliar o portfólio sem montar equipe.',
    },
    implementacao: {
      title: 'Implementação',
      body: 'Você executa parte do projeto junto com o nosso time, usando a mesma metodologia, as mesmas ferramentas e revisão técnica compartilhada.',
      for: 'consultorias de dados e BI que já têm equipe e querem escalar a entrega.',
    },
    tecnologica: {
      title: 'Tecnológica',
      body: 'Sua plataforma ganha uma camada de dados e analytics, e a nossa base de clientes passa a conhecer a sua solução.',
      for: 'fabricantes de software, ERPs e provedores de nuvem.',
    },
    outro: { title: 'Outro modelo', body: '', for: '' },
  } as Record<PartnershipType, Model>,
  offerTitle: 'O que você recebe como parceiro.',
  offerLead: 'Nada de cadastro que morre num portal. A parceria só funciona se você vender, então o apoio é concreto.',
  offer: [
    { title: 'Comissão recorrente', body: 'Enquanto o contrato do cliente estiver ativo, não só no primeiro mês.' },
    { title: 'Apoio técnico na pré-venda', body: 'Nosso time entra com você na reunião e responde o que o cliente perguntar.' },
    { title: 'Proposta rápida', body: 'Escopo, estimativa e proposta formal em até cinco dias úteis.' },
    { title: 'Material comercial', body: 'Apresentações e casos de uso que você pode levar com a sua marca.' },
    { title: 'Treinamento do seu time', body: 'Capacitação nas soluções que vendemos, para você falar com propriedade.' },
    { title: 'Contato direto', body: 'Uma pessoa responsável pela sua conta, sem fila de atendimento.' },
  ] as Item[],
  stepsTitle: 'Como funciona.',
  steps: [
    { title: 'Você se cadastra', body: 'Conta o que sua empresa faz e qual modelo de parceria procura.' },
    { title: 'Conversamos', body: 'Uma reunião de 30 minutos para entender sua carteira e alinhar o modelo.' },
    { title: 'Assinamos', body: 'Contrato de parceria com regras claras de comissão e confidencialidade.' },
    { title: 'Primeira oportunidade', body: 'Você traz o primeiro caso e entramos junto na reunião com o cliente.' },
  ] as Item[],
  formTitle: 'Demonstre seu interesse.',
  formLead: 'Preencha o formulário e respondemos em até dois dias úteis.',
  formAside: 'Prefere falar direto com alguém do comercial? Escreva para o e-mail abaixo.',
  successTitle: 'Recebemos seu interesse.',
  successBody: 'Obrigado. Nosso time comercial responde em até dois dias úteis, no e-mail que você informou.',
  requiredNote: 'Campos com * são obrigatórios.',
  type: 'Modelo de parceria que procura',
  company: 'Nome da empresa',
  cnpj: 'CNPJ (opcional)',
  website: 'Site da empresa',
  websiteHint: 'empresa.com.br',
  linkedin: 'LinkedIn da empresa',
  contactName: 'Seu nome',
  contactRole: 'Seu cargo',
  email: 'E-mail corporativo',
  phone: 'Telefone ou WhatsApp',
  region: 'Onde atua',
  regionHint: 'Ex.: São Paulo e interior',
  segment: 'Segmento principal da sua carteira',
  segmentHint: 'Ex.: indústria, varejo, logística',
  size: 'Tamanho da empresa',
  sizeOption: (range: string) => `${range} pessoas`,
  choose: 'Selecione',
  maturity: 'Sua empresa já trabalha com dados ou BI?',
  maturityOptions: {
    'ja-atua': 'Sim, já é o nosso negócio',
    parcialmente: 'Em parte, com projetos pontuais',
    'nao-atua': 'Ainda não, seria novidade',
  } as Record<(typeof DATA_MATURITY)[number], string>,
  message: 'Conte sobre sua operação e o que espera da parceria',
  messageHint: 'Que tipo de cliente você atende hoje e onde a DriveData poderia entrar.',
  howHeard: 'Como conheceu a DriveData?',
  howHeardOptions: {
    linkedin: 'LinkedIn',
    indicacao: 'Indicação de alguém',
    busca: 'Busca no Google',
    evento: 'Evento ou palestra',
    cliente: 'Sou ou fui cliente',
    outro: 'Outro',
  } as Record<(typeof HOW_HEARD)[number], string>,
  consent: 'Autorizo a DriveData a guardar meus dados para tratar desta parceria, conforme a',
  privacy: 'Política de Privacidade',
  submit: 'Enviar interesse',
  sending: 'Enviando…',
  errors: PT_ERRORS as Record<ErrorKey, string>,
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    heroTitle: 'Bring data intelligence to your own client base.',
    heroLead: 'If you already serve companies that need to organise data, build dashboards or modernise infrastructure, DriveData steps in as the technical team behind you. You keep the client relationship. We deliver the project.',
    ctaPrimary: 'Become a partner',
    ctaSecondary: 'See partnership models',
    factsAria: 'The program in numbers',
    facts: [
      { value: '4 models', label: 'From a simple referral to full white label.' },
      { value: '2 business days', label: 'How long we take to answer whoever signs up here.' },
      { value: '5 business days', label: 'How long we take to send your client a proposal and estimate.' },
    ],
    modelsTitle: 'Pick the model that fits your operation.',
    modelsLead: 'You can start with one and move to another as the partnership matures.',
    idealFor: 'Best for',
    pick: 'Choose this model',
    pickAria: (title) => `Choose the ${title} model`,
    models: {
      indicacao: {
        title: 'Referral',
        body: 'You introduce the client and DriveData runs the sale and the delivery. You follow the process and earn commission on the signed contract.',
        for: 'consultants, accountants and professionals with a network in mid-size and large companies.',
      },
      revenda: {
        title: 'Reseller',
        body: 'You sell under your own brand and DriveData runs the project as your technical team, without appearing to the end client.',
        for: 'agencies, integrators and software houses that want a wider portfolio without hiring a team.',
      },
      implementacao: {
        title: 'Implementation',
        body: 'You deliver part of the project alongside our team, using the same methodology, the same tools and shared technical review.',
        for: 'data and BI consultancies that already have a team and want to scale delivery.',
      },
      tecnologica: {
        title: 'Technology',
        body: 'Your platform gains a data and analytics layer, and our client base gets to know your solution.',
        for: 'software vendors, ERPs and cloud providers.',
      },
      outro: { title: 'Another model', body: '', for: '' },
    },
    offerTitle: 'What you get as a partner.',
    offerLead: 'No sign-up form that dies inside a portal. The partnership only works if you sell, so the support is concrete.',
    offer: [
      { title: 'Recurring commission', body: 'For as long as the client contract is active, not just the first month.' },
      { title: 'Technical pre-sales support', body: 'Our team joins your meeting and answers whatever the client asks.' },
      { title: 'Fast proposal', body: 'Scope, estimate and formal proposal within five business days.' },
      { title: 'Sales material', body: 'Decks and use cases you can present under your own brand.' },
      { title: 'Training for your team', body: 'Enablement on the solutions we sell, so you can speak with authority.' },
      { title: 'Direct contact', body: 'One person accountable for your account, no support queue.' },
    ],
    stepsTitle: 'How it works.',
    steps: [
      { title: 'You sign up', body: 'Tell us what your company does and which partnership model you want.' },
      { title: 'We talk', body: 'A 30-minute call to understand your client base and agree on the model.' },
      { title: 'We sign', body: 'A partnership agreement with clear commission and confidentiality terms.' },
      { title: 'First opportunity', body: 'You bring the first case and we join the client meeting with you.' },
    ],
    formTitle: 'Register your interest.',
    formLead: 'Fill in the form and we answer within two business days.',
    formAside: 'Rather talk to someone on the sales team directly? Write to the address below.',
    successTitle: 'We got your message.',
    successBody: 'Thank you. Our sales team replies within two business days, to the email you provided.',
    requiredNote: 'Fields marked * are required.',
    type: 'Partnership model you are after',
    company: 'Company name',
    cnpj: 'Tax ID (optional)',
    website: 'Company website',
    websiteHint: 'company.com',
    linkedin: 'Company LinkedIn',
    contactName: 'Your name',
    contactRole: 'Your role',
    email: 'Work email',
    phone: 'Phone or WhatsApp',
    region: 'Where you operate',
    regionHint: 'e.g. Toronto and area',
    segment: 'Main segment of your client base',
    segmentHint: 'e.g. manufacturing, retail, logistics',
    size: 'Company size',
    sizeOption: (range) => `${range} people`,
    choose: 'Select',
    maturity: 'Does your company already work with data or BI?',
    maturityOptions: {
      'ja-atua': 'Yes, it is our core business',
      parcialmente: 'Partly, on specific projects',
      'nao-atua': 'Not yet, it would be new',
    },
    message: 'Tell us about your operation and what you expect from the partnership',
    messageHint: 'What kind of client you serve today and where DriveData could fit.',
    howHeard: 'How did you hear about DriveData?',
    howHeardOptions: {
      linkedin: 'LinkedIn',
      indicacao: 'Someone referred us',
      busca: 'Google search',
      evento: 'Event or talk',
      cliente: 'I am or was a client',
      outro: 'Other',
    },
    consent: 'I allow DriveData to keep my data to handle this partnership, as described in the',
    privacy: 'Privacy Policy',
    submit: 'Send interest',
    sending: 'Sending…',
    errors: {
      generic: 'We could not send your message. Please try again in a moment.',
      invalid: 'Invalid submission.',
      tooMany: 'Too many attempts. Please wait a few minutes and try again.',
      required: 'Enter the company, your name and a valid email.',
      consent: 'We need your consent to keep your contact data.',
    },
  },
  es: {
    heroTitle: 'Lleva inteligencia de datos a tu cartera de clientes.',
    heroLead: 'Si ya atiendes empresas que necesitan organizar datos, crear paneles o modernizar la infraestructura, DriveData entra como el equipo técnico detrás de ti. Tú mantienes la relación con el cliente. Nosotros entregamos el proyecto.',
    ctaPrimary: 'Quiero ser socio',
    ctaSecondary: 'Ver modelos de alianza',
    factsAria: 'El programa en números',
    facts: [
      { value: '4 modelos', label: 'Desde la simple recomendación hasta el white label completo.' },
      { value: '2 días hábiles', label: 'Plazo para responder a quien se registra aquí.' },
      { value: '5 días hábiles', label: 'Plazo para enviar propuesta y estimación a tu cliente.' },
    ],
    modelsTitle: 'Elige el modelo que encaja con tu operación.',
    modelsLead: 'Puedes empezar por uno y pasar a otro a medida que la alianza madura.',
    idealFor: 'Ideal para',
    pick: 'Quiero este modelo',
    pickAria: (title) => `Quiero el modelo ${title}`,
    models: {
      indicacao: {
        title: 'Recomendación',
        body: 'Tú presentas al cliente y DriveData conduce la venta y la entrega. Acompañas el proceso y recibes comisión sobre el contrato cerrado.',
        for: 'consultores, contadores y profesionales con red en empresas medianas y grandes.',
      },
      revenda: {
        title: 'Reventa',
        body: 'Vendes con tu marca al frente y DriveData ejecuta el proyecto como equipo técnico, sin aparecer ante el cliente final.',
        for: 'agencias, integradoras y casas de software que quieren ampliar el portafolio sin montar equipo.',
      },
      implementacao: {
        title: 'Implementación',
        body: 'Ejecutas parte del proyecto junto a nuestro equipo, con la misma metodología, las mismas herramientas y revisión técnica compartida.',
        for: 'consultoras de datos y BI que ya tienen equipo y quieren escalar la entrega.',
      },
      tecnologica: {
        title: 'Tecnológica',
        body: 'Tu plataforma gana una capa de datos y analítica, y nuestra base de clientes conoce tu solución.',
        for: 'fabricantes de software, ERPs y proveedores de nube.',
      },
      outro: { title: 'Otro modelo', body: '', for: '' },
    },
    offerTitle: 'Qué recibes como socio.',
    offerLead: 'Nada de un registro que muere en un portal. La alianza solo funciona si vendes, así que el apoyo es concreto.',
    offer: [
      { title: 'Comisión recurrente', body: 'Mientras el contrato del cliente esté activo, no solo el primer mes.' },
      { title: 'Apoyo técnico en preventa', body: 'Nuestro equipo entra contigo a la reunión y responde lo que el cliente pregunte.' },
      { title: 'Propuesta rápida', body: 'Alcance, estimación y propuesta formal en hasta cinco días hábiles.' },
      { title: 'Material comercial', body: 'Presentaciones y casos de uso que puedes llevar con tu marca.' },
      { title: 'Capacitación de tu equipo', body: 'Formación en las soluciones que vendemos, para que hables con propiedad.' },
      { title: 'Contacto directo', body: 'Una persona responsable de tu cuenta, sin fila de atención.' },
    ],
    stepsTitle: 'Cómo funciona.',
    steps: [
      { title: 'Te registras', body: 'Cuentas qué hace tu empresa y qué modelo de alianza buscas.' },
      { title: 'Conversamos', body: 'Una reunión de 30 minutos para entender tu cartera y alinear el modelo.' },
      { title: 'Firmamos', body: 'Contrato de alianza con reglas claras de comisión y confidencialidad.' },
      { title: 'Primera oportunidad', body: 'Traes el primer caso y entramos contigo a la reunión con el cliente.' },
    ],
    formTitle: 'Registra tu interés.',
    formLead: 'Completa el formulario y respondemos en hasta dos días hábiles.',
    formAside: '¿Prefieres hablar directo con alguien de comercial? Escribe al correo de abajo.',
    successTitle: 'Recibimos tu interés.',
    successBody: 'Gracias. Nuestro equipo comercial responde en hasta dos días hábiles, al correo que indicaste.',
    requiredNote: 'Los campos con * son obligatorios.',
    type: 'Modelo de alianza que buscas',
    company: 'Nombre de la empresa',
    cnpj: 'Identificación fiscal (opcional)',
    website: 'Sitio de la empresa',
    websiteHint: 'empresa.com',
    linkedin: 'LinkedIn de la empresa',
    contactName: 'Tu nombre',
    contactRole: 'Tu cargo',
    email: 'Correo corporativo',
    phone: 'Teléfono o WhatsApp',
    region: 'Dónde operas',
    regionHint: 'Ej.: Ciudad de México y área',
    segment: 'Segmento principal de tu cartera',
    segmentHint: 'Ej.: industria, retail, logística',
    size: 'Tamaño de la empresa',
    sizeOption: (range) => `${range} personas`,
    choose: 'Selecciona',
    maturity: '¿Tu empresa ya trabaja con datos o BI?',
    maturityOptions: {
      'ja-atua': 'Sí, es nuestro negocio',
      parcialmente: 'En parte, con proyectos puntuales',
      'nao-atua': 'Todavía no, sería algo nuevo',
    },
    message: 'Cuéntanos sobre tu operación y qué esperas de la alianza',
    messageHint: 'Qué tipo de cliente atiendes hoy y dónde podría entrar DriveData.',
    howHeard: '¿Cómo conociste a DriveData?',
    howHeardOptions: {
      linkedin: 'LinkedIn',
      indicacao: 'Alguien nos recomendó',
      busca: 'Búsqueda en Google',
      evento: 'Evento o charla',
      cliente: 'Soy o fui cliente',
      outro: 'Otro',
    },
    consent: 'Autorizo a DriveData a guardar mis datos para tratar esta alianza, según la',
    privacy: 'Política de Privacidad',
    submit: 'Enviar interés',
    sending: 'Enviando…',
    errors: {
      generic: 'No pudimos enviar tu contacto. Inténtalo de nuevo en unos instantes.',
      invalid: 'Envío inválido.',
      tooMany: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
      required: 'Completa la empresa, tu nombre y un correo válido.',
      consent: 'Necesitamos tu autorización para guardar los datos de contacto.',
    },
  },
  fr: {
    heroTitle: 'Apportez l’intelligence des données à votre portefeuille.',
    heroLead: 'Si vous accompagnez déjà des entreprises qui doivent organiser leurs données, créer des tableaux de bord ou moderniser leur infrastructure, DriveData devient l’équipe technique derrière vous. Vous gardez la relation client. Nous livrons le projet.',
    ctaPrimary: 'Devenir partenaire',
    ctaSecondary: 'Voir les modèles de partenariat',
    factsAria: 'Le programme en chiffres',
    facts: [
      { value: '4 modèles', label: 'De la simple recommandation au white label complet.' },
      { value: '2 jours ouvrés', label: 'Délai pour répondre à qui s’inscrit ici.' },
      { value: '5 jours ouvrés', label: 'Délai pour envoyer une proposition et une estimation à votre client.' },
    ],
    modelsTitle: 'Choisissez le modèle adapté à votre activité.',
    modelsLead: 'Vous pouvez commencer par l’un et passer à l’autre à mesure que le partenariat mûrit.',
    idealFor: 'Idéal pour',
    pick: 'Choisir ce modèle',
    pickAria: (title) => `Choisir le modèle ${title}`,
    models: {
      indicacao: {
        title: 'Recommandation',
        body: 'Vous présentez le client et DriveData mène la vente et la livraison. Vous suivez le processus et touchez une commission sur le contrat signé.',
        for: 'consultants, comptables et professionnels disposant d’un réseau dans les moyennes et grandes entreprises.',
      },
      revenda: {
        title: 'Revente',
        body: 'Vous vendez sous votre propre marque et DriveData réalise le projet comme équipe technique, sans apparaître auprès du client final.',
        for: 'agences, intégrateurs et éditeurs qui veulent élargir leur offre sans constituer une équipe.',
      },
      implementacao: {
        title: 'Implémentation',
        body: 'Vous réalisez une partie du projet avec notre équipe, avec la même méthodologie, les mêmes outils et une revue technique partagée.',
        for: 'cabinets de conseil en données et BI qui ont déjà une équipe et veulent passer à l’échelle.',
      },
      tecnologica: {
        title: 'Technologique',
        body: 'Votre plateforme gagne une couche données et analytique, et notre base de clients découvre votre solution.',
        for: 'éditeurs de logiciels, ERP et fournisseurs cloud.',
      },
      outro: { title: 'Un autre modèle', body: '', for: '' },
    },
    offerTitle: 'Ce que vous recevez comme partenaire.',
    offerLead: 'Pas d’inscription qui meurt dans un portail. Le partenariat ne marche que si vous vendez, donc le soutien est concret.',
    offer: [
      { title: 'Commission récurrente', body: 'Tant que le contrat du client est actif, pas seulement le premier mois.' },
      { title: 'Appui technique en avant-vente', body: 'Notre équipe vous accompagne en réunion et répond aux questions du client.' },
      { title: 'Proposition rapide', body: 'Périmètre, estimation et proposition formelle sous cinq jours ouvrés.' },
      { title: 'Supports commerciaux', body: 'Présentations et cas d’usage que vous pouvez porter sous votre marque.' },
      { title: 'Formation de votre équipe', body: 'Montée en compétence sur les solutions que nous vendons, pour en parler avec assurance.' },
      { title: 'Contact direct', body: 'Une personne responsable de votre compte, sans file d’attente.' },
    ],
    stepsTitle: 'Comment ça marche.',
    steps: [
      { title: 'Vous vous inscrivez', body: 'Vous nous dites ce que fait votre entreprise et quel modèle vous cherchez.' },
      { title: 'Nous échangeons', body: 'Un rendez-vous de 30 minutes pour comprendre votre portefeuille et choisir le modèle.' },
      { title: 'Nous signons', body: 'Un contrat de partenariat avec des règles claires de commission et de confidentialité.' },
      { title: 'Première opportunité', body: 'Vous apportez le premier dossier et nous allons ensemble en réunion client.' },
    ],
    formTitle: 'Manifestez votre intérêt.',
    formLead: 'Remplissez le formulaire et nous répondons sous deux jours ouvrés.',
    formAside: 'Vous préférez parler directement au commercial ? Écrivez à l’adresse ci-dessous.',
    successTitle: 'Nous avons bien reçu votre message.',
    successBody: 'Merci. Notre équipe commerciale répond sous deux jours ouvrés, à l’adresse que vous avez indiquée.',
    requiredNote: 'Les champs marqués * sont obligatoires.',
    type: 'Modèle de partenariat recherché',
    company: 'Nom de l’entreprise',
    cnpj: 'Numéro d’identification (facultatif)',
    website: 'Site de l’entreprise',
    websiteHint: 'entreprise.com',
    linkedin: 'LinkedIn de l’entreprise',
    contactName: 'Votre nom',
    contactRole: 'Votre fonction',
    email: 'E-mail professionnel',
    phone: 'Téléphone ou WhatsApp',
    region: 'Où vous opérez',
    regionHint: 'Ex. : Montréal et région',
    segment: 'Segment principal de votre portefeuille',
    segmentHint: 'Ex. : industrie, distribution, logistique',
    size: 'Taille de l’entreprise',
    sizeOption: (range) => `${range} personnes`,
    choose: 'Sélectionnez',
    maturity: 'Votre entreprise travaille-t-elle déjà avec les données ou la BI ?',
    maturityOptions: {
      'ja-atua': 'Oui, c’est notre métier',
      parcialmente: 'En partie, sur des projets ponctuels',
      'nao-atua': 'Pas encore, ce serait nouveau',
    },
    message: 'Parlez-nous de votre activité et de ce que vous attendez du partenariat',
    messageHint: 'Quel type de client vous servez aujourd’hui et où DriveData pourrait intervenir.',
    howHeard: 'Comment avez-vous connu DriveData ?',
    howHeardOptions: {
      linkedin: 'LinkedIn',
      indicacao: 'Quelqu’un nous a recommandés',
      busca: 'Recherche Google',
      evento: 'Événement ou conférence',
      cliente: 'Je suis ou j’ai été client',
      outro: 'Autre',
    },
    consent: 'J’autorise DriveData à conserver mes données pour traiter ce partenariat, conformément à la',
    privacy: 'Politique de confidentialité',
    submit: 'Envoyer',
    sending: 'Envoi…',
    errors: {
      generic: 'Nous n’avons pas pu envoyer votre message. Réessayez dans un instant.',
      invalid: 'Envoi invalide.',
      tooMany: 'Trop de tentatives. Patientez quelques minutes et réessayez.',
      required: 'Indiquez l’entreprise, votre nom et un e-mail valide.',
      consent: 'Nous avons besoin de votre accord pour conserver vos coordonnées.',
    },
  },
};

/** Mensagem guardada (em português) no idioma atual. Desconhecida: original em pt, genérica nos outros. */
const showError = (msg: string, lang: Lang, t: typeof PT) => {
  const key = (Object.keys(PT_ERRORS) as ErrorKey[]).find((k) => PT_ERRORS[k] === msg);
  if (key) return t.errors[key];
  return lang === 'pt' ? msg : t.errors.generic;
};

const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` });

export function PartnersClean() {
  const t = useCopy(COPY);
  const [type, setType] = useState<PartnershipType>('indicacao');

  // "Quero este modelo": pré-seleciona no formulário e leva até ele.
  const pick = (v: PartnershipType) => {
    setType(v);
    const form = document.getElementById('interesse');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    form?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('pt-type')?.focus({ preventScroll: true }), reduce ? 0 : 500);
  };

  return (
    <CleanShell current="partners">
      <PageHero title={t.heroTitle} lead={t.heroLead}>
        <a href="#interesse" className={s.btn}>{t.ctaPrimary}</a>
        <a href="#modelos" className={s.link}>{t.ctaSecondary}</a>
      </PageHero>

      <section className={`${s.band} ${s.bandTight}`} aria-label={t.factsAria}>
        <div className={s.wrap}>
          <ul className={p.facts}>
            {t.facts.map((x, i) => (
              <li key={i} className={p.fact} data-reveal style={delay(i * 80)}>
                <span className={p.factValue}>{x.value}</span>
                <p className={s.muted}>{x.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="modelos" className={`${s.band} ${s.bandFog} ${p.anchor}`} aria-labelledby="modelos-titulo">
        <div className={s.wrap}>
          <SectionHead id="modelos-titulo" title={t.modelsTitle}>
            {t.modelsLead}
          </SectionHead>
          <ul className={p.models}>
            {PARTNERSHIP_TYPES.filter((v) => v !== 'outro').map((v, i) => (
              <li key={v} data-reveal style={delay((i % 2) * 90)}>
                <article className={p.model} aria-labelledby={`modelo-${v}`}>
                  <h3 id={`modelo-${v}`} className={p.modelTitle}>{t.models[v].title}</h3>
                  <p className={s.muted}>{t.models[v].body}</p>
                  <p className={p.modelFor}><strong>{t.idealFor}</strong> {t.models[v].for}</p>
                  <button type="button" className={p.modelPick} onClick={() => pick(v)} aria-label={t.pickAria(t.models[v].title)}>
                    {t.pick}<span className={p.pickArrow} aria-hidden="true">→</span>
                  </button>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={s.band} aria-labelledby="oferta-titulo">
        <div className={s.wrap}>
          <div className={s.split} data-reveal>
            <h2 id="oferta-titulo" className={s.h2}>{t.offerTitle}</h2>
            <p className={s.lead}>{t.offerLead}</p>
          </div>
          <ul className={p.offer}>
            {t.offer.map((o, i) => (
              <li key={i} className={p.offerItem} data-reveal style={delay((i % 3) * 80)}>
                <span className={s.icon}><Icon d={OFFER_ICONS[i]} /></span>
                <h3 className={s.h3}>{o.title}</h3>
                <p className={s.muted}>{o.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${s.band} ${s.bandInk}`} aria-labelledby="passos-titulo">
        <div className={s.wrap}>
          <h2 id="passos-titulo" className={s.h2} data-reveal>{t.stepsTitle}</h2>
          <ol className={`${s.steps} ${p.steps4}`}>
            {t.steps.map((st, i) => (
              <li key={i} className={s.step} data-reveal style={delay(i * 110)}>
                <span className={s.stepNum} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.h3}>{st.title}</h3>
                <p>{st.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="interesse" className={`${s.band} ${s.bandFog} ${p.anchor}`} aria-labelledby="interesse-titulo">
        <div className={`${s.wrap} ${p.formGrid}`}>
          <div className={p.formAside} data-reveal>
            <h2 id="interesse-titulo" className={s.h2}>{t.formTitle}</h2>
            <p className={s.lead}>{t.formLead}</p>
            <p className={s.muted}>{t.formAside}</p>
            <a className={s.link} href="mailto:comercial@drivedata.com.br">comercial@drivedata.com.br</a>
          </div>
          <div className={p.formCard} data-reveal style={delay(100)}>
            <PartnerForm type={type} onType={setType} />
          </div>
        </div>
      </section>
    </CleanShell>
  );
}

const ERROR_GENERIC = PT_ERRORS.generic;

function PartnerForm({ type, onType }: { type: PartnershipType; onType: (v: PartnershipType) => void }) {
  const t = useCopy(COPY);
  const lang = useLang();
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (state === 'done') {
    return (
      <div className={p.success} role="status">
        <span className={s.icon}><Icon d="M5 12.5l4.5 4.5L19 7.5" /></span>
        <h3 className={p.successTitle}>{t.successTitle}</h3>
        <p>{t.successBody}</p>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(fd.entries());
    payload.consent = fd.get('consent') === 'true';
    payload.page = window.location.pathname;

    setState('sending');
    setError(null);
    try {
      const r = await fetch('/api/parceria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        setError(res.error || ERROR_GENERIC);
        setState('idle');
        return;
      }
      setState('done');
    } catch {
      setError(ERROR_GENERIC);
      setState('idle');
    }
  };

  const req = <span className={f.req} aria-hidden="true">*</span>;

  return (
    <form className={f.form} onSubmit={onSubmit} aria-describedby={error ? 'pt-erro' : undefined}>
      <p className={f.requiredNote}>{t.requiredNote}</p>
      <div className={f.fields}>
        <div className={`${f.field} ${f.full}`}>
          <label htmlFor="pt-type" className={f.label}>{t.type}{req}</label>
          <select id="pt-type" name="partnershipType" className={f.input} required value={type}
            onChange={(e) => onType(e.target.value as PartnershipType)}>
            {PARTNERSHIP_TYPES.map((v) => <option key={v} value={v}>{t.models[v].title}</option>)}
          </select>
        </div>

        <div className={f.field}>
          <label htmlFor="pt-company" className={f.label}>{t.company}{req}</label>
          <input id="pt-company" name="company" className={f.input} required autoComplete="organization" maxLength={160} />
        </div>
        <div className={f.field}>
          <label htmlFor="pt-cnpj" className={f.label}>{t.cnpj}</label>
          <input id="pt-cnpj" name="cnpj" className={f.input} maxLength={30} />
        </div>
        <div className={f.field}>
          <label htmlFor="pt-site" className={f.label}>{t.website}</label>
          <input id="pt-site" name="website" className={f.input} inputMode="url" placeholder={t.websiteHint} maxLength={300} />
        </div>
        <div className={f.field}>
          <label htmlFor="pt-linkedin" className={f.label}>{t.linkedin}</label>
          <input id="pt-linkedin" name="linkedinUrl" className={f.input} inputMode="url" placeholder="linkedin.com/company/…" maxLength={300} />
        </div>

        <div className={f.field}>
          <label htmlFor="pt-name" className={f.label}>{t.contactName}{req}</label>
          <input id="pt-name" name="contactName" className={f.input} required autoComplete="name" maxLength={160} />
        </div>
        <div className={f.field}>
          <label htmlFor="pt-role" className={f.label}>{t.contactRole}</label>
          <input id="pt-role" name="contactRole" className={f.input} autoComplete="organization-title" maxLength={120} />
        </div>
        <div className={f.field}>
          <label htmlFor="pt-email" className={f.label}>{t.email}{req}</label>
          <input id="pt-email" name="email" type="email" className={f.input} required autoComplete="email" maxLength={200} />
        </div>
        <div className={f.field}>
          <label htmlFor="pt-phone" className={f.label}>{t.phone}</label>
          <input id="pt-phone" name="phone" type="tel" className={f.input} autoComplete="tel" maxLength={40} />
        </div>

        <div className={f.field}>
          <label htmlFor="pt-region" className={f.label}>{t.region}</label>
          <input id="pt-region" name="region" className={f.input} placeholder={t.regionHint} maxLength={160} />
        </div>
        <div className={f.field}>
          <label htmlFor="pt-segment" className={f.label}>{t.segment}</label>
          <input id="pt-segment" name="segment" className={f.input} placeholder={t.segmentHint} maxLength={160} />
        </div>

        <div className={f.field}>
          <label htmlFor="pt-size" className={f.label}>{t.size}</label>
          <select id="pt-size" name="companySize" className={f.input} defaultValue="">
            <option value="">{t.choose}</option>
            {COMPANY_SIZES.map((v) => <option key={v} value={v}>{t.sizeOption(v)}</option>)}
          </select>
        </div>
        <div className={f.field}>
          <label htmlFor="pt-maturity" className={f.label}>{t.maturity}</label>
          <select id="pt-maturity" name="dataMaturity" className={f.input} defaultValue="">
            <option value="">{t.choose}</option>
            {DATA_MATURITY.map((v) => <option key={v} value={v}>{t.maturityOptions[v]}</option>)}
          </select>
        </div>

        <div className={`${f.field} ${f.full}`}>
          <label htmlFor="pt-message" className={f.label}>{t.message}</label>
          <textarea id="pt-message" name="message" className={f.input} maxLength={3000}
            placeholder={t.messageHint} />
        </div>

        <div className={`${f.field} ${f.full}`}>
          <label htmlFor="pt-heard" className={f.label}>{t.howHeard}</label>
          <select id="pt-heard" name="howHeard" className={f.input} defaultValue="">
            <option value="">{t.choose}</option>
            {HOW_HEARD.map((v) => <option key={v} value={v}>{t.howHeardOptions[v]}</option>)}
          </select>
        </div>
      </div>

      <div className={f.honey} aria-hidden="true">
        <label>
          Website
          <input name="website2" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={f.consent}>
        <input id="pt-consent" name="consent" type="checkbox" value="true" required />
        <label htmlFor="pt-consent">
          {t.consent}{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">{t.privacy}</a>.
        </label>
      </div>

      {error && <p id="pt-erro" className={f.formError} role="alert">{showError(error, lang, t)}</p>}

      <button type="submit" className={`${s.btn} ${f.submit}`} disabled={state === 'sending'}>
        {state === 'sending' ? t.sending : t.submit}
      </button>
    </form>
  );
}
