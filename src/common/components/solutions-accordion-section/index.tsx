'use client';

import { Container } from '@/common/components/container';
import { LoadingOverlay } from '@/common/components/loading-overlay';
import { useSolutions } from '@/modules/solution/hooks/use-solutions';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ConnectorSvg,
  DetailBody,
  DetailIndex,
  DetailPanel,
  DetailTitle,
  EcosystemStage,
  HubNode,
  MobileGrid,
  NodeCard,
  NodeIcon,
  NodeIconImg,
  NodeLabel,
  SolutionNode,
  SolutionsSectionContainer,
  SolutionsSectionContent,
  SolutionsDescription,
  SolutionsTitle,
} from './styles';
import { SolutionsAccordionSectionProps } from './types';

// viewBox do palco (mantém as linhas SVG alinhadas com os nós em qualquer largura)
const VW = 1040;
const VH = 640;
const CX = VW / 2;
const CY = VH / 2;
const RX = 402;
const RY = 244;

export const SolutionsAccordionSection = ({ className, solutions }: SolutionsAccordionSectionProps) => {
  const { t } = useTranslation();
  const { data: dynamicSolutions, isLoading } = useSolutions(solutions);
  const [activeId, setActiveId] = useState<string | null>(null);

  const nodes = useMemo(() => {
    const n = dynamicSolutions.length || 1;
    return dynamicSolutions.map((s, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = CX + RX * Math.cos(ang);
      const y = CY + RY * Math.sin(ang);
      return { ...s, i, x, y, leftPct: (x / VW) * 100, topPct: (y / VH) * 100 };
    });
  }, [dynamicSolutions]);

  const active =
    dynamicSolutions.find((s) => s.id === activeId) ?? dynamicSolutions[0] ?? null;
  const activeIndex = dynamicSolutions.findIndex((s) => s.id === (active?.id ?? ''));

  return (
    <SolutionsSectionContainer id="solucoes" className={className}>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay isLoading={isLoading} />
        <Container>
          <SolutionsSectionContent>
            <SolutionsTitle>{t('solutionsAccordionSection.title')}</SolutionsTitle>
            <SolutionsDescription>
              {t('solutionsAccordionSection.description')}
            </SolutionsDescription>
          </SolutionsSectionContent>

          {/* ── Ecossistema radial (desktop) ─────────────────────── */}
          <EcosystemStage>
            <ConnectorSvg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="ecoLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0a96ec" />
                  <stop offset="100%" stopColor="#54da89" />
                </linearGradient>
                <filter id="ecoGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {nodes.map((nd) => {
                const on = active?.id === nd.id;
                return (
                  <g key={nd.id} className={on ? 'conn active' : 'conn'}>
                    <path
                      id={`line-${nd.i}`}
                      d={`M ${CX} ${CY} L ${nd.x} ${nd.y}`}
                      className="line-base"
                    />
                    <path
                      d={`M ${CX} ${CY} L ${nd.x} ${nd.y}`}
                      className="line-flow"
                    />
                    <circle className="packet" r="3.4">
                      <animateMotion
                        dur="3.1s"
                        repeatCount="indefinite"
                        begin={`${nd.i * 0.45}s`}
                      >
                        <mpath href={`#line-${nd.i}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              })}
            </ConnectorSvg>

            <HubNode>
              <span className="brand">DriveData</span>
              <span className="sub">
                {t('solutionsAccordionSection.hubTitle', 'Ecossistema de Dados & Estratégia')}
              </span>
            </HubNode>

            {nodes.map((nd) => (
              <SolutionNode
                key={nd.id}
                style={{ left: `${nd.leftPct}%`, top: `${nd.topPct}%` }}
                data-active={active?.id === nd.id}
                onMouseEnter={() => setActiveId(nd.id)}
                onClick={() => setActiveId(nd.id)}
              >
                <NodeIcon>
                  {nd.icon ? <NodeIconImg src={nd.icon} alt="" /> : null}
                </NodeIcon>
                <NodeLabel>{nd.title}</NodeLabel>
              </SolutionNode>
            ))}
          </EcosystemStage>

          {/* ── Grade de nós (mobile) ────────────────────────────── */}
          <MobileGrid>
            {nodes.map((nd) => (
              <NodeCard
                key={nd.id}
                data-active={active?.id === nd.id}
                onClick={() => setActiveId(nd.id)}
              >
                <NodeIcon>
                  {nd.icon ? <NodeIconImg src={nd.icon} alt="" /> : null}
                </NodeIcon>
                <NodeLabel>{nd.title}</NodeLabel>
              </NodeCard>
            ))}
          </MobileGrid>

          {/* ── Painel de detalhe da solução ativa ───────────────── */}
          {active && (
            <DetailPanel key={active.id}>
              <DetailIndex>{String(activeIndex + 1).padStart(2, '0')}</DetailIndex>
              <div>
                <DetailTitle>{active.title}</DetailTitle>
                <DetailBody dangerouslySetInnerHTML={{ __html: active.content }} />
              </div>
            </DetailPanel>
          )}
        </Container>
      </div>
    </SolutionsSectionContainer>
  );
};
