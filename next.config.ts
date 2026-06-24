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
    unoptimized: true, // Desabilita otimização para evitar 429 errors
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
