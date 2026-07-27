'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, Eyebrow, SectionTitle, Subtitle, HeadCentered, Card, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Tag = styled.span`
  display: inline-block;
  font-family: ${tk.fonts.body};
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${tk.colors.primary};
  padding: 5px 11px;
  border-radius: 999px;
  background: ${tk.colors.primaryDim};
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-family: ${tk.fonts.heading};
  font-size: 19px;
  font-weight: 700;
  color: ${tk.colors.textPrimary};
  line-height: 1.25;
`;

const Desc = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 14px;
  line-height: 1.6;
  color: ${tk.colors.textSecondary};
  margin: 12px 0 18px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

const Item = styled.li`
  display: flex;
  gap: 10px;
  font-family: ${tk.fonts.body};
  font-size: 13.5px;
  line-height: 1.5;
  color: ${tk.colors.textSecondary};

  &::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: ${tk.colors.primary};
    flex-shrink: 0;
    margin-top: 7px;
    box-shadow: 0 0 8px rgba(84, 218, 137, 0.6);
  }
`;

export function PillarsSection() {
  const { copy } = usePortal();
  const p = copy.pillars;

  return (
    <Section id="pilares">
      <Glow y="0%" x="80%" color="rgba(84,218,137,0.12)" />
      <Inner>
        <HeadCentered>
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <SectionTitle>{p.title}</SectionTitle>
          <Subtitle>{p.subtitle}</Subtitle>
        </HeadCentered>
        <Grid>
          {p.items.map((it, i) => (
            <Reveal key={it.tag} delay={i * 0.12}>
              <Card style={{ height: '100%' }}>
                <Tag>{it.tag}</Tag>
                <CardTitle>{it.title}</CardTitle>
                <Desc>{it.desc}</Desc>
                <List>
                  {it.points.map((pt) => <Item key={pt}>{pt}</Item>)}
                </List>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
