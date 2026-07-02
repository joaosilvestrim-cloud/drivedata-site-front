'use client';

import { Container } from '@/common/components/container';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IntConnectorSvg,
  IntHub,
  IntNode,
  IntegrationsDescription,
  IntegrationsHeader,
  IntegrationsSectionContainer,
  IntegrationsSectionContent,
  IntegrationsStage,
  IntegrationsTitle,
  IntegrationsTitleHighlight,
} from './styles';
import { IntegrationsSectionProps } from './types';

// viewBox do palco — mantém as linhas SVG alinhadas aos nós em qualquer largura
const VW = 1040;
const VH = 640;
const CX = VW / 2;
const CY = VH / 2;
const RX = 400;
const RY = 250;
const HUB_R = 96; // raio do núcleo (viewBox) — as linhas saem da BORDA dele, não do centro

// Para exibir o logo real, coloque o PNG (fundo transparente) em
// /public/integrations/<slug>.png. Enquanto não existir, cai no nome em texto.
const PLATFORMS = [
  { name: 'Meta', slug: 'meta' },
  { name: 'Google Analytics', slug: 'google-analytics' },
  { name: 'Oracle', slug: 'oracle' },
  { name: 'SAP', slug: 'sap' },
  { name: 'TOTVS', slug: 'totvs' },
  { name: 'Sankhya', slug: 'sankhya' },
  { name: 'Conta Azul', slug: 'conta-azul' },
  { name: 'Senior', slug: 'senior' },
  { name: 'Omie', slug: 'omie' },
  { name: 'Salesforce', slug: 'salesforce' },
];

// Logo com fallback automático pro nome (enquanto o PNG não estiver em /public/integrations)
const NodeBody = ({ name, slug }: { name: string; slug: string }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <span>{name}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/integrations/${slug}.png`} alt={name} onError={() => setFailed(true)} />
  );
};

export const IntegrationsSection = ({ className }: IntegrationsSectionProps) => {
  const { t } = useTranslation();

  const nodes = useMemo(() => {
    const n = PLATFORMS.length;
    return PLATFORMS.map((p, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = CX + RX * Math.cos(ang);
      const y = CY + RY * Math.sin(ang);
      const dx = x - CX;
      const dy = y - CY;
      const len = Math.hypot(dx, dy) || 1;
      const sx = CX + (dx / len) * HUB_R;
      const sy = CY + (dy / len) * HUB_R;
      return { ...p, i, x, y, sx, sy, leftPct: (x / VW) * 100, topPct: (y / VH) * 100 };
    });
  }, []);

  return (
    <IntegrationsSectionContainer className={className}>
      <Container>
        <IntegrationsSectionContent>
          <IntegrationsHeader>
            <IntegrationsTitle>
              {t('integrationsSection.title')}{' '}
              <IntegrationsTitleHighlight>
                {t('integrationsSection.titleHighlight')}
              </IntegrationsTitleHighlight>
            </IntegrationsTitle>
            <IntegrationsDescription>
              {t('integrationsSection.description')}
            </IntegrationsDescription>
          </IntegrationsHeader>

          <IntegrationsStage>
            <IntConnectorSvg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="intLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0a96ec" />
                  <stop offset="100%" stopColor="#54da89" />
                </linearGradient>
                <filter id="intGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {nodes.map((nd) => (
                <g key={nd.slug}>
                  <path
                    id={`int-line-${nd.i}`}
                    d={`M ${nd.sx} ${nd.sy} L ${nd.x} ${nd.y}`}
                    className="line-base"
                  />
                  <path d={`M ${nd.sx} ${nd.sy} L ${nd.x} ${nd.y}`} className="line-flow" />
                  <circle className="packet" r="3.4">
                    <animateMotion dur="3.2s" repeatCount="indefinite" begin={`${nd.i * 0.32}s`}>
                      <mpath href={`#int-line-${nd.i}`} />
                    </animateMotion>
                  </circle>
                </g>
              ))}
            </IntConnectorSvg>

            <IntHub>
              <span className="brand">DriveData</span>
              <span className="sub">
                {t('integrationsSection.hubLabel', 'Todos os seus dados, num só lugar')}
              </span>
            </IntHub>

            {nodes.map((nd) => (
              <IntNode key={nd.slug} style={{ left: `${nd.leftPct}%`, top: `${nd.topPct}%` }}>
                <NodeBody name={nd.name} slug={nd.slug} />
              </IntNode>
            ))}
          </IntegrationsStage>
        </IntegrationsSectionContent>
      </Container>
    </IntegrationsSectionContainer>
  );
};
