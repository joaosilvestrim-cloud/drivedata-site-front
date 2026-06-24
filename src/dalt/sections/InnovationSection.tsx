'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { SectionReveal } from '../components/SectionReveal';
import { daltTheme } from '../theme';
import { innovationVideos } from '../content';

const Section = styled.section`
  padding: 8rem 1.5rem;
  background: ${daltTheme.gradients.sectionFade};
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-family: ${daltTheme.fonts.heading};
  font-size: clamp(1.875rem, 4vw, 3rem);
  font-weight: 800;
  color: ${daltTheme.colors.textPrimary};
  margin-bottom: 1.25rem;
  line-height: 1.15;
`;

const GradientSpan = styled.span`
  background: ${daltTheme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Body = styled.p`
  font-family: ${daltTheme.fonts.body};
  font-size: 1.0625rem;
  line-height: 1.75;
  color: ${daltTheme.colors.textSecondary};
  max-width: 680px;
  margin: 0 auto;
`;

const CardsGrid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const VideoCard = styled.div`
  display: block;
  padding: 1.75rem;
  position: relative;
  overflow: hidden;
  background: ${daltTheme.gradients.cardBg};
  border: 1px solid ${daltTheme.colors.border};
  border-radius: ${daltTheme.radius.lg};
  box-shadow: ${daltTheme.shadows.card};
  transition: border-color 0.4s ${daltTheme.animation.easing},
              box-shadow 0.4s ${daltTheme.animation.easing};

  &:hover {
    border-color: ${daltTheme.colors.borderActive};
    box-shadow: ${daltTheme.shadows.glowPrimary}, ${daltTheme.shadows.card};
  }
`;

const VideoWrap = styled.div`
  margin: -1.75rem -1.75rem 1.25rem;
  overflow: hidden;
  border-radius: ${daltTheme.radius.lg} ${daltTheme.radius.lg} 0 0;
`;

const Video = styled.video`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: ${daltTheme.colors.bgSection};
`;

const CardTag = styled.span`
  font-family: ${daltTheme.fonts.body};
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${daltTheme.colors.textMuted};
  margin-bottom: 0.625rem;
  display: block;
`;

const CardTitle = styled.h3`
  font-family: ${daltTheme.fonts.heading};
  font-size: 1rem;
  font-weight: 700;
  color: ${daltTheme.colors.textPrimary};
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;

  ${VideoCard}:hover & {
    color: ${daltTheme.colors.primary};
  }
`;

const CardDesc = styled.p`
  font-family: ${daltTheme.fonts.body};
  font-size: 0.8125rem;
  color: ${daltTheme.colors.textSecondary};
  line-height: 1.6;
`;

export function InnovationSection() {
  return (
    <Section>
      <Inner>
        <SectionReveal>
          <Header>
            <Title>
              Inovação e <GradientSpan>Resultado</GradientSpan>
            </Title>
            <Body>
              Processos inteligentes e infraestrutura robusta desenhados para sustentar
              estratégias de quem deseja liderar o mercado com os mais rigorosos padrões
              globais de governança e segurança de dados.
            </Body>
          </Header>
        </SectionReveal>

        <CardsGrid>
          {innovationVideos.map((video, i) => (
            <motion.div
              key={video.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.13, ease: [0.25, 1, 0.5, 1] }}
            >
              <VideoCard>
                <VideoWrap>
                  <Video controls playsInline preload="metadata">
                    <source src={video.videoUrl} type="video/mp4" />
                  </Video>
                </VideoWrap>
                <CardTag>Case de Sucesso</CardTag>
                <CardTitle>{video.title}</CardTitle>
                <CardDesc>{video.description}</CardDesc>
              </VideoCard>
            </motion.div>
          ))}
        </CardsGrid>
      </Inner>
    </Section>
  );
}
