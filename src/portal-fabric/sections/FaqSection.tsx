'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, Eyebrow, SectionTitle, Subtitle, HeadCentered, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';

const SectionAlt = styled(Section)`
  background: ${tk.colors.bgSection};
`;

const List = styled.div`
  max-width: 780px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div<{ open: boolean }>`
  border: 1px solid ${({ open }) => (open ? tk.colors.borderActive : tk.colors.border)};
  border-radius: ${tk.radius.md};
  background: ${tk.colors.bgCard};
  overflow: hidden;
  transition: border-color 0.25s ${tk.easing};
`;

const Q = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: none;
  border: 0;
  cursor: pointer;
  text-align: left;

  span.t { flex: 1; font-family: ${tk.fonts.heading}; font-size: 15.5px; font-weight: 700; color: ${tk.colors.textPrimary}; }
  span.i {
    flex-shrink: 0;
    width: 24px; height: 24px;
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 50%;
    background: ${tk.colors.primaryDim};
    color: ${tk.colors.primary};
    font-size: 16px; font-weight: 700; line-height: 1;
    transition: transform 0.25s ${tk.easing};
  }
`;

const A = styled.div<{ open: boolean }>`
  display: grid;
  grid-template-rows: ${({ open }) => (open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.28s ${tk.easing};

  & > div { overflow: hidden; }
  p {
    padding: 0 20px 18px;
    font-family: ${tk.fonts.body};
    font-size: 14.5px;
    line-height: 1.65;
    color: ${tk.colors.textSecondary};
  }
`;

export function FaqSection() {
  const { copy } = usePortal();
  const f = copy.faq;
  const [open, setOpen] = useState<number | null>(0);

  // JSON-LD FAQPage — ajuda o Google a exibir a FAQ como rich result.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: f.items.map(it => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  return (
    <SectionAlt id="faq">
      <Glow y="-8%" x="50%" />
      <Inner>
        <HeadCentered>
          <Eyebrow>{f.eyebrow}</Eyebrow>
          <SectionTitle>{f.title}</SectionTitle>
          <Subtitle>{f.subtitle}</Subtitle>
        </HeadCentered>

        <Reveal>
          <List>
            {f.items.map((it, idx) => {
              const isOpen = open === idx;
              return (
                <Item key={it.q} open={isOpen}>
                  <Q onClick={() => setOpen(isOpen ? null : idx)} aria-expanded={isOpen}>
                    <span className="t">{it.q}</span>
                    <span className="i" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                  </Q>
                  <A open={isOpen}>
                    <div><p>{it.a}</p></div>
                  </A>
                </Item>
              );
            })}
          </List>
        </Reveal>
      </Inner>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </SectionAlt>
  );
}
