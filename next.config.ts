import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuração do Emotion
  compiler: {
    emotion: true,
  },


  // Otimizações de performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@emotion/react', '@emotion/styled'],
  },

  // Configurações de imagem para melhor performance
  images: {
    // Otimização LIGADA. O motivo antigo do "unoptimized" era 429 do storage
    // Contabo, mas o Contabo só serve VÍDEOS no DALT — nenhuma <Image> passa pelo
    // otimizador remoto. Assim as imagens locais ganham srcset responsivo +
    // webp/avif sob demanda. As pesadas do /public já foram recomprimidas.
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 horas de cache (era 60 segundos)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eu2.contabostorage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Compressão e otimizações
  compress: true,
  poweredByHeader: false,

  // Configurações de build
  // swcMinify: true,
  output: 'standalone', // Para Docker build otimizado

  // Headers de segurança e performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // HSTS: força HTTPS por 2 anos (o site já é HTTPS-only).
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Restringe APIs sensíveis do navegador que o site não usa.
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            // Isolamento de origem; "allow-popups" preserva o Typebot/GTM que abrem janelas.
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
