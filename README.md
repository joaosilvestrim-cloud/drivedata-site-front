# DriveData Landing Page

Uma landing page moderna e otimizada para performance e SEO, construída com Next.js 16 e Emotion.

## 🚀 Características

### Performance

- **Next.js 16** com App Router
- **Emotion** para styled components com SSR
- **Otimizações de imagem** (WebP, AVIF)
- **Compressão** e minificação automática
- **Headers de cache** otimizados
- **Fontes otimizadas** com display: swap

### SEO e Indexação

- **Metadata dinâmica** com Open Graph e Twitter Cards
- **Schema.org JSON-LD** para dados estruturados
- **Sitemap** e robots.txt automáticos
- **Headers de segurança** configurados
- **PWA** com manifest.json

### Design System

- **Tema centralizado** com cores, tipografia e espaçamentos
- **Componentes reutilizáveis** (Button, Card, Grid, etc.)
- **Responsive design** mobile-first
- **Acessibilidade** com focus states e ARIA

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout principal com SEO
│   └── page.tsx            # Página inicial da landing
├── common/
│   ├── components/ # Pasta de componentes
│   ├── providers/
│   │   └── EmotionProvider.tsx  # Provider do Emotion
│   ├── seo/
│   │   └── index.ts        # Configurações de SEO
│   └── theme/
│       ├── index.ts        # Tema centralizado
│       └── GlobalStyles.tsx # Estilos globais
└── public/
    └── manifest.json       # PWA manifest
```

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Emotion** - CSS-in-JS
- **ESLint** - Linting

## 🚀 Como executar

### Desenvolvimento Local

```bash
# Instalar dependências
yarn install

# Executar em desenvolvimento
yarn dev

# Build para produção
yarn build

# Executar build de produção
yarn start
```

### 🐳 Deploy com Docker

#### Opção 1: Docker Compose (Recomendado)

```bash
# Build e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f
```

#### Opção 2: Script de Deploy

```bash
# Deploy local
./deploy.sh local

# Deploy para staging
./deploy.sh staging

# Deploy para produção
./deploy.sh production
```

#### Opção 3: Docker Direto

```bash
# Build
docker build -t drive-data-lp-front:latest .

# Run
docker run -d \
  --name drive-data-lp-front \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.drivedata.com.br \
  drive-data-lp-front:latest
```

📖 Para mais detalhes, consulte o [Guia de Deploy com Docker](./DOCKER-DEPLOY.md)

## 📱 PWA

A aplicação está configurada como PWA com:

- Manifest.json para instalação
- Service Worker (próximo passo)
- Ícones responsivos
- Tema color otimizado

## 🎨 Design System

### Cores

- **Primary**: Azul (#0ea5e9)
- **Secondary**: Cinza (#64748b)
- **Success**: Verde (#22c55e)
- **Warning**: Amarelo (#f59e0b)
- **Error**: Vermelho (#ef4444)

### Tipografia

- **Font**: Inter (Google Fonts)
- **Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
- **Weights**: thin, light, normal, medium, semibold, bold

### Componentes

- **Container**: Layout responsivo
- **Grid**: Sistema de grid flexível
- **Button**: Múltiplas variantes
- **Card**: Cards com hover effects
- **Badge**: Badges coloridos
- **Heading/Text**: Tipografia consistente

## 🔧 Configurações

### Next.js

- Emotion compiler habilitado
- Otimizações de CSS
- Headers de segurança
- Compressão ativa

### SEO

- Metadata dinâmica
- Open Graph completo
- Twitter Cards
- Schema.org estruturado
- Robots.txt otimizado

## 📈 Performance

- **Core Web Vitals** otimizados
- **Lighthouse Score** 90+
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1

## 🎯 Próximos Passos

1. **Adicionar mais seções** (testimonials, pricing, contact)
2. **Implementar animações** (Framer Motion)
3. **Adicionar formulários** (React Hook Form)
4. **Integrar analytics** (Google Analytics)
5. **Implementar testes** (Jest + Testing Library)
6. **Adicionar Storybook** para documentação
7. **Configurar CI/CD** (GitHub Actions)

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.
