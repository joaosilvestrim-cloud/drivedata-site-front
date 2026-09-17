import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Page = styled.div`
  color: var(--dd-text);
`;

export const Section = styled.section`
  padding: 88px 24px;

  &:first-of-type {
    padding-top: 150px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 64px 20px;
    &:first-of-type {
      padding-top: 118px;
    }
  }
`;

export const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
`;

export const Kicker = styled.p`
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--dd-primary);
`;

export const Title = styled.h1`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(34px, 4.2vw, 54px);
  line-height: 1.06;
  letter-spacing: -1.4px;
  font-weight: 800;
  margin: 0;
  max-width: 760px;
`;

export const Highlight = styled.span`
  background: linear-gradient(120deg, var(--dd-grad-blue), var(--dd-grad-green));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Intro = styled.p`
  margin: 22px 0 0;
  max-width: 620px;
  font-size: 17px;
  line-height: 1.7;
  color: var(--dd-text-2);
`;

export const Actions = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 34px;
`;

export const PrimaryLink = styled.a`
  font-size: 15px;
  font-weight: 700;
  color: var(--dd-on-brand, #06121f);
  background: linear-gradient(90deg, var(--dd-grad-green), var(--dd-grad-blue));
  border-radius: 999px;
  padding: 15px 28px;
  text-decoration: none;
  transition: transform 0.15s;

  &:hover {
    transform: translateY(-1px);
  }
  &:focus-visible {
    outline: 2px solid var(--dd-primary);
    outline-offset: 3px;
  }
`;

export const GhostLink = styled.a`
  font-size: 15px;
  font-weight: 600;
  color: var(--dd-text);
  background: var(--dd-surf-2);
  border: 1px solid var(--dd-border-active);
  border-radius: 999px;
  padding: 15px 26px;
  text-decoration: none;
  transition: background 0.15s;

  &:hover {
    background: var(--dd-surf-3);
  }
  &:focus-visible {
    outline: 2px solid var(--dd-primary);
    outline-offset: 3px;
  }
`;

/* Números da carteira: contraste puro, sem caixa em volta. */
export const Facts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-top: 56px;
  padding-top: 32px;
  border-top: 1px solid var(--dd-border);

  /* Os três cabem numa linha só; a label é que não pode esticar o item. */
  div {
    flex: 1 1 200px;
    max-width: 290px;
  }
  strong {
    display: block;
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -1px;
    color: var(--dd-text);
    font-variant-numeric: tabular-nums;
  }
  span {
    display: block;
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--dd-text-2);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: 28px;
  }
`;

export const SectionTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(26px, 3vw, 36px);
  line-height: 1.15;
  letter-spacing: -0.9px;
  font-weight: 800;
  margin: 0;
  max-width: 660px;
`;

export const SectionLead = styled.p`
  margin: 16px 0 0;
  max-width: 600px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--dd-text-2);
`;

/* Modelos de parceria: traço da marca à esquerda, sem card fechado. */
export const Models = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-top: 44px;
  background: var(--dd-border);
  border: 1px solid var(--dd-border);
  border-radius: 18px;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const Model = styled.article`
  position: relative;
  padding: 30px 30px 30px 34px;
  background: var(--dd-bg-section, var(--dd-bg));

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 30px;
    bottom: 30px;
    width: 2px;
    background: var(--dd-primary);
    opacity: 0;
    transition: opacity 0.18s;
  }
  &:hover::before {
    opacity: 1;
  }

  .n {
    font-family: ui-monospace, 'SF Mono', monospace;
    font-size: 12px;
    color: var(--dd-text-muted);
  }
  h3 {
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.3px;
    margin: 10px 0 10px;
  }
  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.65;
    color: var(--dd-text-2);
  }
  .for {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--dd-border);
    font-size: 13.5px;
    line-height: 1.55;
    color: var(--dd-text-muted);
  }
  .for b {
    color: var(--dd-text-2);
    font-weight: 600;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 24px 22px 24px 26px;
  }
`;

/* O que o parceiro recebe: lista com traço, não cartão de checks. */
export const Offer = styled.ul`
  margin: 40px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 44px;

  li {
    position: relative;
    padding-left: 22px;
    font-size: 16px;
    line-height: 1.6;
    color: var(--dd-text-2);
  }
  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 11px;
    width: 10px;
    height: 2px;
    border-radius: 2px;
    background: var(--dd-primary);
  }
  li b {
    display: block;
    color: var(--dd-text);
    font-weight: 600;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

/* Como funciona: passos ligados por uma linha. */
export const Steps = styled.ol`
  margin: 44px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  li {
    position: relative;
    padding-top: 28px;
  }
  li::before {
    content: '';
    position: absolute;
    top: 7px;
    left: 0;
    right: -24px;
    height: 1px;
    background: var(--dd-border);
  }
  li:last-child::before {
    right: 0;
  }
  li::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 0;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--dd-primary);
  }
  h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 8px;
  }
  p {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--dd-text-2);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0;

    li {
      padding: 0 0 26px 26px;
    }
    li::before {
      top: 6px;
      bottom: -6px;
      left: 4px;
      right: auto;
      width: 1px;
      height: auto;
    }
    li:last-child::before {
      display: none;
    }
  }
`;

/* Faixa do formulário: fundo levemente destacado para fechar a página. */
export const FormSection = styled.section`
  padding: 88px 24px 110px;
  border-top: 1px solid var(--dd-border);
  background: var(--dd-surf-1);

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 64px 20px 80px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 56px;
  max-width: 1080px;
  margin: 0 auto;
  align-items: start;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

export const FormAside = styled.div`
  h2 {
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.7px;
    margin: 0 0 14px;
  }
  p {
    margin: 0 0 12px;
    font-size: 15.5px;
    line-height: 1.7;
    color: var(--dd-text-2);
  }
  .mail {
    display: inline-block;
    margin-top: 6px;
    font-size: 15px;
    color: var(--dd-primary);
    text-decoration: none;
  }
  .mail:hover {
    text-decoration: underline;
  }
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div<{ full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${(p) => (p.full ? 'grid-column: 1 / -1;' : '')}

  label {
    font-size: 13px;
    font-weight: 600;
    color: var(--dd-text-2);
  }
  input,
  select,
  textarea {
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 15px;
    color: var(--dd-text);
    background: var(--dd-surf-2);
    border: 1px solid var(--dd-border);
    border-radius: 10px;
    padding: 12px 13px;
    outline: none;
    transition: border-color 0.15s;
  }
  input:focus,
  select:focus,
  textarea:focus {
    border-color: var(--dd-primary);
  }
  textarea {
    min-height: 110px;
    resize: vertical;
  }
  select option {
    background: #0d1526;
    color: #eaf0fb;
  }
`;

/* Honeypot: fora da tela e fora da ordem de tab. */
export const Honey = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

export const Consent = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 4px;
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--dd-text-2);

  input {
    margin-top: 3px;
    accent-color: var(--dd-primary);
  }
  a {
    color: var(--dd-primary);
  }
`;

export const ErrorMsg = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  padding: 11px 13px;
  border-radius: 10px;
  font-size: 13.5px;
  color: var(--dd-danger);
  background: color-mix(in srgb, var(--dd-danger) 12%, transparent);
`;

export const Submit = styled.button`
  grid-column: 1 / -1;
  justify-self: start;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  color: var(--dd-on-brand, #06121f);
  background: linear-gradient(90deg, var(--dd-grad-green), var(--dd-grad-blue));
  border: 0;
  border-radius: 999px;
  padding: 15px 34px;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
  &:focus-visible {
    outline: 2px solid var(--dd-primary);
    outline-offset: 3px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    justify-self: stretch;
  }
`;

export const Success = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 28px;
  border: 1px solid var(--dd-border-active);
  border-radius: 18px;

  strong {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: var(--dd-on-brand, #06121f);
    background: var(--dd-primary);
    font-size: 17px;
  }
  h3 {
    margin: 4px 0 8px;
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 700;
  }
  p {
    margin: 0;
    font-size: 15.5px;
    line-height: 1.65;
    color: var(--dd-text-2);
  }
`;
