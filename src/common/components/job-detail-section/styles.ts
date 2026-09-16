import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { theme } from '../../theme';

export const Section = styled.section`
  position: relative;
  padding: 140px 24px 96px;
  color: var(--dd-text);

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 112px 20px 72px;
  }
`;

export const Inner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
`;

export const Back = styled(Link)`
  display: inline-block;
  margin-bottom: 26px;
  font-size: 14px;
  color: var(--dd-text-2);
  text-decoration: none;
  &:hover {
    color: var(--dd-primary);
  }
`;

export const Head = styled.header`
  padding-bottom: 30px;
  border-bottom: 1px solid var(--dd-border);
`;

export const Kicker = styled.p`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--dd-primary);
`;

export const Title = styled.h1`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(30px, 3.8vw, 48px);
  line-height: 1.08;
  letter-spacing: -1.2px;
  font-weight: 800;
  margin: 0;
  max-width: 820px;
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;

  span {
    font-size: 13px;
    color: var(--dd-text-2);
    border: 1px solid var(--dd-border);
    border-radius: 999px;
    padding: 6px 12px;
  }
`;

export const Share = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;

  > span {
    font-size: 13px;
    color: var(--dd-text-muted);
    margin-right: 4px;
  }
`;

const shareCss = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--dd-text);
  background: var(--dd-surf-2);
  border: 1px solid var(--dd-border);
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;

  svg {
    width: 15px;
    height: 15px;
  }
  &:hover {
    border-color: var(--dd-border-active);
    background: var(--dd-surf-3);
  }
  &:focus-visible {
    outline: 2px solid var(--dd-primary);
    outline-offset: 2px;
  }
`;

export const ShareBtn = styled.button`
  ${shareCss}
`;

export const ShareLink = styled.a`
  ${shareCss}
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 48px;
  margin-top: 36px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

export const Content = styled.div`
  min-width: 0;
`;

export const Lead = styled.p`
  margin: 0 0 8px;
  font-size: 18px;
  line-height: 1.65;
  color: var(--dd-text-2);
`;

export const H2 = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
  margin: 34px 0 12px;
`;

export const Prose = styled.div`
  font-size: 16px;
  line-height: 1.75;
  color: var(--dd-text-2);

  p {
    margin: 0 0 14px;
  }
  h2,
  h3 {
    color: var(--dd-text);
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 18px;
    margin: 22px 0 8px;
  }
  ul,
  ol {
    margin: 0 0 14px;
    padding-left: 22px;
  }
  li {
    margin: 6px 0;
  }
  a {
    color: var(--dd-primary);
  }
  strong {
    color: var(--dd-text);
  }
`;

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;

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
`;

export const Dates = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin-top: 36px;
  padding-top: 18px;
  border-top: 1px solid var(--dd-border);
  font-size: 13px;
  color: var(--dd-text-muted);
`;

export const Aside = styled.aside`
  position: sticky;
  top: 120px;

  @media (max-width: 960px) {
    position: static;
  }
`;

const card = css`
  display: block;
  padding: 26px;
  border: 1px solid var(--dd-border);
  background: var(--dd-surf-1);
  border-radius: 18px;
`;

export const FormCard = styled.div`
  ${card}
`;

export const Form = styled.form`
  ${card}
`;

export const FormTitle = styled.h2`
  margin: 0 0 4px;
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
`;

export const FormSub = styled.p`
  margin: 0 0 22px;
  font-size: 14px;
  color: var(--dd-text-2);
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: var(--dd-text-2);
  }
  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 15px;
    color: var(--dd-text);
    background: var(--dd-surf-2);
    border: 1px solid var(--dd-border);
    border-radius: 10px;
    padding: 11px 13px;
    outline: none;
    transition: border-color 0.15s;
  }
  input:focus,
  textarea:focus {
    border-color: var(--dd-primary);
  }
  textarea {
    min-height: 96px;
    resize: vertical;
  }
`;

export const FileRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  input[type='file'] {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
  }
  .btn {
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--dd-text);
    background: var(--dd-surf-2);
    border: 1px solid var(--dd-border-active);
    border-radius: 999px;
    padding: 8px 14px;
    transition: background 0.15s;
  }
  .btn:hover {
    background: var(--dd-surf-3);
  }
  input[type='file']:focus-visible + .btn {
    outline: 2px solid var(--dd-primary);
    outline-offset: 2px;
  }
  .name {
    font-size: 13px;
    color: var(--dd-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
`;

/* Honeypot: fora da tela, fora da ordem de tab. Bots preenchem; pessoas não veem. */
export const Honey = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

export const Consent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 6px 0 18px;
  font-size: 13px;
  line-height: 1.5;
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
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  color: var(--dd-danger);
  background: color-mix(in srgb, var(--dd-danger) 12%, transparent);
`;

export const Submit = styled.button`
  width: 100%;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  color: var(--dd-on-brand, #06121f);
  background: linear-gradient(90deg, var(--dd-grad-green), var(--dd-grad-blue));
  border: 0;
  border-radius: 999px;
  padding: 15px 22px;
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
`;

export const ExternalLink = styled.a`
  display: block;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: var(--dd-on-brand, #06121f);
  background: linear-gradient(90deg, var(--dd-grad-green), var(--dd-grad-blue));
  border-radius: 999px;
  padding: 15px 22px;
  text-decoration: none;
`;

export const Success = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;

  strong {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: var(--dd-on-brand, #06121f);
    background: var(--dd-primary);
    font-size: 16px;
  }
  p {
    margin: 4px 0 0;
    font-size: 15px;
    line-height: 1.6;
    color: var(--dd-text-2);
  }
`;
