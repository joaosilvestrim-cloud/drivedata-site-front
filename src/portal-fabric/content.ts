/**
 * Copy e dados da landing "Portal DriveData / Microsoft Fabric".
 * Edite este arquivo para atualizar textos, features, comparativo e preços da
 * calculadora, sem tocar nos componentes. Copy por idioma (pt/en/fr); o país
 * (SITE_COUNTRY) define moeda e preços das capacidades Fabric.
 */

export type PortalLang = 'pt' | 'en' | 'fr';

export interface PortalCopy {
  nav: { label: string; href: string }[];
  hero: {
    eyebrow: string; title: string; subtitle: string;
    ctaPrimary: string; ctaSecondary: string; badges: string[];
    dashTitle: string;
    kpis: { value: string; label: string }[];
    bars: { label: string; value: number; tag: string }[];
  };
  pillars: {
    eyebrow: string; title: string; subtitle: string;
    items: { tag: string; title: string; desc: string; points: string[] }[];
  };
  how: {
    eyebrow: string; title: string; subtitle: string;
    steps: { title: string; desc: string }[];
  };
  arch: {
    eyebrow: string; title: string; subtitle: string;
    layers: { title: string; desc: string }[];
  };
  features: {
    eyebrow: string; title: string; subtitle: string;
    groups: { tag: string; items: { title: string; desc: string }[] }[];
  };
  roi: {
    eyebrow: string; title: string; subtitle: string;
    modelTitle: string; modelText: string; ruleTitle: string; ruleText: string;
    simTitle: string; usersLabel: string; licenseLabel: string; skuLabel: string;
    currentLabel: string; portalLabel: string; monthlyLabel: string; annualLabel: string;
    note: string;
    // Calculadora gamificada (todas as frases interpoladas usam {chaves}).
    calc: {
      levelPrefix: string;
      levels: { none: string; balance: string; good: string; high: string; max: string };
      monthlyDiff: string; savingsLine: string; negativeNote: string;
      nextGoal: string; maxLevel: string;
      scenarioTitle: string; usersHint: string;
      licenseTodayLabel: string; licenseHint: string;
      skuFieldLabel: string; skuHints: { F2: string; F4: string; F8: string; F16: string; F32: string; F64: string };
      skuRecommended: string; skuOther: string;
      regionLabel: string; base: string;
      billingLabel: string; billingReserved: string; billingPayg: string;
      billingReservedHint: string; billingPaygHint: string;
      scheduleLabel: string; scheduleLabels: { '24x7': string; comercial: string; reduzida: string };
      schedulePerMonth: string; scheduleHint: string;
      breakEvenTitle: string; rowToday: string; rowPortal: string;
      youSave: string; difference: string; breakEvenNote: string;
      eqUserZero: string; eqLicenses: string; eqMonths: string; eqCapacity: string;
      footBase: string; footRegionExtra: string; footReserved: string; footPayg: string; footConv: string;
      cta: string;
      beEquilibrium: string; beYou: string; beUsers: string; beLicenses: string; beCapacity: string;
    };
  };
  compare: {
    eyebrow: string; title: string; colTraditional: string; colPortal: string;
    rows: { crit: string; trad: string; portal: string }[];
  };
  proof: {
    eyebrow: string; title: string; subtitle: string;
    stats: { value: string; label: string }[];
    compatTitle: string; compat: string[];
  };
  video: { eyebrow: string; title: string; subtitle: string };
  install: {
    eyebrow: string; title: string; subtitle: string;
    timeLabel: string; timeValue: string;
    modesTitle: string; modes: { title: string; desc: string }[];
    prereqTitle: string; prereqs: string[];
    stepsTitle: string; steps: { title: string; desc: string }[];
    cta: string;
  };
  faq: { eyebrow: string; title: string; subtitle: string; items: { q: string; a: string }[] };
  cta: { title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string; badges: string[] };
  footer: { tagline: string; rights: string };
}

// ── Preços por país (calculadora). Estimativas para simulação. ──
export interface SkuOption { id: string; label: string; price: number }
export interface CountryPricing {
  currency: string;           // símbolo exibido
  locale: string;             // para Intl.NumberFormat
  defaultUsers: number;
  defaultLicense: number;     // custo por usuário/mês da licença atual
  skus: SkuOption[];
}

export const PRICING: Record<'BR' | 'CA', CountryPricing> = {
  BR: {
    currency: 'R$', locale: 'pt-BR', defaultUsers: 200, defaultLicense: 80,
    skus: [
      { id: 'F2',  label: 'F2',  price: 5000 },
      { id: 'F4',  label: 'F4',  price: 10000 },
      { id: 'F8',  label: 'F8',  price: 20000 },
      { id: 'F16', label: 'F16', price: 40000 },
      { id: 'F32', label: 'F32', price: 80000 },
    ],
  },
  CA: {
    currency: 'CA$', locale: 'en-CA', defaultUsers: 200, defaultLicense: 14,
    skus: [
      { id: 'F2',  label: 'F2',  price: 1250 },
      { id: 'F4',  label: 'F4',  price: 2500 },
      { id: 'F8',  label: 'F8',  price: 5000 },
      { id: 'F16', label: 'F16', price: 10000 },
      { id: 'F32', label: 'F32', price: 20000 },
    ],
  },
};

// ── Copy ──
export const PORTAL_COPY: Record<PortalLang, PortalCopy> = {
  pt: {
    nav: [
      { label: 'Pilares', href: '#pilares' },
      { label: 'Arquitetura', href: '#arquitetura' },
      { label: 'Funcionalidades', href: '#features' },
      { label: 'Calculadora ROI', href: '#roi' },
      { label: 'Comparativo', href: '#comparativo' },
    ],
    hero: {
      eyebrow: 'Powered by Microsoft Fabric',
      title: 'O portal que transforma como sua empresa consome dados',
      subtitle: 'O Portal DriveData entrega uma camada centralizada sobre sua capacidade Microsoft Fabric, com experiência de usuário superior, governança granular e redução expressiva de custos de licenciamento.',
      ctaPrimary: 'Agendar demonstração',
      ctaSecondary: 'Calcular economia',
      badges: ['Microsoft Fabric', 'Governança LGPD', 'Economia de Licenças'],
      dashTitle: 'Painel de impacto, Portal DriveData',
      kpis: [
        { value: '73%', label: 'Redução de custo' },
        { value: '+340', label: 'Usuários ativos' },
        { value: '100%', label: 'Cobertura de auditoria' },
      ],
      bars: [
        { label: 'Capacidade Fabric utilizada com eficiência', value: 82, tag: 'Otimizado' },
        { label: 'Usuários via portal (sem licença individual)', value: 91, tag: 'Economia ativa' },
        { label: 'Workspaces com governança aplicada', value: 100, tag: 'Conformidade' },
      ],
    },
    pillars: {
      eyebrow: 'Por que DriveData',
      title: 'Três pilares, um portal',
      subtitle: 'O Portal DriveData foi projetado em torno de três eixos estratégicos que respondem às principais dores das equipes de dados corporativas.',
      items: [
        {
          tag: 'Usabilidade', title: 'Experiência centrada no usuário',
          desc: 'Interface unificada e personalizada que facilita o consumo de relatórios Power BI para todos os perfis, do analista ao executivo.',
          points: [
            'Portal white-label com identidade visual da empresa',
            'Acesso single sign-on (SSO) via Microsoft Entra ID',
            'Catálogo de relatórios com busca e favoritos',
            'Interface responsiva: desktop, tablet e mobile',
            'Onboarding guiado e suporte contextual in-app',
          ],
        },
        {
          tag: 'Governança', title: 'Controle, auditoria e conformidade',
          desc: 'Governança granular sobre quem acessa o quê, quando e como, com rastreabilidade completa para LGPD, auditorias internas e certificações.',
          points: [
            'Controle de acesso por perfil, grupo e workspace',
            'Log de auditoria completo (quem, o quê, quando)',
            'Políticas de expiração e revisão de acessos',
            'Conformidade LGPD com mascaramento de dados sensíveis',
            'Alertas de acesso suspeito e relatórios de compliance',
          ],
        },
        {
          tag: 'Economia de Licenças', title: 'Redução real de custos com Fabric',
          desc: 'Elimine licenças Power BI individuais desnecessárias aproveitando a capacidade Fabric já contratada para servir todos os consumidores de relatórios.',
          points: [
            'Usuários Free acessam relatórios via capacidade Fabric',
            'Economia de até 80% em licenças Power BI Pro/PPU',
            'Relatório de uso para otimização contínua de capacidade',
            'ROI mensurável desde o primeiro mês',
            'Escalabilidade sem custo adicional por usuário',
          ],
        },
      ],
    },
    how: {
      eyebrow: 'Como funciona',
      title: 'Da capacidade Fabric ao usuário final',
      subtitle: 'O Portal DriveData atua como camada inteligente entre a capacidade Microsoft Fabric da sua organização e os consumidores de dados, simplificando acesso, aplicando governança e reduzindo custos automaticamente.',
      steps: [
        { title: 'Capacidade Fabric', desc: 'Sua capacidade Microsoft Fabric (F-SKU ou P-SKU) já contratada serve como base de processamento e renderização.' },
        { title: 'Portal DriveData', desc: 'O portal gerencia identidades, permissões, catálogo de relatórios e rastreabilidade de acessos em uma única camada.' },
        { title: 'Políticas & Governança', desc: 'Regras de acesso, auditoria e conformidade são aplicadas automaticamente sem intervenção manual do time de TI.' },
        { title: 'Usuário Final', desc: 'Colaboradores acessam relatórios com login SSO, sem necessidade de licença Power BI Pro individual.' },
      ],
    },
    arch: {
      eyebrow: 'Arquitetura Técnica',
      title: 'Construído sobre Microsoft Fabric',
      subtitle: 'O Portal DriveData integra-se nativamente ao ecossistema Microsoft, usando as APIs oficiais do Fabric e do Power BI para garantir segurança, confiabilidade e compliance.',
      layers: [
        { title: 'Capacidade Microsoft Fabric', desc: 'F-SKU ou P-SKU como base de processamento e renderização dos relatórios.' },
        { title: 'APIs oficiais Fabric & Power BI', desc: 'Embed nativo e autenticação via APIs suportadas pela Microsoft, sem gambiarra.' },
        { title: 'Camada Portal DriveData', desc: 'Identidades, permissões, catálogo, políticas de governança e log de auditoria.' },
        { title: 'Experiência do usuário', desc: 'SSO Entra ID, relatórios embutidos, catálogo com busca e acesso mobile/PWA.' },
      ],
    },
    features: {
      eyebrow: 'Funcionalidades',
      title: 'Tudo que o portal entrega',
      subtitle: 'Recursos organizados pelos três pilares, cobrindo experiência, governança e economia de ponta a ponta.',
      groups: [
        {
          tag: 'Usabilidade',
          items: [
            { title: 'Embed nativo Power BI & Fabric', desc: 'Relatórios Power BI e visuais Fabric renderizados diretamente no portal via API oficial de embed, sem redirecionamentos ou trocas de contexto.' },
            { title: 'Experiência mobile-first', desc: 'Interface totalmente responsiva com suporte a gestos touch, visualização otimizada para telas pequenas e opção de PWA para instalação no dispositivo.' },
            { title: 'Login SSO sem fricção', desc: 'Integração nativa com Microsoft Entra ID para autenticação single sign-on. Usuários acessam com as mesmas credenciais corporativas.' },
            { title: 'Painel executivo de adoção', desc: 'Dashboard interno mostrando quais relatórios são mais acessados, tempo de sessão, engajamento por departamento e tendências de uso.' },
          ],
        },
        {
          tag: 'Governança',
          items: [
            { title: 'Controle de acesso granular (RBAC)', desc: 'Permissões por usuário, grupo, departamento ou workspace com herança de grupos do Active Directory e revisão periódica automatizada.' },
            { title: 'Log de auditoria completo', desc: 'Registro imutável de toda atividade: quem acessou, qual relatório, horário, dispositivo e IP, exportável para SIEM ou ferramenta de compliance.' },
            { title: 'Segurança em nível de linha (RLS)', desc: 'Row-Level Security aplicado automaticamente com base no perfil do usuário autenticado, sem configuração manual por relatório.' },
            { title: 'Conformidade LGPD e GDPR', desc: 'Mascaramento de campos sensíveis, gestão de consentimentos, relatório de titulares e exportação de evidências para auditorias regulatórias.' },
            { title: 'Alertas de acesso e anomalias', desc: 'Notificações em tempo real para acessos fora do horário, tentativas não autorizadas, volumes incomuns de consultas ou picos de exportação.' },
            { title: 'Revisão periódica de acessos', desc: 'Fluxo automatizado de revisão de permissões com aprovação do gestor responsável, eliminando acessos desnecessários.' },
          ],
        },
        {
          tag: 'Economia',
          items: [
            { title: 'Usuários Free acessam via Fabric Capacity', desc: 'Com a capacidade Fabric, usuários com licença Microsoft 365 Free podem consumir relatórios publicados, eliminando licenças Pro individuais.' },
            { title: 'Monitoramento de uso de capacidade', desc: 'Dashboards de consumo de CU (Capacity Units) em tempo real para identificar gargalos, otimizar refresh e evitar autoscaling desnecessário.' },
            { title: 'Relatório de ROI e economia acumulada', desc: 'Painel executivo com cálculo automático de economia, histórico mensal e projeção anual.' },
            { title: 'Escala sem custo adicional por usuário', desc: 'Adicione 10 ou 10.000 usuários ao portal sem incremento proporcional de custo. A capacidade suporta qualquer volume de consumidores.' },
            { title: 'Recomendações automáticas de rightsizing', desc: 'Análise contínua do padrão de uso para sugerir o SKU de capacidade ideal, evitando superdimensionamento ou degradação de performance.' },
            { title: 'Migração assistida de licenciamento', desc: 'Mapeamento dos usuários com licença Pro e plano de migração para o modelo via capacidade, com suporte técnico e simulação de impacto.' },
          ],
        },
      ],
    },
    roi: {
      eyebrow: 'Calculadora de ROI',
      title: 'Calcule sua economia real',
      subtitle: 'Veja quanto sua empresa pode economizar substituindo licenças individuais Power BI Pro pelo modelo de capacidade Fabric com Portal DriveData.',
      modelTitle: 'Como funciona o modelo',
      modelText: 'No modelo tradicional, cada usuário que precisa consumir relatórios Power BI exige uma licença Pro ou Premium Per User. Com o Portal DriveData sobre capacidade Microsoft Fabric, você contrata uma única capacidade (F-SKU) e permite que qualquer número de usuários com conta gratuita consuma relatórios, pagando somente pelo processamento utilizado.',
      ruleTitle: 'Regra geral de economia',
      ruleText: 'Para organizações com mais de 25 usuários consumidores, o modelo de capacidade Fabric + Portal DriveData é quase sempre mais econômico, com economia crescente conforme o número de usuários aumenta.',
      simTitle: 'Simule sua economia mensal',
      usersLabel: 'Usuários consumidores de relatórios',
      licenseLabel: 'Licença atual por usuário (mês)',
      skuLabel: 'Capacidade Fabric contratada (F-SKU)',
      currentLabel: 'Custo atual (licenças individuais)',
      portalLabel: 'Custo com Portal DriveData (Fabric)',
      monthlyLabel: 'Economia mensal estimada',
      annualLabel: 'Economia anual',
      note: 'Valores de referência para simulação. A economia real depende do SKU, do volume de uso e do contrato Microsoft vigente.',
      calc: {
        levelPrefix: 'Nível',
        levels: { none: 'Ainda não compensa', balance: 'Empate técnico', good: 'Economia real', high: 'Economia alta', max: 'Economia máxima' },
        monthlyDiff: 'Diferença mensal',
        savingsLine: '{pct}% de redução · {annual} por ano',
        negativeNote: 'Neste cenário a capacidade ainda custa mais que as licenças.',
        nextGoal: 'Mais {n} usuário{s} e você chega em {level}',
        maxLevel: 'Você está no nível máximo de economia',
        scenarioTitle: 'Seu cenário',
        usersHint: 'Quantas pessoas só consomem relatórios (não criam).',
        licenseTodayLabel: 'Licença que você paga hoje',
        licenseHint: '{cur} por usuário/mês. Preço de mercado do seu país, dá pra ajustar pelo seu contrato.',
        skuFieldLabel: 'Capacidade Fabric (SKU)',
        skuHints: { F2: 'times pequenos, poucos relatórios', F4: 'operação enxuta', F8: 'o mais comum em médias empresas', F16: 'muitos relatórios e refresh pesado', F32: 'operação grande', F64: 'porte enterprise' },
        skuRecommended: '★ Recomendado para {n} usuários, {hint}.',
        skuOther: '★ Para {n} usuários, o mais comum é o {rec}. O dimensionamento final depende do seu uso real.',
        regionLabel: 'Região do Azure',
        base: 'base',
        billingLabel: 'Forma de contratação',
        billingReserved: 'Reserva 1 ano', billingPayg: 'Pago pelo uso',
        billingReservedHint: 'Compromisso de 1 ano, ligada 24/7, com ~41% de desconto.',
        billingPaygHint: 'Sem compromisso e pode pausar, você paga só as horas ligadas.',
        scheduleLabel: 'Capacidade ligada',
        scheduleLabels: { '24x7': 'Ligada 24/7', comercial: 'Horário comercial (12h)', reduzida: 'Jornada (8h úteis)' },
        schedulePerMonth: '{label}, {hours}h/mês',
        scheduleHint: 'Pausar a capacidade fora do expediente derruba bastante a conta.',
        breakEvenTitle: 'Ponto de equilíbrio',
        rowToday: 'Hoje · {n} × {price}',
        rowPortal: 'Portal DriveData · {sku} em {region}',
        youSave: 'Você economiza', difference: 'Diferença',
        breakEvenNote: 'A capacidade custa o mesmo com 10 ou 10.000 usuários. Acima de {n} usuários ela já sai mais barata que as licenças.',
        eqUserZero: 'é quanto custa cada novo usuário no portal. Hoje, cada um custa {price}/mês.',
        eqLicenses: 'licenças {kind} por um ano inteiro é o que sua economia anual paga.',
        eqMonths: '{n} meses',
        eqCapacity: 'de capacidade {sku} saem de graça com o que você economiza em um ano.',
        footBase: 'Base do cálculo: capacidade Fabric a US$ {x} por CU/hora em East US',
        footRegionExtra: ' (+{p}% em {region})',
        footReserved: ' reserva de 1 ano com ~41% de desconto',
        footPayg: ' {hours}h ligadas no mês',
        footConv: ' convertida a {fx} por dólar. ',
        cta: 'Quero validar esse cenário com um especialista →',
        beEquilibrium: 'equilíbrio: {n} usuários', beYou: 'você', beUsers: '{n} usuários',
        beLicenses: 'Licenças individuais ({price}/usuário)', beCapacity: 'Capacidade Fabric (fixa)',
      },
    },
    compare: {
      eyebrow: 'Comparativo',
      title: 'Portal DriveData vs. modelo tradicional',
      colTraditional: 'Modelo Tradicional Power BI',
      colPortal: 'Portal DriveData + Fabric',
      rows: [
        { crit: 'Licença por usuário consumidor', trad: 'Power BI Pro obrigatória', portal: 'Licença Free basta' },
        { crit: 'Custo com escala de usuários', trad: 'Cresce linearmente com headcount', portal: 'Fixo pela capacidade Fabric' },
        { crit: 'Controle de acesso granular', trad: 'Limitado a workspaces e apps', portal: 'Por usuário, grupo, relatório' },
        { crit: 'Log de auditoria detalhado', trad: 'Activity Log básico (Office 365)', portal: 'Completo e exportável' },
        { crit: 'Identidade visual customizada', trad: 'Interface padrão Microsoft', portal: 'White-label completo' },
        { crit: 'SSO integrado', trad: 'Parcial (requer conta Microsoft)', portal: 'Entra ID nativo' },
        { crit: 'Catálogo de relatórios com busca', trad: 'Apenas lista de apps', portal: 'Busca, tags e favoritos' },
        { crit: 'Conformidade LGPD / GDPR', trad: 'Manual, sem suporte nativo', portal: 'Mascaramento e relatórios' },
        { crit: 'Monitoramento de uso e ROI', trad: 'Capacity Metrics básico', portal: 'Dashboard executivo completo' },
        { crit: 'Acesso mobile otimizado', trad: 'App Power BI Mobile genérico', portal: 'PWA white-label responsivo' },
      ],
    },
    proof: {
      eyebrow: 'Impacto real',
      title: 'Resultados que falam por si',
      subtitle: 'O Portal DriveData é utilizado por organizações de diferentes setores que buscaram governança, melhor experiência de usuário e redução de custos com licenciamento Power BI.',
      stats: [
        { value: '+500', label: 'usuários atendidos em média por implantação' },
        { value: '73%', label: 'de redução média em custo de licenciamento' },
        { value: '100%', label: 'de rastreabilidade e auditoria de acessos' },
        { value: '<30d', label: 'tempo médio para implantação e go-live' },
      ],
      compatTitle: 'Compatível com',
      compat: ['Microsoft Fabric F2 a F64', 'Power BI Premium P1 a P5', 'Microsoft Entra ID', 'Azure Active Directory', 'Microsoft 365', 'Power BI Embedded A-SKU'],
    },
    video: {
      eyebrow: 'Demonstração',
      title: 'Veja o Portal em ação',
      subtitle: 'Um tour rápido pelo Portal DriveData rodando sobre a capacidade Microsoft Fabric: governança, relatórios embarcados e controle de custos na prática.',
    },
    install: {
      eyebrow: 'Implantação',
      title: 'Rápido de instalar, do nosso jeito',
      subtitle: 'A instalação é feita no seu próprio ambiente Microsoft, com o nosso time ao seu lado. Nada é instalado na máquina dos usuários.',
      timeLabel: 'Tempo médio', timeValue: '1 a 2 dias úteis',
      modesTitle: 'Como instalamos',
      modes: [
        { title: 'Assistida', desc: 'Nosso time conduz a instalação de ponta a ponta, junto com o seu TI.' },
        { title: 'Guiada', desc: 'Você instala seguindo nossa documentação passo a passo, com suporte quando precisar.' },
      ],
      prereqTitle: 'Pré-requisitos',
      prereqs: [
        'Tenant Microsoft / Azure ativo',
        'Permissão de administrador global (Global Admin)',
        'Workspace do Power BI publicado',
        'Licença Power BI Pro, Premium, Fabric ou Embedded',
      ],
      stepsTitle: 'O que configuramos',
      steps: [
        { title: 'Registro de aplicação (Entra ID)', desc: 'Criamos o app e o service principal que conectam o portal ao seu Power BI com segurança.' },
        { title: 'Capacidade Fabric', desc: 'Associação da capacidade (F2 a F64) ao workspace que vai servir os relatórios.' },
        { title: 'Admin do Power BI', desc: 'Ativação das permissões de embedding e associação do workspace ao grupo de acesso.' },
        { title: 'Portal no ar', desc: 'Publicação do portal com controle de acesso por usuário, pronto para uso.' },
      ],
      cta: 'Agendar a instalação',
    },
    faq: {
      eyebrow: 'Dúvidas frequentes',
      title: 'Perguntas frequentes',
      subtitle: 'O que as empresas mais perguntam antes de começar.',
      items: [
        { q: 'É legal e está dentro das regras da Microsoft?', a: 'Sim. O portal usa o modelo oficial App Owns Data do Power BI Embedded, dentro dos termos de licenciamento da Microsoft.' },
        { q: 'Preciso instalar algo na minha máquina?', a: 'Não. Tudo roda no seu ambiente Microsoft e no navegador. Não há software para instalar no computador dos usuários.' },
        { q: 'Quanto tempo leva a instalação?', a: 'Em média de 1 a 2 dias úteis, dependendo do seu ambiente. Nosso time acompanha todo o processo.' },
        { q: 'Tem suporte depois de instalado?', a: 'Sim. Você conta com o suporte da DriveData para evolução, ajustes e novas necessidades.' },
        { q: 'Com quais capacidades funciona?', a: 'Com Microsoft Fabric (F2 a F64), Power BI Premium e Power BI Embedded.' },
      ],
    },
    cta: {
      title: 'Pronto para transformar como sua empresa consome dados?',
      subtitle: 'Agende uma demonstração gratuita do Portal DriveData e veja na prática como a capacidade Microsoft Fabric pode reduzir seus custos de licenciamento e elevar a governança de BI da sua organização.',
      ctaPrimary: 'Agendar demonstração gratuita',
      ctaSecondary: 'Falar com consultor',
      badges: ['Microsoft Fabric', 'Power BI Embedded', 'Entra ID SSO', 'LGPD Ready'],
    },
    footer: { tagline: 'Portal DriveData, Gestão de Capacidade Microsoft Fabric', rights: 'Todos os direitos reservados.' },
  },

  en: {
    nav: [
      { label: 'Pillars', href: '#pilares' },
      { label: 'Architecture', href: '#arquitetura' },
      { label: 'Features', href: '#features' },
      { label: 'ROI Calculator', href: '#roi' },
      { label: 'Comparison', href: '#comparativo' },
    ],
    hero: {
      eyebrow: 'Powered by Microsoft Fabric',
      title: 'The portal that transforms how your company consumes data',
      subtitle: 'Portal DriveData delivers a centralized layer over your Microsoft Fabric capacity, with a superior user experience, granular governance and a significant cut in licensing costs.',
      ctaPrimary: 'Book a demo',
      ctaSecondary: 'Calculate savings',
      badges: ['Microsoft Fabric', 'Privacy & Compliance', 'License Savings'],
      dashTitle: 'Impact dashboard, Portal DriveData',
      kpis: [
        { value: '73%', label: 'Cost reduction' },
        { value: '+340', label: 'Active users' },
        { value: '100%', label: 'Audit coverage' },
      ],
      bars: [
        { label: 'Fabric capacity used efficiently', value: 82, tag: 'Optimized' },
        { label: 'Users via portal (no individual license)', value: 91, tag: 'Active savings' },
        { label: 'Workspaces with governance applied', value: 100, tag: 'Compliance' },
      ],
    },
    pillars: {
      eyebrow: 'Why DriveData',
      title: 'Three pillars, one portal',
      subtitle: 'Portal DriveData was designed around three strategic axes that answer the main pain points of corporate data teams.',
      items: [
        {
          tag: 'Usability', title: 'A user-centered experience',
          desc: 'A unified, personalized interface that makes consuming Power BI reports easy for every profile, from analyst to executive.',
          points: [
            'White-label portal with your company’s branding',
            'Single sign-on (SSO) via Microsoft Entra ID',
            'Report catalog with search and favorites',
            'Responsive interface: desktop, tablet and mobile',
            'Guided onboarding and in-app contextual support',
          ],
        },
        {
          tag: 'Governance', title: 'Control, audit and compliance',
          desc: 'Granular governance over who accesses what, when and how, with full traceability for privacy law, internal audits and certifications.',
          points: [
            'Access control by profile, group and workspace',
            'Complete audit log (who, what, when)',
            'Access expiration and review policies',
            'Law 25 / PIPEDA compliance with sensitive-data masking',
            'Suspicious-access alerts and compliance reports',
          ],
        },
        {
          tag: 'License Savings', title: 'Real cost reduction with Fabric',
          desc: 'Eliminate unnecessary individual Power BI licenses by leveraging the Fabric capacity you already pay for to serve every report consumer.',
          points: [
            'Free users access reports through Fabric capacity',
            'Up to 80% savings on Power BI Pro/PPU licenses',
            'Usage reporting for continuous capacity optimization',
            'Measurable ROI from the first month',
            'Scale with no additional per-user cost',
          ],
        },
      ],
    },
    how: {
      eyebrow: 'How it works',
      title: 'From Fabric capacity to the end user',
      subtitle: 'Portal DriveData acts as an intelligent layer between your Microsoft Fabric capacity and data consumers, simplifying access, applying governance and reducing cost automatically.',
      steps: [
        { title: 'Fabric Capacity', desc: 'Your existing Microsoft Fabric capacity (F-SKU or P-SKU) serves as the processing and rendering base.' },
        { title: 'Portal DriveData', desc: 'The portal manages identities, permissions, the report catalog and access traceability in a single layer.' },
        { title: 'Policies & Governance', desc: 'Access rules, audit and compliance are applied automatically, with no manual work from the IT team.' },
        { title: 'End User', desc: 'Employees access reports with SSO login, without needing an individual Power BI Pro license.' },
      ],
    },
    arch: {
      eyebrow: 'Technical Architecture',
      title: 'Built on Microsoft Fabric',
      subtitle: 'Portal DriveData integrates natively with the Microsoft ecosystem, using the official Fabric and Power BI APIs to ensure security, reliability and compliance.',
      layers: [
        { title: 'Microsoft Fabric capacity', desc: 'F-SKU or P-SKU as the base for processing and rendering reports.' },
        { title: 'Official Fabric & Power BI APIs', desc: 'Native embed and authentication through Microsoft-supported APIs, no workarounds.' },
        { title: 'Portal DriveData layer', desc: 'Identities, permissions, catalog, governance policies and audit log.' },
        { title: 'User experience', desc: 'Entra ID SSO, embedded reports, searchable catalog and mobile/PWA access.' },
      ],
    },
    features: {
      eyebrow: 'Features',
      title: 'Everything the portal delivers',
      subtitle: 'Capabilities organized by the three pillars, covering experience, governance and savings end to end.',
      groups: [
        {
          tag: 'Usability',
          items: [
            { title: 'Native Power BI & Fabric embed', desc: 'Power BI reports and Fabric visuals rendered directly in the portal via the official embed API, with no redirects or context switches.' },
            { title: 'Mobile-first experience', desc: 'Fully responsive interface with touch-gesture support, small-screen optimization and an optional PWA for on-device installation.' },
            { title: 'Frictionless SSO login', desc: 'Native Microsoft Entra ID integration for single sign-on. Users log in with the same corporate credentials.' },
            { title: 'Executive adoption panel', desc: 'Internal dashboard showing the most-accessed reports, session time, engagement by department and usage trends.' },
          ],
        },
        {
          tag: 'Governance',
          items: [
            { title: 'Granular access control (RBAC)', desc: 'Permissions by user, group, department or workspace with Active Directory group inheritance and automated periodic review.' },
            { title: 'Complete audit log', desc: 'Immutable record of every activity: who accessed which report, when, from which device and IP, exportable to SIEM or compliance tools.' },
            { title: 'Row-Level Security (RLS)', desc: 'Row-Level Security applied automatically based on the authenticated user profile, with no manual per-report setup.' },
            { title: 'Law 25 & GDPR compliance', desc: 'Sensitive-field masking, consent management, data-subject reporting and evidence export for regulatory audits.' },
            { title: 'Access and anomaly alerts', desc: 'Real-time notifications for off-hours access, unauthorized attempts, unusual query volumes or export spikes.' },
            { title: 'Periodic access review', desc: 'Automated permission-review workflow with approval from the responsible manager, removing unnecessary access.' },
          ],
        },
        {
          tag: 'Savings',
          items: [
            { title: 'Free users access via Fabric Capacity', desc: 'With Fabric capacity, users on a Microsoft 365 Free license can consume published reports, eliminating individual Pro licenses.' },
            { title: 'Capacity usage monitoring', desc: 'Real-time CU (Capacity Units) consumption dashboards to spot bottlenecks, optimize refresh and avoid unnecessary autoscaling.' },
            { title: 'ROI and accrued savings report', desc: 'Executive panel with automatic savings calculation, monthly history and annual projection.' },
            { title: 'Scale with no per-user cost', desc: 'Add 10 or 10,000 users to the portal with no proportional cost increase. Capacity supports any volume of concurrent consumers.' },
            { title: 'Automatic rightsizing recommendations', desc: 'Continuous analysis of usage patterns to suggest the ideal capacity SKU, avoiding oversizing or performance degradation.' },
            { title: 'Assisted licensing migration', desc: 'Mapping of current Pro-licensed users and a migration plan to the capacity model, with technical support and impact simulation.' },
          ],
        },
      ],
    },
    roi: {
      eyebrow: 'ROI Calculator',
      title: 'Calculate your real savings',
      subtitle: 'See how much your company can save by replacing individual Power BI Pro licenses with the Fabric capacity model plus Portal DriveData.',
      modelTitle: 'How the model works',
      modelText: 'In the traditional model, every user who needs to consume Power BI reports requires a Pro or Premium Per User license. With Portal DriveData over Microsoft Fabric capacity, you contract a single capacity (F-SKU) and let any number of free-account users consume reports, paying only for the processing used.',
      ruleTitle: 'Rule of thumb',
      ruleText: 'For organizations with more than 25 consuming users, the Fabric capacity + Portal DriveData model is almost always cheaper, with growing savings as the number of users increases.',
      simTitle: 'Simulate your monthly savings',
      usersLabel: 'Report-consuming users',
      licenseLabel: 'Current license per user (month)',
      skuLabel: 'Contracted Fabric capacity (F-SKU)',
      currentLabel: 'Current cost (individual licenses)',
      portalLabel: 'Cost with Portal DriveData (Fabric)',
      monthlyLabel: 'Estimated monthly savings',
      annualLabel: 'Annual savings',
      note: 'Reference values for simulation. Real savings depend on the SKU, usage volume and your current Microsoft agreement.',
      calc: {
        levelPrefix: 'Level',
        levels: { none: 'Not worth it yet', balance: 'Break-even', good: 'Real savings', high: 'High savings', max: 'Maximum savings' },
        monthlyDiff: 'Monthly difference',
        savingsLine: '{pct}% off · {annual} per year',
        negativeNote: 'In this scenario the capacity still costs more than the licenses.',
        nextGoal: '{n} more user{s} and you reach {level}',
        maxLevel: 'You are at the maximum savings level',
        scenarioTitle: 'Your scenario',
        usersHint: 'How many people only consume reports (do not create).',
        licenseTodayLabel: 'License you pay today',
        licenseHint: '{cur} per user/month. Market price for your country, adjust it to your contract.',
        skuFieldLabel: 'Fabric capacity (SKU)',
        skuHints: { F2: 'small teams, few reports', F4: 'lean operation', F8: 'the most common in mid-size companies', F16: 'many reports and heavy refresh', F32: 'large operation', F64: 'enterprise scale' },
        skuRecommended: '★ Recommended for {n} users, {hint}.',
        skuOther: '★ For {n} users, the most common is {rec}. Final sizing depends on your real usage.',
        regionLabel: 'Azure region',
        base: 'base',
        billingLabel: 'Billing model',
        billingReserved: '1-year reserved', billingPayg: 'Pay as you go',
        billingReservedHint: '1-year commitment, on 24/7, ~41% discount.',
        billingPaygHint: 'No commitment and you can pause, you pay only for the hours it runs.',
        scheduleLabel: 'Capacity uptime',
        scheduleLabels: { '24x7': 'On 24/7', comercial: 'Business hours (12h)', reduzida: 'Workday (8 business hours)' },
        schedulePerMonth: '{label}, {hours}h/month',
        scheduleHint: 'Pausing the capacity after hours cuts the bill a lot.',
        breakEvenTitle: 'Break-even',
        rowToday: 'Today · {n} × {price}',
        rowPortal: 'DriveData Portal · {sku} in {region}',
        youSave: 'You save', difference: 'Difference',
        breakEvenNote: 'The capacity costs the same with 10 or 10,000 users. Above {n} users it is already cheaper than the licenses.',
        eqUserZero: 'is what each new user costs in the portal. Today, each one costs {price}/month.',
        eqLicenses: '{kind} licenses for a full year is what your annual savings pay for.',
        eqMonths: '{n} months',
        eqCapacity: 'of {sku} capacity are free with what you save in a year.',
        footBase: 'Calculation basis: Fabric capacity at US$ {x} per CU/hour in East US',
        footRegionExtra: ' (+{p}% in {region})',
        footReserved: ' 1-year reserved with ~41% discount',
        footPayg: ' {hours}h running per month',
        footConv: ' converted at {fx} per dollar. ',
        cta: 'I want to validate this scenario with a specialist →',
        beEquilibrium: 'break-even: {n} users', beYou: 'you', beUsers: '{n} users',
        beLicenses: 'Individual licenses ({price}/user)', beCapacity: 'Fabric capacity (fixed)',
      },
    },
    compare: {
      eyebrow: 'Comparison',
      title: 'Portal DriveData vs. the traditional model',
      colTraditional: 'Traditional Power BI model',
      colPortal: 'Portal DriveData + Fabric',
      rows: [
        { crit: 'License per consuming user', trad: 'Power BI Pro required', portal: 'Free license is enough' },
        { crit: 'Cost as users scale', trad: 'Grows linearly with headcount', portal: 'Fixed by Fabric capacity' },
        { crit: 'Granular access control', trad: 'Limited to workspaces and apps', portal: 'By user, group, report' },
        { crit: 'Detailed audit log', trad: 'Basic Activity Log (Office 365)', portal: 'Complete and exportable' },
        { crit: 'Custom branding', trad: 'Standard Microsoft interface', portal: 'Full white-label' },
        { crit: 'Integrated SSO', trad: 'Partial (requires Microsoft account)', portal: 'Native Entra ID' },
        { crit: 'Searchable report catalog', trad: 'Just a list of apps', portal: 'Search, tags and favorites' },
        { crit: 'Law 25 / GDPR compliance', trad: 'Manual, no native support', portal: 'Masking and reports' },
        { crit: 'Usage and ROI monitoring', trad: 'Basic Capacity Metrics', portal: 'Full executive dashboard' },
        { crit: 'Optimized mobile access', trad: 'Generic Power BI Mobile app', portal: 'Responsive white-label PWA' },
      ],
    },
    proof: {
      eyebrow: 'Real impact',
      title: 'Results that speak for themselves',
      subtitle: 'Portal DriveData is used by organizations across sectors that sought governance, a better user experience and lower Power BI licensing costs.',
      stats: [
        { value: '+500', label: 'users served on average per deployment' },
        { value: '73%', label: 'average reduction in licensing cost' },
        { value: '100%', label: 'access traceability and audit' },
        { value: '<30d', label: 'average time to deployment and go-live' },
      ],
      compatTitle: 'Compatible with',
      compat: ['Microsoft Fabric F2 a F64', 'Power BI Premium P1 a P5', 'Microsoft Entra ID', 'Azure Active Directory', 'Microsoft 365', 'Power BI Embedded A-SKU'],
    },
    video: {
      eyebrow: 'Demo',
      title: 'See the Portal in action',
      subtitle: 'A quick tour of the DriveData Portal running on Microsoft Fabric capacity: governance, embedded reports and cost control in practice.',
    },
    install: {
      eyebrow: 'Deployment',
      title: 'Quick to install, done our way',
      subtitle: 'Installation runs in your own Microsoft environment, with our team by your side. Nothing is installed on end users’ machines.',
      timeLabel: 'Average time', timeValue: '1 to 2 business days',
      modesTitle: 'How we install',
      modes: [
        { title: 'Assisted', desc: 'Our team runs the installation end to end, together with your IT.' },
        { title: 'Guided', desc: 'You install it following our step-by-step documentation, with support whenever you need.' },
      ],
      prereqTitle: 'Prerequisites',
      prereqs: [
        'Active Microsoft / Azure tenant',
        'Global Admin permission',
        'Published Power BI workspace',
        'Power BI Pro, Premium, Fabric or Embedded license',
      ],
      stepsTitle: 'What we set up',
      steps: [
        { title: 'App registration (Entra ID)', desc: 'We create the app and service principal that securely connect the portal to your Power BI.' },
        { title: 'Fabric capacity', desc: 'Assigning the capacity (F2 to F64) to the workspace that will serve the reports.' },
        { title: 'Power BI Admin', desc: 'Enabling the embedding settings and linking the workspace to the access group.' },
        { title: 'Portal live', desc: 'Publishing the portal with per-user access control, ready to use.' },
      ],
      cta: 'Schedule the installation',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      subtitle: 'What companies most often ask before getting started.',
      items: [
        { q: 'Is it legal and within Microsoft’s rules?', a: 'Yes. The portal uses Power BI Embedded’s official App Owns Data model, within Microsoft’s licensing terms.' },
        { q: 'Do I need to install anything on my machine?', a: 'No. Everything runs in your Microsoft environment and in the browser. There is no software to install on users’ computers.' },
        { q: 'How long does the installation take?', a: 'On average 1 to 2 business days, depending on your environment. Our team supports the whole process.' },
        { q: 'Is there support after installation?', a: 'Yes. You have DriveData’s support for evolution, adjustments and new needs.' },
        { q: 'Which capacities does it work with?', a: 'With Microsoft Fabric (F2 to F64), Power BI Premium and Power BI Embedded.' },
      ],
    },
    cta: {
      title: 'Ready to transform how your company consumes data?',
      subtitle: 'Book a free demo of Portal DriveData and see in practice how Microsoft Fabric capacity can cut your licensing costs and raise your BI governance.',
      ctaPrimary: 'Book a free demo',
      ctaSecondary: 'Talk to a consultant',
      badges: ['Microsoft Fabric', 'Power BI Embedded', 'Entra ID SSO', 'Law 25 Ready'],
    },
    footer: { tagline: 'Portal DriveData, Microsoft Fabric Capacity Management', rights: 'All rights reserved.' },
  },

  fr: {
    nav: [
      { label: 'Piliers', href: '#pilares' },
      { label: 'Architecture', href: '#arquitetura' },
      { label: 'Fonctionnalités', href: '#features' },
      { label: 'Calculateur ROI', href: '#roi' },
      { label: 'Comparatif', href: '#comparativo' },
    ],
    hero: {
      eyebrow: 'Propulsé par Microsoft Fabric',
      title: 'Le portail qui transforme la façon dont votre entreprise consomme les données',
      subtitle: 'Portal DriveData offre une couche centralisée au-dessus de votre capacité Microsoft Fabric, avec une expérience utilisateur supérieure, une gouvernance granulaire et une réduction marquée des coûts de licences.',
      ctaPrimary: 'Planifier une démo',
      ctaSecondary: 'Calculer les économies',
      badges: ['Microsoft Fabric', 'Confidentialité & conformité', 'Économies de licences'],
      dashTitle: 'Tableau de bord d’impact, Portal DriveData',
      kpis: [
        { value: '73%', label: 'Réduction des coûts' },
        { value: '+340', label: 'Utilisateurs actifs' },
        { value: '100%', label: 'Couverture d’audit' },
      ],
      bars: [
        { label: 'Capacité Fabric utilisée efficacement', value: 82, tag: 'Optimisé' },
        { label: 'Utilisateurs via le portail (sans licence individuelle)', value: 91, tag: 'Économies actives' },
        { label: 'Espaces de travail avec gouvernance appliquée', value: 100, tag: 'Conformité' },
      ],
    },
    pillars: {
      eyebrow: 'Pourquoi DriveData',
      title: 'Trois piliers, un portail',
      subtitle: 'Portal DriveData a été conçu autour de trois axes stratégiques qui répondent aux principaux défis des équipes de données d’entreprise.',
      items: [
        {
          tag: 'Convivialité', title: 'Une expérience centrée sur l’utilisateur',
          desc: 'Une interface unifiée et personnalisée qui facilite la consommation des rapports Power BI pour tous les profils, de l’analyste au dirigeant.',
          points: [
            'Portail en marque blanche à l’identité de l’entreprise',
            'Authentification unique (SSO) via Microsoft Entra ID',
            'Catalogue de rapports avec recherche et favoris',
            'Interface responsive : ordinateur, tablette et mobile',
            'Intégration guidée et soutien contextuel dans l’application',
          ],
        },
        {
          tag: 'Gouvernance', title: 'Contrôle, audit et conformité',
          desc: 'Une gouvernance granulaire sur qui accède à quoi, quand et comment, avec une traçabilité complète pour la loi sur la vie privée, les audits internes et les certifications.',
          points: [
            'Contrôle d’accès par profil, groupe et espace de travail',
            'Journal d’audit complet (qui, quoi, quand)',
            'Politiques d’expiration et de révision des accès',
            'Conformité Loi 25 / LPRPDE avec masquage des données sensibles',
            'Alertes d’accès suspect et rapports de conformité',
          ],
        },
        {
          tag: 'Économies de licences', title: 'Réduction réelle des coûts avec Fabric',
          desc: 'Éliminez les licences Power BI individuelles superflues en exploitant la capacité Fabric déjà contractée pour servir tous les consommateurs de rapports.',
          points: [
            'Les utilisateurs Free accèdent aux rapports via la capacité Fabric',
            'Jusqu’à 80 % d’économies sur les licences Power BI Pro/PPU',
            'Rapport d’usage pour l’optimisation continue de la capacité',
            'ROI mesurable dès le premier mois',
            'Évolutivité sans coût additionnel par utilisateur',
          ],
        },
      ],
    },
    how: {
      eyebrow: 'Comment ça marche',
      title: 'De la capacité Fabric à l’utilisateur final',
      subtitle: 'Portal DriveData agit comme une couche intelligente entre la capacité Microsoft Fabric de votre organisation et les consommateurs de données, simplifiant l’accès, appliquant la gouvernance et réduisant les coûts automatiquement.',
      steps: [
        { title: 'Capacité Fabric', desc: 'Votre capacité Microsoft Fabric (F-SKU ou P-SKU) déjà contractée sert de base de traitement et de rendu.' },
        { title: 'Portal DriveData', desc: 'Le portail gère les identités, les permissions, le catalogue de rapports et la traçabilité des accès dans une seule couche.' },
        { title: 'Politiques & gouvernance', desc: 'Les règles d’accès, d’audit et de conformité sont appliquées automatiquement, sans intervention manuelle de l’équipe TI.' },
        { title: 'Utilisateur final', desc: 'Les employés accèdent aux rapports avec une connexion SSO, sans licence Power BI Pro individuelle.' },
      ],
    },
    arch: {
      eyebrow: 'Architecture technique',
      title: 'Bâti sur Microsoft Fabric',
      subtitle: 'Portal DriveData s’intègre nativement à l’écosystème Microsoft, en utilisant les API officielles de Fabric et Power BI pour garantir sécurité, fiabilité et conformité.',
      layers: [
        { title: 'Capacité Microsoft Fabric', desc: 'F-SKU ou P-SKU comme base de traitement et de rendu des rapports.' },
        { title: 'API officielles Fabric & Power BI', desc: 'Intégration (embed) et authentification via les API prises en charge par Microsoft, sans bricolage.' },
        { title: 'Couche Portal DriveData', desc: 'Identités, permissions, catalogue, politiques de gouvernance et journal d’audit.' },
        { title: 'Expérience utilisateur', desc: 'SSO Entra ID, rapports intégrés, catalogue avec recherche et accès mobile/PWA.' },
      ],
    },
    features: {
      eyebrow: 'Fonctionnalités',
      title: 'Tout ce que le portail offre',
      subtitle: 'Des capacités organisées selon les trois piliers, couvrant l’expérience, la gouvernance et les économies de bout en bout.',
      groups: [
        {
          tag: 'Convivialité',
          items: [
            { title: 'Intégration native Power BI & Fabric', desc: 'Rapports Power BI et visuels Fabric affichés directement dans le portail via l’API officielle, sans redirection ni changement de contexte.' },
            { title: 'Expérience mobile d’abord', desc: 'Interface entièrement responsive avec gestes tactiles, affichage optimisé pour petits écrans et PWA optionnelle à installer.' },
            { title: 'Connexion SSO sans friction', desc: 'Intégration native à Microsoft Entra ID pour l’authentification unique. Les utilisateurs se connectent avec les mêmes identifiants corporatifs.' },
            { title: 'Tableau de bord d’adoption', desc: 'Tableau de bord interne montrant les rapports les plus consultés, la durée des sessions, l’engagement par service et les tendances d’usage.' },
          ],
        },
        {
          tag: 'Gouvernance',
          items: [
            { title: 'Contrôle d’accès granulaire (RBAC)', desc: 'Permissions par utilisateur, groupe, service ou espace de travail avec héritage des groupes Active Directory et révision périodique automatisée.' },
            { title: 'Journal d’audit complet', desc: 'Enregistrement immuable de toute activité : qui a consulté quel rapport, quand, depuis quel appareil et IP, exportable vers SIEM ou outil de conformité.' },
            { title: 'Sécurité au niveau des lignes (RLS)', desc: 'Row-Level Security appliqué automatiquement selon le profil de l’utilisateur authentifié, sans configuration manuelle par rapport.' },
            { title: 'Conformité Loi 25 & RGPD', desc: 'Masquage des champs sensibles, gestion des consentements, rapports sur les personnes concernées et export de preuves pour les audits.' },
            { title: 'Alertes d’accès et d’anomalies', desc: 'Notifications en temps réel pour les accès hors horaires, tentatives non autorisées, volumes inhabituels de requêtes ou pics d’export.' },
            { title: 'Révision périodique des accès', desc: 'Flux automatisé de révision des permissions avec approbation du gestionnaire responsable, éliminant les accès superflus.' },
          ],
        },
        {
          tag: 'Économies',
          items: [
            { title: 'Utilisateurs Free via la capacité Fabric', desc: 'Avec la capacité Fabric, les utilisateurs sous licence Microsoft 365 Free peuvent consommer les rapports publiés, éliminant les licences Pro individuelles.' },
            { title: 'Surveillance de l’usage de la capacité', desc: 'Tableaux de bord de consommation de CU (Capacity Units) en temps réel pour repérer les goulots, optimiser le rafraîchissement et éviter l’autoscaling inutile.' },
            { title: 'Rapport de ROI et d’économies cumulées', desc: 'Tableau de bord exécutif avec calcul automatique des économies, historique mensuel et projection annuelle.' },
            { title: 'Évolutivité sans coût par utilisateur', desc: 'Ajoutez 10 ou 10 000 utilisateurs au portail sans hausse proportionnelle des coûts. La capacité supporte tout volume de consommateurs.' },
            { title: 'Recommandations automatiques de dimensionnement', desc: 'Analyse continue des tendances d’usage pour suggérer le SKU de capacité idéal, évitant le surdimensionnement ou la dégradation des performances.' },
            { title: 'Migration de licences assistée', desc: 'Cartographie des utilisateurs sous licence Pro et plan de migration vers le modèle par capacité, avec soutien technique et simulation d’impact.' },
          ],
        },
      ],
    },
    roi: {
      eyebrow: 'Calculateur de ROI',
      title: 'Calculez vos économies réelles',
      subtitle: 'Voyez combien votre entreprise peut économiser en remplaçant les licences Power BI Pro individuelles par le modèle de capacité Fabric avec Portal DriveData.',
      modelTitle: 'Comment fonctionne le modèle',
      modelText: 'Dans le modèle traditionnel, chaque utilisateur qui doit consommer des rapports Power BI exige une licence Pro ou Premium Per User. Avec Portal DriveData sur la capacité Microsoft Fabric, vous contractez une seule capacité (F-SKU) et permettez à un nombre illimité d’utilisateurs à compte gratuit de consommer les rapports, en payant uniquement le traitement utilisé.',
      ruleTitle: 'Règle générale',
      ruleText: 'Pour les organisations de plus de 25 utilisateurs consommateurs, le modèle capacité Fabric + Portal DriveData est presque toujours plus économique, avec des économies croissantes selon le nombre d’utilisateurs.',
      simTitle: 'Simulez vos économies mensuelles',
      usersLabel: 'Utilisateurs consommateurs de rapports',
      licenseLabel: 'Licence actuelle par utilisateur (mois)',
      skuLabel: 'Capacité Fabric contractée (F-SKU)',
      currentLabel: 'Coût actuel (licences individuelles)',
      portalLabel: 'Coût avec Portal DriveData (Fabric)',
      monthlyLabel: 'Économies mensuelles estimées',
      annualLabel: 'Économies annuelles',
      note: 'Valeurs de référence pour la simulation. Les économies réelles dépendent du SKU, du volume d’usage et de votre entente Microsoft en vigueur.',
      calc: {
        levelPrefix: 'Niveau',
        levels: { none: 'Pas encore rentable', balance: 'Seuil atteint', good: 'Économies réelles', high: 'Économies élevées', max: 'Économies maximales' },
        monthlyDiff: 'Différence mensuelle',
        savingsLine: '{pct} % de réduction · {annual} par an',
        negativeNote: 'Dans ce scénario, la capacité coûte encore plus que les licences.',
        nextGoal: '{n} utilisateur{s} de plus et vous atteignez {level}',
        maxLevel: 'Vous êtes au niveau d’économies maximal',
        scenarioTitle: 'Votre scénario',
        usersHint: 'Combien de personnes consomment seulement des rapports (sans en créer).',
        licenseTodayLabel: 'Licence que vous payez aujourd’hui',
        licenseHint: '{cur} par utilisateur/mois. Prix du marché de votre pays, ajustable selon votre contrat.',
        skuFieldLabel: 'Capacité Fabric (SKU)',
        skuHints: { F2: 'petites équipes, peu de rapports', F4: 'opération allégée', F8: 'le plus courant dans les moyennes entreprises', F16: 'beaucoup de rapports et rafraîchissement intensif', F32: 'grande opération', F64: 'échelle entreprise' },
        skuRecommended: '★ Recommandé pour {n} utilisateurs, {hint}.',
        skuOther: '★ Pour {n} utilisateurs, le plus courant est {rec}. Le dimensionnement final dépend de votre usage réel.',
        regionLabel: 'Région Azure',
        base: 'base',
        billingLabel: 'Mode de facturation',
        billingReserved: 'Réservé 1 an', billingPayg: 'Paiement à l’usage',
        billingReservedHint: 'Engagement d’un an, actif 24/7, avec ~41 % de remise.',
        billingPaygHint: 'Sans engagement et avec pause possible, vous payez seulement les heures actives.',
        scheduleLabel: 'Capacité active',
        scheduleLabels: { '24x7': 'Actif 24/7', comercial: 'Heures ouvrables (12h)', reduzida: 'Journée (8h ouvrées)' },
        schedulePerMonth: '{label}, {hours} h/mois',
        scheduleHint: 'Mettre la capacité en pause hors des heures réduit fortement la facture.',
        breakEvenTitle: 'Seuil de rentabilité',
        rowToday: 'Aujourd’hui · {n} × {price}',
        rowPortal: 'Portal DriveData · {sku} en {region}',
        youSave: 'Vous économisez', difference: 'Différence',
        breakEvenNote: 'La capacité coûte le même prix avec 10 ou 10 000 utilisateurs. Au-delà de {n} utilisateurs, elle est déjà moins chère que les licences.',
        eqUserZero: 'c’est ce que coûte chaque nouvel utilisateur dans le portail. Aujourd’hui, chacun coûte {price}/mois.',
        eqLicenses: 'licences {kind} pour une année entière, c’est ce que financent vos économies annuelles.',
        eqMonths: '{n} mois',
        eqCapacity: 'de capacité {sku} sont gratuits avec ce que vous économisez en un an.',
        footBase: 'Base du calcul : capacité Fabric à US$ {x} par CU/heure en East US',
        footRegionExtra: ' (+{p} % en {region})',
        footReserved: ' réservé 1 an avec ~41 % de remise',
        footPayg: ' {hours} h actives par mois',
        footConv: ' convertie à {fx} par dollar. ',
        cta: 'Je veux valider ce scénario avec un spécialiste →',
        beEquilibrium: 'seuil : {n} utilisateurs', beYou: 'vous', beUsers: '{n} utilisateurs',
        beLicenses: 'Licences individuelles ({price}/utilisateur)', beCapacity: 'Capacité Fabric (fixe)',
      },
    },
    compare: {
      eyebrow: 'Comparatif',
      title: 'Portal DriveData vs. modèle traditionnel',
      colTraditional: 'Modèle Power BI traditionnel',
      colPortal: 'Portal DriveData + Fabric',
      rows: [
        { crit: 'Licence par utilisateur consommateur', trad: 'Power BI Pro obligatoire', portal: 'Licence Free suffit' },
        { crit: 'Coût selon le nombre d’utilisateurs', trad: 'Croît linéairement avec l’effectif', portal: 'Fixe selon la capacité Fabric' },
        { crit: 'Contrôle d’accès granulaire', trad: 'Limité aux espaces et apps', portal: 'Par utilisateur, groupe, rapport' },
        { crit: 'Journal d’audit détaillé', trad: 'Activity Log de base (Office 365)', portal: 'Complet et exportable' },
        { crit: 'Image de marque personnalisée', trad: 'Interface Microsoft standard', portal: 'Marque blanche complète' },
        { crit: 'SSO intégré', trad: 'Partiel (compte Microsoft requis)', portal: 'Entra ID natif' },
        { crit: 'Catalogue de rapports avec recherche', trad: 'Simple liste d’apps', portal: 'Recherche, étiquettes et favoris' },
        { crit: 'Conformité Loi 25 / RGPD', trad: 'Manuelle, sans support natif', portal: 'Masquage et rapports' },
        { crit: 'Suivi de l’usage et du ROI', trad: 'Capacity Metrics de base', portal: 'Tableau de bord exécutif complet' },
        { crit: 'Accès mobile optimisé', trad: 'App Power BI Mobile générique', portal: 'PWA responsive en marque blanche' },
      ],
    },
    proof: {
      eyebrow: 'Impact réel',
      title: 'Des résultats qui parlent d’eux-mêmes',
      subtitle: 'Portal DriveData est utilisé par des organisations de divers secteurs qui recherchaient gouvernance, meilleure expérience utilisateur et réduction des coûts de licences Power BI.',
      stats: [
        { value: '+500', label: 'utilisateurs servis en moyenne par déploiement' },
        { value: '73%', label: 'de réduction moyenne des coûts de licences' },
        { value: '100%', label: 'de traçabilité et d’audit des accès' },
        { value: '<30j', label: 'délai moyen de déploiement et de mise en service' },
      ],
      compatTitle: 'Compatible avec',
      compat: ['Microsoft Fabric F2 a F64', 'Power BI Premium P1 a P5', 'Microsoft Entra ID', 'Azure Active Directory', 'Microsoft 365', 'Power BI Embedded A-SKU'],
    },
    video: {
      eyebrow: 'Démo',
      title: 'Le Portail en action',
      subtitle: 'Un aperçu rapide du Portail DriveData fonctionnant sur la capacité Microsoft Fabric : gouvernance, rapports intégrés et maîtrise des coûts en pratique.',
    },
    install: {
      eyebrow: 'Déploiement',
      title: 'Rapide à installer, à notre façon',
      subtitle: 'L’installation se fait dans votre propre environnement Microsoft, avec notre équipe à vos côtés. Rien n’est installé sur les postes des utilisateurs.',
      timeLabel: 'Durée moyenne', timeValue: '1 à 2 jours ouvrés',
      modesTitle: 'Comment nous installons',
      modes: [
        { title: 'Assistée', desc: 'Notre équipe mène l’installation de bout en bout, avec votre service informatique.' },
        { title: 'Guidée', desc: 'Vous installez en suivant notre documentation pas à pas, avec du support au besoin.' },
      ],
      prereqTitle: 'Prérequis',
      prereqs: [
        'Locataire (tenant) Microsoft / Azure actif',
        'Autorisation d’administrateur global (Global Admin)',
        'Espace de travail Power BI publié',
        'Licence Power BI Pro, Premium, Fabric ou Embedded',
      ],
      stepsTitle: 'Ce que nous configurons',
      steps: [
        { title: 'Enregistrement d’application (Entra ID)', desc: 'Nous créons l’application et le service principal qui relient le portail à votre Power BI en toute sécurité.' },
        { title: 'Capacité Fabric', desc: 'Association de la capacité (F2 à F64) à l’espace de travail qui servira les rapports.' },
        { title: 'Admin Power BI', desc: 'Activation des paramètres d’intégration et liaison de l’espace de travail au groupe d’accès.' },
        { title: 'Portail en ligne', desc: 'Publication du portail avec contrôle d’accès par utilisateur, prêt à l’emploi.' },
      ],
      cta: 'Planifier l’installation',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions fréquentes',
      subtitle: 'Ce que les entreprises demandent le plus avant de commencer.',
      items: [
        { q: 'Est-ce légal et conforme aux règles de Microsoft ?', a: 'Oui. Le portail utilise le modèle officiel App Owns Data de Power BI Embedded, dans le cadre des conditions de licence de Microsoft.' },
        { q: 'Dois-je installer quelque chose sur mon poste ?', a: 'Non. Tout fonctionne dans votre environnement Microsoft et dans le navigateur. Aucun logiciel à installer sur les postes des utilisateurs.' },
        { q: 'Combien de temps prend l’installation ?', a: 'En moyenne 1 à 2 jours ouvrés, selon votre environnement. Notre équipe accompagne tout le processus.' },
        { q: 'Y a-t-il du support après l’installation ?', a: 'Oui. Vous bénéficiez du support de DriveData pour les évolutions, ajustements et nouveaux besoins.' },
        { q: 'Avec quelles capacités cela fonctionne-t-il ?', a: 'Avec Microsoft Fabric (F2 à F64), Power BI Premium et Power BI Embedded.' },
      ],
    },
    cta: {
      title: 'Prêt à transformer la façon dont votre entreprise consomme les données ?',
      subtitle: 'Planifiez une démo gratuite de Portal DriveData et voyez concrètement comment la capacité Microsoft Fabric peut réduire vos coûts de licences et rehausser votre gouvernance BI.',
      ctaPrimary: 'Planifier une démo gratuite',
      ctaSecondary: 'Parler à un conseiller',
      badges: ['Microsoft Fabric', 'Power BI Embedded', 'Entra ID SSO', 'Loi 25 Ready'],
    },
    footer: { tagline: 'Portal DriveData, Gestion de la capacité Microsoft Fabric', rights: 'Tous droits réservés.' },
  },
};
