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
  schedule: { title: string; subtitle: string; fallback: string; fallbackLink: string; loading: string };
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
          tag: 'Acesso aos painéis',
          items: [
            { title: 'Painéis por área', desc: 'Painéis organizados por área, com favoritos e troca rápida entre os painéis da mesma área.' },
            { title: 'Catálogo com pedido de acesso', desc: 'A pessoa vê o que existe e pede acesso. O admin aprova no próprio portal.' },
            { title: 'Permissão por área, painel e página', desc: 'Libere por área ou por painel e escolha quais páginas do relatório cada pessoa vê.' },
            { title: 'Segurança por linha (RLS)', desc: 'O RLS do Power BI é aplicado com a identidade de cada pessoa. Cada um vê só os dados que lhe cabem.' },
            { title: 'Matriz de acesso', desc: 'Uma tela mostra quem vê cada painel.' },
            { title: 'Selo de atualização', desc: 'Cada painel mostra a situação da última atualização dos dados.' },
            { title: 'Exportação de dados', desc: 'Os dados de um visual saem em CSV ou Excel.' },
          ],
        },
        {
          tag: 'Usuários',
          items: [
            { title: 'Cadastro do seu jeito', desc: 'Cadastro manual, importação por CSV ou sincronização com um grupo do Entra ID.' },
            { title: 'Senha provisória', desc: 'A pessoa recebe uma senha provisória e é obrigada a trocar no primeiro acesso.' },
            { title: 'Bloqueio por inatividade', desc: 'Quem fica sem entrar pelo número de dias definido é bloqueado automaticamente.' },
            { title: 'Acesso assistido', desc: 'O admin entra como a pessoa para dar suporte, sem pedir a senha.' },
          ],
        },
        {
          tag: 'Segurança',
          items: [
            { title: 'Duas etapas para administradores', desc: 'Verificação em duas etapas obrigatória para quem administra o portal.' },
            { title: 'Acesso por rede, horário e dia', desc: 'Entrada restrita por IPs permitidos, por horário e por dias da semana.' },
            { title: 'Auditoria', desc: 'Ações e acessos ficam registrados para consulta.' },
          ],
        },
        {
          tag: 'Compartilhamento',
          items: [
            { title: 'Links de convidado', desc: 'Um link abre o painel para quem não tem login.' },
            { title: 'Modo TV', desc: 'Painéis em rotação numa tela, sem login.' },
          ],
        },
        {
          tag: 'Comunicação e suporte',
          items: [
            { title: 'Avisos', desc: 'Comunicados para todos no sino ou numa faixa no topo da tela.' },
            { title: 'Notificações', desc: 'Aviso de painel novo, acesso liberado, dado atualizado e falha.' },
            { title: 'Chamados de suporte', desc: 'A pessoa abre o chamado e o admin responde no próprio portal.' },
          ],
        },
        {
          tag: 'Monitoramento e capacidade',
          items: [
            { title: 'Atualizações de dados', desc: 'Situação das atualizações de cada painel, com alerta de falha.' },
            { title: 'Desempenho por painel', desc: 'Tempo de carregamento e aberturas com falha de cada painel.' },
            { title: 'Uso da capacidade', desc: 'Quanto da capacidade Fabric contratada está em uso.' },
            { title: 'Agenda da capacidade', desc: 'Liga e desliga a capacidade nos horários definidos, para pagar só o tempo de uso.' },
          ],
        },
        {
          tag: 'Integração e uso',
          items: [
            { title: 'Com a sua marca', desc: 'Domínio, logo e cores do cliente.' },
            { title: 'Chaves de API', desc: 'Para integrar o portal a outros sistemas.' },
            { title: 'Quatro idiomas', desc: 'Português, inglês, espanhol e francês.' },
            { title: 'No celular', desc: 'Aplicativo Android e versão para o navegador do celular.' },
            { title: 'Assistente de IA', desc: 'Responde perguntas sobre a página aberta do painel. Tem teste grátis e planos mensais.' },
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
        { crit: 'Licença de quem só visualiza', trad: 'Power BI Pro para cada pessoa (abaixo da F64)', portal: 'Sem licença individual (App Owns Data)' },
        { crit: 'Custo ao crescer', trad: 'Uma licença Pro a mais por pessoa', portal: 'Capacidade fixa e mensalidade por usuário' },
        { crit: 'Controle de acesso', trad: 'Por workspace e app', portal: 'Por área, painel, página e linha (RLS)' },
        { crit: 'Política de acesso', trad: 'Configurada à parte no Entra ID', portal: 'Rede, horário e dia da semana no portal' },
        { crit: 'Auditoria', trad: 'Log de atividades do Microsoft 365', portal: 'Ações e acessos registrados no portal' },
        { crit: 'Marca', trad: 'Interface padrão da Microsoft', portal: 'Domínio, logo e cores do cliente' },
        { crit: 'Encontrar o relatório', trad: 'Lista de apps e workspaces', portal: 'Áreas, busca, favoritos e catálogo' },
        { crit: 'Uso e desempenho', trad: 'Relatório de uso por workspace', portal: 'Aberturas, tempo de carga, falhas e capacidade' },
        { crit: 'Suporte a quem usa', trad: 'Fora da ferramenta', portal: 'Chamados, avisos e acesso assistido no portal' },
        { crit: 'Celular', trad: 'App Power BI Mobile', portal: 'App Android e navegador do celular' },
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
        { q: 'Quem só visualiza precisa de licença Pro?', a: 'Não. O portal usa o modelo App Owns Data: quem só visualiza não precisa de licença individual em nenhum tamanho de capacidade. Quem publica relatórios no Power BI continua com a licença Pro.' },
        { q: 'Qual capacidade Fabric eu preciso?', a: 'Depende de quantas vezes os relatórios são abertos, de quantos modelos atualizam por dia e do tamanho do maior modelo. Use o simulador de capacidade desta página e confirme com duas semanas de medição no Capacity Metrics antes de reservar por um ano.' },
      ],
    },
    schedule: {
      title: 'Agende sua demonstração',
      subtitle: 'Escolha o melhor horário abaixo. O convite cai direto na sua agenda e na nossa.',
      fallback: 'A agenda não apareceu?',
      fallbackLink: 'Abrir em nova aba',
      loading: 'Carregando a agenda…',
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
          tag: 'Dashboard access',
          items: [
            { title: 'Dashboards by area', desc: 'Dashboards organized by area, with favorites and quick switching between dashboards of the same area.' },
            { title: 'Catalog with access requests', desc: 'People see what exists and request access. The admin approves it in the portal.' },
            { title: 'Permissions by area, dashboard and page', desc: 'Grant access by area or by dashboard and choose which report pages each person sees.' },
            { title: 'Row-level security (RLS)', desc: 'Power BI RLS is applied with each person’s identity, so everyone sees only their own data.' },
            { title: 'Access matrix', desc: 'One screen shows who sees each dashboard.' },
            { title: 'Refresh status badge', desc: 'Each dashboard shows the status of its last data refresh.' },
            { title: 'Data export', desc: 'Export the data behind a visual to CSV or Excel.' },
          ],
        },
        {
          tag: 'Users',
          items: [
            { title: 'Onboarding your way', desc: 'Add people manually, import a CSV file or sync with an Entra ID group.' },
            { title: 'Temporary password', desc: 'People get a temporary password and must change it on first sign-in.' },
            { title: 'Inactivity lock', desc: 'Anyone who does not sign in for the number of days you set is locked automatically.' },
            { title: 'Assisted access', desc: 'The admin signs in as the person to help, without asking for the password.' },
          ],
        },
        {
          tag: 'Security',
          items: [
            { title: 'Two-step verification for admins', desc: 'Two-step verification is mandatory for portal administrators.' },
            { title: 'Access by network, time and day', desc: 'Restrict sign-in by allowed IPs, by time of day and by day of the week.' },
            { title: 'Audit', desc: 'Actions and sign-ins are recorded for review.' },
          ],
        },
        {
          tag: 'Sharing',
          items: [
            { title: 'Guest links', desc: 'A link opens a dashboard for people without a login.' },
            { title: 'TV mode', desc: 'Dashboards rotating on a screen, without a login.' },
          ],
        },
        {
          tag: 'Communication and support',
          items: [
            { title: 'Announcements', desc: 'Messages for everyone in the bell or in a banner at the top of the screen.' },
            { title: 'Notifications', desc: 'Alerts for a new dashboard, access granted, data refreshed and failures.' },
            { title: 'Support tickets', desc: 'People open a ticket and the admin answers it in the portal.' },
          ],
        },
        {
          tag: 'Monitoring and capacity',
          items: [
            { title: 'Data refreshes', desc: 'Refresh status of each dashboard, with failure alerts.' },
            { title: 'Performance by dashboard', desc: 'Load time and failed opens for each dashboard.' },
            { title: 'Capacity usage', desc: 'How much of the contracted Fabric capacity is in use.' },
            { title: 'Capacity schedule', desc: 'Turns the capacity on and off at set times, so you pay only for the hours in use.' },
          ],
        },
        {
          tag: 'Integration and usage',
          items: [
            { title: 'Your brand', desc: 'The client’s domain, logo and colors.' },
            { title: 'API keys', desc: 'To integrate the portal with other systems.' },
            { title: 'Four languages', desc: 'Portuguese, English, Spanish and French.' },
            { title: 'On mobile', desc: 'Android app and a version for the phone browser.' },
            { title: 'AI assistant', desc: 'Answers questions about the open dashboard page. Free trial and monthly plans.' },
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
        { crit: 'License for viewers', trad: 'Power BI Pro for each person (below F64)', portal: 'No individual license (App Owns Data)' },
        { crit: 'Cost as you grow', trad: 'One more Pro license per person', portal: 'Fixed capacity plus a per-user fee' },
        { crit: 'Access control', trad: 'By workspace and app', portal: 'By area, dashboard, page and row (RLS)' },
        { crit: 'Access policy', trad: 'Set up separately in Entra ID', portal: 'Network, time and weekday in the portal' },
        { crit: 'Audit', trad: 'Microsoft 365 activity log', portal: 'Actions and sign-ins recorded in the portal' },
        { crit: 'Brand', trad: 'Standard Microsoft interface', portal: 'Client domain, logo and colors' },
        { crit: 'Finding a report', trad: 'List of apps and workspaces', portal: 'Areas, search, favorites and catalog' },
        { crit: 'Usage and performance', trad: 'Usage report per workspace', portal: 'Opens, load time, failures and capacity' },
        { crit: 'Support for users', trad: 'Outside the tool', portal: 'Tickets, announcements and assisted access in the portal' },
        { crit: 'Mobile', trad: 'Power BI Mobile app', portal: 'Android app and phone browser' },
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
        { q: 'Do viewers need a Pro license?', a: 'No. The portal uses the App Owns Data model: people who only view reports need no individual license on any capacity size. People who publish reports in Power BI keep their Pro license.' },
        { q: 'Which Fabric capacity do I need?', a: 'It depends on how often reports are opened, how many models refresh each day and the size of the largest model. Use the capacity simulator on this page and confirm it with two weeks of measurement in Capacity Metrics before reserving for a year.' },
      ],
    },
    schedule: {
      title: 'Book your demo',
      subtitle: 'Pick the best time below. The invite lands straight in your calendar and ours.',
      fallback: 'Calendar not showing?',
      fallbackLink: 'Open in a new tab',
      loading: 'Loading the calendar…',
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
          tag: 'Accès aux tableaux de bord',
          items: [
            { title: 'Tableaux de bord par domaine', desc: 'Tableaux de bord organisés par domaine, avec favoris et passage rapide entre les tableaux d’un même domaine.' },
            { title: 'Catalogue avec demande d’accès', desc: 'Chacun voit ce qui existe et demande l’accès. L’administrateur approuve dans le portail.' },
            { title: 'Droits par domaine, tableau et page', desc: 'Accordez l’accès par domaine ou par tableau et choisissez les pages du rapport que chaque personne voit.' },
            { title: 'Sécurité au niveau des lignes (RLS)', desc: 'Le RLS de Power BI est appliqué avec l’identité de chaque personne : chacun ne voit que ses données.' },
            { title: 'Matrice d’accès', desc: 'Un écran montre qui voit chaque tableau de bord.' },
            { title: 'Pastille d’actualisation', desc: 'Chaque tableau affiche l’état de la dernière actualisation des données.' },
            { title: 'Export des données', desc: 'Les données d’un visuel s’exportent en CSV ou en Excel.' },
          ],
        },
        {
          tag: 'Utilisateurs',
          items: [
            { title: 'Inscription à votre façon', desc: 'Ajout manuel, import CSV ou synchronisation avec un groupe Entra ID.' },
            { title: 'Mot de passe provisoire', desc: 'La personne reçoit un mot de passe provisoire et doit le changer à la première connexion.' },
            { title: 'Blocage pour inactivité', desc: 'Qui ne se connecte pas pendant le nombre de jours défini est bloqué automatiquement.' },
            { title: 'Accès assisté', desc: 'L’administrateur se connecte à la place de la personne pour l’aider, sans demander le mot de passe.' },
          ],
        },
        {
          tag: 'Sécurité',
          items: [
            { title: 'Deux étapes pour les administrateurs', desc: 'Vérification en deux étapes obligatoire pour les administrateurs du portail.' },
            { title: 'Accès par réseau, horaire et jour', desc: 'Connexion limitée par IP autorisées, par horaire et par jour de la semaine.' },
            { title: 'Audit', desc: 'Les actions et les accès sont enregistrés pour consultation.' },
          ],
        },
        {
          tag: 'Partage',
          items: [
            { title: 'Liens invités', desc: 'Un lien ouvre un tableau de bord pour qui n’a pas de compte.' },
            { title: 'Mode TV', desc: 'Tableaux de bord en rotation sur un écran, sans connexion.' },
          ],
        },
        {
          tag: 'Communication et support',
          items: [
            { title: 'Annonces', desc: 'Messages pour tous dans la cloche ou dans un bandeau en haut de l’écran.' },
            { title: 'Notifications', desc: 'Alerte de nouveau tableau, d’accès accordé, de données actualisées et d’échec.' },
            { title: 'Demandes de support', desc: 'La personne ouvre une demande et l’administrateur répond dans le portail.' },
          ],
        },
        {
          tag: 'Suivi et capacité',
          items: [
            { title: 'Actualisations des données', desc: 'État des actualisations de chaque tableau, avec alerte en cas d’échec.' },
            { title: 'Performance par tableau', desc: 'Temps de chargement et ouvertures en échec de chaque tableau.' },
            { title: 'Utilisation de la capacité', desc: 'La part de la capacité Fabric contractée qui est utilisée.' },
            { title: 'Horaire de la capacité', desc: 'Allume et éteint la capacité aux heures définies, pour ne payer que le temps d’utilisation.' },
          ],
        },
        {
          tag: 'Intégration et usage',
          items: [
            { title: 'À votre image', desc: 'Domaine, logo et couleurs du client.' },
            { title: 'Clés d’API', desc: 'Pour intégrer le portail à d’autres systèmes.' },
            { title: 'Quatre langues', desc: 'Portugais, anglais, espagnol et français.' },
            { title: 'Sur mobile', desc: 'Application Android et version pour le navigateur du téléphone.' },
            { title: 'Assistant IA', desc: 'Répond aux questions sur la page ouverte du tableau. Essai gratuit et forfaits mensuels.' },
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
        { crit: 'Licence pour les lecteurs', trad: 'Power BI Pro pour chaque personne (sous F64)', portal: 'Aucune licence individuelle (App Owns Data)' },
        { crit: 'Coût à la croissance', trad: 'Une licence Pro de plus par personne', portal: 'Capacité fixe et tarif par utilisateur' },
        { crit: 'Contrôle d’accès', trad: 'Par espace de travail et application', portal: 'Par domaine, tableau, page et ligne (RLS)' },
        { crit: 'Politique d’accès', trad: 'Configurée à part dans Entra ID', portal: 'Réseau, horaire et jour dans le portail' },
        { crit: 'Audit', trad: 'Journal d’activité Microsoft 365', portal: 'Actions et accès enregistrés dans le portail' },
        { crit: 'Image de marque', trad: 'Interface Microsoft standard', portal: 'Domaine, logo et couleurs du client' },
        { crit: 'Trouver un rapport', trad: 'Liste d’applications et d’espaces', portal: 'Domaines, recherche, favoris et catalogue' },
        { crit: 'Usage et performance', trad: 'Rapport d’usage par espace de travail', portal: 'Ouvertures, temps de chargement, échecs et capacité' },
        { crit: 'Support aux utilisateurs', trad: 'Hors de l’outil', portal: 'Demandes, annonces et accès assisté dans le portail' },
        { crit: 'Mobile', trad: 'Application Power BI Mobile', portal: 'Application Android et navigateur du téléphone' },
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
        { q: 'Les lecteurs ont-ils besoin d’une licence Pro ?', a: 'Non. Le portail utilise le modèle App Owns Data : qui ne fait que consulter n’a besoin d’aucune licence individuelle, quelle que soit la taille de la capacité. Qui publie des rapports dans Power BI garde sa licence Pro.' },
        { q: 'De quelle capacité Fabric ai-je besoin ?', a: 'Cela dépend du nombre d’ouvertures de rapports, du nombre de modèles actualisés par jour et de la taille du plus gros modèle. Utilisez le simulateur de capacité de cette page et confirmez avec deux semaines de mesure dans Capacity Metrics avant de réserver pour un an.' },
      ],
    },
    schedule: {
      title: 'Réservez votre démo',
      subtitle: 'Choisissez le meilleur créneau ci-dessous. L’invitation arrive directement dans votre agenda et le nôtre.',
      fallback: 'L’agenda ne s’affiche pas ?',
      fallbackLink: 'Ouvrir dans un nouvel onglet',
      loading: 'Chargement de l’agenda…',
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
