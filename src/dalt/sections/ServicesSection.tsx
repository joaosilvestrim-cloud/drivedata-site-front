'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { GlowCard } from '../components/GlowCard';
import { SectionReveal } from '../components/SectionReveal';
import { daltTheme } from '../theme';
import { services } from '../content';

const Section = styled.section`
  padding: 8rem 1.5rem;
  background: ${daltTheme.gradients.sectionFade};
  position: relative;
`;

const Inner = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.p`
  font-family: ${daltTheme.fonts.body};
  font-size: 0.6875rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${daltTheme.colors.primary};
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: ${daltTheme.fonts.heading};
  font-size: clamp(1.875rem, 4vw, 3rem);
  font-weight: 800;
  color: ${daltTheme.colors.textPrimary};
  line-height: 1.15;
`;

const GradientSpan = styled.span`
  background: ${daltTheme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ServiceCard = styled(GlowCard)`
  padding: 2.25rem;
`;

const CardTitle = styled.h3`
  font-family: ${daltTheme.fonts.heading};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${daltTheme.colors.textPrimary};
  margin-bottom: 1.5rem;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Item = styled.li`
  display: flex;
  gap: 0.75rem;
  font-family: ${daltTheme.fonts.body};
  font-size: 0.875rem;
  color: ${daltTheme.colors.textSecondary};
  line-height: 1.65;
`;

const Dot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${daltTheme.colors.primary};
  flex-shrink: 0;
  margin-top: 7px;
`;

export function ServicesSection() {
  return (
    <Section>
      <Inner>
        <SectionReveal>
          <Header>
            <Eyebrow>Serviços</Eyebrow>
            <Title>
              Especialistas em desenvolvimento de{' '}
              <GradientSpan>alta complexidade</GradientSpan> e Missão Crítica
            </Title>
          </Header>
        </SectionReveal>

        <Grid>
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: i * 0.15, ease: [0.25, 1, 0.5, 1] }}
            >
              <ServiceCard>
                <CardTitle>{service.title}</CardTitle>
                <ItemList>
                  {service.items.map((item, j) => (
                    <Item key={j}>
                      <Dot />
                      {item}
                    </Item>
                  ))}
                </ItemList>
              </ServiceCard>
            </motion.div>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
