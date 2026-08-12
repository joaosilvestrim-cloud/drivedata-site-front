'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, Eyebrow, SectionTitle, Subtitle, HeadCentered, Card, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';
import { openBooking } from '../booking';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const TimeBadge = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid ${tk.colors.borderActive};
  background: ${tk.colors.primaryDim};
  margin-bottom: 20px;

  span.l { font-family: ${tk.fonts.body}; font-size: 12px; font-weight: 600; color: ${tk.colors.textSecondary}; text-transform: uppercase; letter-spacing: 0.06em; }
  span.v { font-family: ${tk.fonts.heading}; font-size: 16px; font-weight: 800; color: ${tk.colors.primary}; }
`;

const BlockTitle = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${tk.colors.textMuted};
  margin: 22px 0 12px;
`;

const Modes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

const Mode = styled.div`
  border: 1px solid ${tk.colors.border};
  border-radius: ${tk.radius.md};
  padding: 16px;
  background: ${tk.colors.surfaceSubtle};
  strong { display: block; font-family: ${tk.fonts.heading}; font-size: 15px; font-weight: 800; color: ${tk.colors.textPrimary}; margin-bottom: 4px; }
  span   { font-family: ${tk.fonts.body}; font-size: 13px; line-height: 1.55; color: ${tk.colors.textSecondary}; }
`;

const Prereqs = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    position: relative;
    padding-left: 28px;
    font-family: ${tk.fonts.body};
    font-size: 14.5px;
    line-height: 1.5;
    color: ${tk.colors.textSecondary};
  }
  li::before {
    content: '✓';
    position: absolute;
    left: 0; top: 0;
    width: 19px; height: 19px;
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 50%;
    background: ${tk.colors.primaryDim};
    color: ${tk.colors.primary};
    font-size: 11px; font-weight: 800;
  }
`;

const Steps = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  counter-reset: step;
`;

const Step = styled.li`
  position: relative;
  counter-increment: step;
  padding: 0 0 22px 52px;

  &::before {
    content: counter(step);
    position: absolute; left: 0; top: 0;
    width: 34px; height: 34px;
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 50%;
    background: ${tk.gradients.brand};
    color: #fff; font-family: ${tk.fonts.heading}; font-weight: 800; font-size: 14px;
    z-index: 1;
  }
  /* linha conectando os passos */
  &::after {
    content: '';
    position: absolute; left: 16.5px; top: 34px; bottom: 0;
    width: 1px; background: ${tk.colors.border};
  }
  &:last-child::after { display: none; }

  strong { display: block; font-family: ${tk.fonts.heading}; font-size: 15.5px; font-weight: 800; color: ${tk.colors.textPrimary}; margin-bottom: 3px; }
  span   { font-family: ${tk.fonts.body}; font-size: 13.5px; line-height: 1.6; color: ${tk.colors.textSecondary}; }
`;

const CtaBtn = styled.button`
  margin: 40px auto 0;
  display: block;
  font-family: ${tk.fonts.body};
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: ${tk.gradients.brand};
  border: 0;
  border-radius: 999px;
  padding: 14px 30px;
  cursor: pointer;
  transition: transform 0.25s ${tk.easing}, box-shadow 0.25s ${tk.easing};
  box-shadow: ${tk.shadows.card};
  &:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(10,150,236,0.28); }
`;

export function InstallSection() {
  const { copy } = usePortal();
  const i = copy.install;

  return (
    <Section id="instalacao">
      <Glow y="-8%" x="50%" />
      <Inner>
        <HeadCentered>
          <Eyebrow>{i.eyebrow}</Eyebrow>
          <SectionTitle>{i.title}</SectionTitle>
          <Subtitle>{i.subtitle}</Subtitle>
        </HeadCentered>

        <Reveal>
          <Grid>
            <Card>
              <TimeBadge><span className="l">{i.timeLabel}</span><span className="v">{i.timeValue}</span></TimeBadge>
              <BlockTitle style={{ marginTop: 0 }}>{i.modesTitle}</BlockTitle>
              <Modes>
                {i.modes.map(m => (
                  <Mode key={m.title}><strong>{m.title}</strong><span>{m.desc}</span></Mode>
                ))}
              </Modes>
              <BlockTitle>{i.prereqTitle}</BlockTitle>
              <Prereqs>
                {i.prereqs.map(p => <li key={p}>{p}</li>)}
              </Prereqs>
            </Card>

            <Card>
              <BlockTitle style={{ marginTop: 0 }}>{i.stepsTitle}</BlockTitle>
              <Steps>
                {i.steps.map(s => (
                  <Step key={s.title}><strong>{s.title}</strong><span>{s.desc}</span></Step>
                ))}
              </Steps>
            </Card>
          </Grid>
        </Reveal>

        <CtaBtn type="button" onClick={openBooking}>{i.cta}</CtaBtn>
      </Inner>
    </Section>
  );
}
