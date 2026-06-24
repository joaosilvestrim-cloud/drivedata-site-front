'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { GlowCard } from '../components/GlowCard';
import { SectionReveal } from '../components/SectionReveal';
import { daltTheme } from '../theme';
import { forYouItems } from '../content';

const Section = styled.section`
  padding: 8rem 1.5rem;
  background: ${daltTheme.colors.bg};
`;

const Inner = styled.div`
  max-width: 900px;
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

const Card = styled(GlowCard)`
  padding: 2.25rem;
`;

const CardTitle = styled.h3`
  font-family: ${daltTheme.fonts.heading};
  font-size: 0.9375rem;
  font-weight: 700;
  margin-bottom: 1.75rem;
`;

const PositiveTitle = styled(CardTitle)`
  color: ${daltTheme.colors.primary};
`;

const NegativeTitle = styled(CardTitle)`
  color: ${daltTheme.colors.textSecondary};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
`;

const ListItem = styled.li`
  display: flex;
  gap: 0.75rem;
  font-family: ${daltTheme.fonts.body};
  font-size: 0.875rem;
  line-height: 1.65;
`;

const PositiveText = styled.span`
  color: ${daltTheme.colors.textSecondary};
`;

const NegativeText = styled.span`
  color: ${daltTheme.colors.textMuted};
`;

const IconCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{ flexShrink: 0, marginTop: '2px' }}
  >
    <path
      d="M3 8l3.5 3.5L13 5"
      stroke="#00e5a0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconX = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{ flexShrink: 0, marginTop: '2px' }}
  >
    <path
      d="M4 4l8 8M12 4l-8 8"
      stroke="#545e72"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export function ForYouSection() {
  return (
    <Section>
      <Inner>
        <SectionReveal>
          <Header>
            <Title>
              Tecnologia Para Quem Decide o Futuro de{' '}
              <GradientSpan>Grandes Operações</GradientSpan>
            </Title>
          </Header>
        </SectionReveal>

        <Grid>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
          >
            <Card active>
              <PositiveTitle>A Dalt DriveData é para você se:</PositiveTitle>
              <List>
                {forYouItems.isFor.map((item, i) => (
                  <ListItem key={i}>
                    <IconCheck />
                    <PositiveText>{item}</PositiveText>
                  </ListItem>
                ))}
              </List>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          >
            <Card>
              <NegativeTitle>A Dalt DriveData NÃO é para você se:</NegativeTitle>
              <List>
                {forYouItems.isNotFor.map((item, i) => (
                  <ListItem key={i}>
                    <IconX />
                    <NegativeText>{item}</NegativeText>
                  </ListItem>
                ))}
              </List>
            </Card>
          </motion.div>
        </Grid>
      </Inner>
    </Section>
  );
}
