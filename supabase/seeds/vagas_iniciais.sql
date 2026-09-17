-- ===========================================================================
-- Vagas iniciais da DriveData (7 oportunidades do nosso nicho).
-- Rode no SQL Editor do Supabase do SITE, DEPOIS da migration 006_vagas.sql.
--
-- Regra da casa (set/2026): TODAS remotas e TODAS PJ.
-- Excecao: estagio nao pode ser PJ no Brasil (a Lei 11.788 tem contrato proprio,
-- com bolsa-auxilio), entao os dois estagios ficam com contract_type 'estagio'.
--
-- Entram como RASCUNHO (status = 'draft'), ou seja, NAO aparecem no site.
-- Revise no admin (Carreiras -> Vagas) e publique, ou rode:
--   update job set status = 'open' where status = 'draft';
--
-- Rodar de novo nao duplica (on conflict pelo slug).
-- ===========================================================================

insert into job (slug, title, area, location, work_model, contract_type, seniority, summary, description, requirements, benefits, status, locale)
values

-- 1 ------------------------------------------------------------------------
('engenheiro-de-dados-pleno',
 'Engenheiro(a) de Dados Pleno',
 'Engenharia de Dados', 'Remoto, Brasil', 'remoto', 'pj', 'Pleno',
 'Construa e opere os pipelines que alimentam as decisoes de grandes operacoes, com Microsoft Fabric, Databricks e Python.',
 '<p>Voce vai atuar no time que desenha e sustenta a plataforma de dados dos nossos clientes. O dia a dia mistura modelagem, ingestao, orquestracao e conversa direta com quem consome os dados do outro lado.</p><h3>No dia a dia</h3><ul><li>Construir e manter pipelines de ingestao e transformacao em Fabric e Databricks.</li><li>Modelar as camadas bronze, prata e ouro com governanca e documentacao.</li><li>Monitorar custo e performance do processamento.</li><li>Participar das decisoes de arquitetura junto com o time e o cliente.</li></ul>',
 'Python e SQL em nivel avancado
Experiencia com Spark, em Databricks ou Microsoft Fabric
Modelagem dimensional e boas praticas de governanca de dados
Versionamento com Git e alguma pratica de CI/CD
Ingles para leitura tecnica
Clareza para explicar decisoes tecnicas a quem nao e tecnico',
 'Contrato PJ com valor compativel com a senioridade
Trabalho 100% remoto, sem exigencia de mudanca
Horario flexivel, combinado com o time
Projetos com operacoes de grande porte e stack moderna
Apoio para cursos e certificacoes
Pagamento em dia, na mesma data todo mes',
 'draft', 'pt'),

-- 2 ------------------------------------------------------------------------
('analista-de-power-bi-pleno',
 'Analista de Power BI Pleno',
 'BI e Analytics', 'Remoto, Brasil', 'remoto', 'pj', 'Pleno',
 'Transforme dados em paineis que as pessoas realmente usam para decidir, com DAX bem escrito e modelo bem pensado.',
 '<p>Voce vai desenhar, construir e evoluir os paineis que a diretoria dos nossos clientes abre todo dia. Aqui o painel nao e entregue e esquecido: acompanhamos adocao, performance e a pergunta de negocio por tras de cada visual.</p><h3>No dia a dia</h3><ul><li>Levantar requisitos com as areas de negocio e traduzir em indicadores.</li><li>Modelar em estrela e escrever DAX limpo e performatico.</li><li>Publicar e administrar workspaces, capacidades e permissoes.</li><li>Otimizar relatorios pesados e revisar o trabalho de colegas.</li></ul>',
 'Power BI em nivel avancado, com DAX e Power Query
Modelagem dimensional, com dominio de modelo estrela
SQL para investigar e validar dados na origem
Cuidado com design de informacao e leitura do painel
Experiencia com Power BI Service, workspaces e permissoes
Diferencial: Microsoft Fabric, Tabular Editor ou DAX Studio',
 'Contrato PJ com valor compativel com a senioridade
Trabalho 100% remoto, sem exigencia de mudanca
Horario flexivel, combinado com o time
Contato direto com a area de negocio do cliente
Apoio para cursos e certificacoes Microsoft
Pagamento em dia, na mesma data todo mes',
 'draft', 'pt'),

-- 3 ------------------------------------------------------------------------
('analista-de-infraestrutura-cloud-azure',
 'Analista de Infraestrutura Cloud (Azure)',
 'Infraestrutura e Cloud', 'Remoto, Brasil', 'remoto', 'pj', 'Pleno',
 'Sustente a base onde tudo roda: rede, identidade, seguranca e custo do ambiente Azure dos nossos clientes.',
 '<p>Voce cuida da fundacao. Provisiona ambientes, organiza identidade e acesso, acompanha custo e mantem a plataforma de dados de pe, com infraestrutura versionada e nada de configuracao feita na mao sem registro.</p><h3>No dia a dia</h3><ul><li>Provisionar e manter recursos Azure com infraestrutura como codigo.</li><li>Administrar identidade e acesso no Entra ID, com o minimo privilegio necessario.</li><li>Configurar rede, endpoints privados e regras de seguranca.</li><li>Acompanhar consumo e propor reducao de custo.</li><li>Montar monitoramento e alertas do que esta no ar.</li></ul>',
 'Experiencia com Azure, em especial rede, identidade e armazenamento
Infraestrutura como codigo com Terraform ou Bicep
Scripting em PowerShell ou Python
Pratica de CI/CD, de preferencia Azure DevOps ou GitHub Actions
Nocoes de seguranca em nuvem e gestao de custo
Diferencial: certificacao AZ-104 ou AZ-305',
 'Contrato PJ com valor compativel com a senioridade
Trabalho 100% remoto, sem exigencia de mudanca
Horario flexivel, combinado com o time
Plantao organizado e previsivel, sem heroismo
Apoio para cursos e certificacoes Microsoft
Pagamento em dia, na mesma data todo mes',
 'draft', 'pt'),

-- 4 ------------------------------------------------------------------------
('consultor-microsoft-fabric-senior',
 'Consultor(a) Microsoft Fabric Senior',
 'Engenharia de Dados', 'Remoto, Brasil', 'remoto', 'pj', 'Senior',
 'Conduza projetos de Microsoft Fabric de ponta a ponta, da arquitetura a governanca, com espaco para opinar sobre o desenho.',
 '<p>Voce e a referencia tecnica de Fabric nos nossos projetos. Desenha a arquitetura, define a estrategia de capacidade e governanca, e acompanha o time na execucao. Tambem entra em reuniao de pre-venda para sustentar a proposta tecnica diante do cliente.</p><h3>No dia a dia</h3><ul><li>Desenhar arquitetura de lakehouse e warehouse no Fabric.</li><li>Definir a estrategia de capacidade, workspaces e governanca.</li><li>Orientar tecnicamente o time de engenharia e BI.</li><li>Apoiar a pre-venda com estimativas e desenho de solucao.</li></ul>',
 'Experiencia comprovada com Microsoft Fabric em producao
Dominio de lakehouse, warehouse e pipelines do Fabric
Governanca de dados, linhagem e controle de acesso
Vivencia em consultoria, com contato direto com o cliente
Capacidade de defender decisoes de arquitetura com argumento tecnico
Diferencial: certificacao DP-600',
 'Contrato PJ com valor compativel com a senioridade
Trabalho 100% remoto, sem exigencia de mudanca
Horario flexivel, combinado com o time
Autonomia real sobre as decisoes de arquitetura
Apoio para certificacoes Microsoft
Pagamento em dia, na mesma data todo mes',
 'draft', 'pt'),

-- 5 ------------------------------------------------------------------------
('engenheiro-de-ia-e-machine-learning',
 'Engenheiro(a) de IA e Machine Learning',
 'IA e Machine Learning', 'Remoto, Brasil', 'remoto', 'pj', 'Pleno ou Senior',
 'Leve modelos e aplicacoes de IA do experimento ate a producao, com avaliacao honesta do que realmente funciona.',
 '<p>Voce vai construir as solucoes de IA que entram na operacao dos nossos clientes: previsao de demanda, classificacao de documentos, assistentes sobre base propria. O foco nao e a demonstracao bonita, e o modelo que sustenta uso diario.</p><h3>No dia a dia</h3><ul><li>Desenhar e treinar modelos preditivos sobre dados reais do cliente.</li><li>Construir aplicacoes com LLM, incluindo busca sobre base propria.</li><li>Colocar modelos em producao, com monitoramento e reprocessamento.</li><li>Medir resultado com metrica de negocio, nao so de laboratorio.</li></ul>',
 'Python com as bibliotecas do ecossistema de dados e ML
Experiencia colocando modelo em producao, nao apenas em notebook
Praticas de MLOps, com versionamento de modelo e monitoramento
Trabalho com LLM, incluindo geracao aumentada por recuperacao
SQL e boa leitura de dados
Honestidade tecnica para dizer quando IA nao e a resposta',
 'Contrato PJ com valor compativel com a senioridade
Trabalho 100% remoto, sem exigencia de mudanca
Horario flexivel, combinado com o time
Espaco para pesquisa e prova de conceito
Problemas reais, com dado real e volume de verdade
Pagamento em dia, na mesma data todo mes',
 'draft', 'pt'),

-- 6 ------------------------------------------------------------------------
('estagio-em-dados-e-bi',
 'Estagio em Dados e BI',
 'BI e Analytics', 'Remoto, Brasil', 'remoto', 'estagio', 'Estagio',
 'Primeiro passo em dados, acompanhando projetos reais de BI e engenharia com mentoria de quem faz.',
 '<p>Voce entra junto com o time, nao em um projeto de mentira. Comeca apoiando analises e paineis, aprende SQL na pratica e vai ganhando espaco conforme se sente seguro. Tem uma pessoa responsavel por acompanhar o seu desenvolvimento.</p><h3>No dia a dia</h3><ul><li>Apoiar a construcao de paineis e relatorios.</li><li>Escrever consultas SQL para checar e validar dados.</li><li>Documentar indicadores e regras de negocio.</li><li>Participar das reunioes do time e das cerimonias do projeto.</li></ul>',
 'Cursando tecnologia, engenharia, estatistica, matematica ou area proxima
Nocoes de SQL e vontade de aprender de verdade
Excel ou Planilhas em nivel intermediario
Organizacao e cuidado com detalhe
Disponibilidade de 6 horas por dia
Diferencial: ter mexido em Power BI, mesmo que em curso',
 'Bolsa-auxilio compativel com o mercado
Estagio 100% remoto
Mentoria com pessoa responsavel pelo seu desenvolvimento
Horario compativel com a faculdade
Possibilidade de efetivacao ao final',
 'draft', 'pt'),

-- 7 ------------------------------------------------------------------------
('estagio-em-rh',
 'Estagio em RH',
 'Pessoas e Cultura', 'Remoto, Brasil', 'remoto', 'estagio', 'Estagio',
 'Apoie o dia a dia de gente e cultura numa consultoria de dados, do primeiro contato com quem se candidata ate a entrada da pessoa no time.',
 '<p>Voce vai acompanhar de perto como se monta um time tecnico. Ajuda na triagem das candidaturas que chegam pelo site, organiza entrevistas, cuida da documentacao de quem entra e participa das acoes de cultura. Tem uma pessoa responsavel por acompanhar o seu desenvolvimento.</p><h3>No dia a dia</h3><ul><li>Fazer a triagem inicial das candidaturas e responder quem se candidatou.</li><li>Agendar entrevistas e organizar a agenda do processo seletivo.</li><li>Acompanhar a entrada de novas pessoas, com contrato e documentacao em ordem.</li><li>Manter os dados do time organizados e atualizados.</li><li>Apoiar acoes de cultura e comunicacao interna.</li></ul>',
 'Cursando Psicologia, Administracao, Gestao de RH ou area proxima
Boa escrita, porque voce vai falar direto com quem se candidata
Organizacao e cuidado com prazo
Excel ou Planilhas em nivel intermediario
Discricao com informacao confidencial
Diferencial: ter tido contato com recrutamento, mesmo que em projeto de faculdade',
 'Bolsa-auxilio compativel com o mercado
Estagio 100% remoto
Mentoria com pessoa responsavel pelo seu desenvolvimento
Horario compativel com a faculdade
Possibilidade de efetivacao ao final',
 'draft', 'pt')

on conflict (slug) do nothing;

-- Conferencia:
-- select slug, title, work_model, contract_type, status from job order by created_at;
