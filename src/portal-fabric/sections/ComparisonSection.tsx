'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, Eyebrow, SectionTitle, HeadCentered, Reveal } from '../components/primitives';
import { usePortal } from '../usePortal';

const Scroll = styled.div`
  overflow-x: auto;
  border-radius: ${tk.radius.lg};
  border: 1px solid ${tk.colors.border};
  background: ${tk.colors.bgCard};
  backdrop-filter: blur(14px);
`;

const Table = styled.table`
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-family: ${tk.fonts.body};
`;

const Th = styled.th<{ accent?: boolean }>`
  text-align: left;
  padding: 18px 22px;
  font-family: ${tk.fonts.heading};
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ accent }) => (accent ? tk.colors.primary : tk.colors.textSecondary)};
  background: ${({ accent }) => (accent ? tk.colors.primaryDim : 'transparent')};
  border-bottom: 1px solid ${tk.colors.border};
  white-space: nowrap;

  &:first-of-type { color: ${tk.colors.textMuted}; }
`;

const Td = styled.td<{ variant?: 'crit' | 'trad' | 'portal' }>`
  padding: 15px 22px;
  font-size: 13.5px;
  line-height: 1.5;
  border-bottom: 1px solid ${tk.colors.border};
  vertical-align: top;
  color: ${({ variant }) =>
    variant === 'crit' ? tk.colors.textPrimary
      : variant === 'portal' ? tk.colors.textPrimary
        : tk.colors.textMuted};
  font-weight: ${({ variant }) => (variant === 'crit' ? 600 : 400)};
  background: ${({ variant }) => (variant === 'portal' ? 'rgba(84,218,137,0.05)' : 'transparent')};

  tr:last-of-type & { border-bottom: none; }
`;

const Mark = styled.span<{ ok?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;

  &::before {
    content: ${({ ok }) => (ok ? "'✓'" : "'—'")};
    color: ${({ ok }) => (ok ? tk.colors.primary : tk.colors.textMuted)};
    font-weight: 800;
    flex-shrink: 0;
  }
`;

export function ComparisonSection() {
  const { copy } = usePortal();
  const c = copy.compare;

  return (
    <Section id="comparativo">
      <Glow y="-10%" x="30%" color="rgba(84,218,137,0.1)" />
      <Inner>
        <HeadCentered>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <SectionTitle>{c.title}</SectionTitle>
        </HeadCentered>

        <Reveal>
          <Scroll>
            <Table>
              <thead>
                <tr>
                  <Th>&nbsp;</Th>
                  <Th>{c.colTraditional}</Th>
                  <Th accent>{c.colPortal}</Th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row) => (
                  <tr key={row.crit}>
                    <Td variant="crit">{row.crit}</Td>
                    <Td variant="trad"><Mark ok={false}>{row.trad}</Mark></Td>
                    <Td variant="portal"><Mark ok>{row.portal}</Mark></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroll>
        </Reveal>
      </Inner>
    </Section>
  );
}
