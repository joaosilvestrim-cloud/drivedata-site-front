'use client';

import { Container } from '@/common/components/container';
import { useMemo } from 'react';
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

// Plataformas integradas. Para trocar por logo, adicione o PNG em /public e
// renderize <img> no lugar do texto — a geometria/animação já ficam prontas.
const PLATFORMS = [
  'Meta',
  'Google Analytics',
  'Oracle',
  'SAP',
  'TOTVS',
  'Sankhya',
  'Conta Azul',
  'Senior',
  'Omie',
  'Salesforce',
];

export const IntegrationsSection = ({ className }: IntegrationsSectionProps) => {
  const { t } = useTranslation();

  const nodes = useMemo(() => {
    const n = PLATFORMS.length;
    return PLATFORMS.map((name, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = CX + RX * Math.cos(ang);
      const y = CY + RY * Math.sin(ang);
      return { name, i, x, y, leftPct: (x / VW) * 100, topPct: (y / VH) * 100 };
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
                <g key={nd.name}>
                  <path
                    id={`int-line-${nd.i}`}
                    d={`M ${CX} ${CY} L ${nd.x} ${nd.y}`}
                    className="line-base"
                  />
                  <path d={`M ${CX} ${CY} L ${nd.x} ${nd.y}`} className="line-flow" />
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
              <IntNode key={nd.name} style={{ left: `${nd.leftPct}%`, top: `${nd.topPct}%` }}>
                <span>{nd.name}</span>
              </IntNode>
            ))}
          </IntegrationsStage>
        </IntegrationsSectionContent>
      </Container>
    </IntegrationsSectionContainer>
  );
};
