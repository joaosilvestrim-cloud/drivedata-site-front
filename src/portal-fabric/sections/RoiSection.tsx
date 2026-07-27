'use client';

import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, Eyebrow, SectionTitle, Subtitle, HeadCentered, Card } from '../components/primitives';
import { usePortal } from '../usePortal';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
  align-items: start;

  @media (max-width: 920px) { grid-template-columns: 1fr; }
`;

const InfoTitle = styled.h3`
  font-family: ${tk.fonts.heading};
  font-size: 18px;
  font-weight: 700;
  color: ${tk.colors.textPrimary};
  margin-bottom: 12px;
`;

const InfoText = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 14px;
  line-height: 1.7;
  color: ${tk.colors.textSecondary};
  margin-bottom: 22px;
`;

const RuleBox = styled.div`
  border-radius: 14px;
  border: 1px solid ${tk.colors.borderActive};
  background: ${tk.colors.primaryDim};
  padding: 16px 18px;

  strong {
    display: block;
    font-family: ${tk.fonts.heading};
    font-size: 13.5px;
    font-weight: 700;
    color: ${tk.colors.primary};
    margin-bottom: 6px;
  }
  span {
    font-family: ${tk.fonts.body};
    font-size: 13px;
    line-height: 1.6;
    color: ${tk.colors.textSecondary};
  }
`;

const SimTitle = styled.h3`
  font-family: ${tk.fonts.heading};
  font-size: 16px;
  font-weight: 700;
  color: ${tk.colors.textPrimary};
  margin-bottom: 20px;
`;

const Field = styled.label`
  display: block;
  margin-bottom: 18px;

  span {
    display: block;
    font-family: ${tk.fonts.body};
    font-size: 12.5px;
    font-weight: 600;
    color: ${tk.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }
`;

const inputStyle = `
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid ${tk.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  color: ${tk.colors.textPrimary};
  font-family: ${tk.fonts.heading};
  font-size: 16px;
  font-weight: 700;
  outline: none;
  transition: border-color 0.2s ease;
  &:focus { border-color: ${tk.colors.borderActive}; }
`;

const NumInput = styled.input`${inputStyle}`;
const Select = styled.select`
  ${inputStyle}
  appearance: none;
  cursor: pointer;
  option { background: ${tk.colors.bg}; color: ${tk.colors.textPrimary}; }
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid ${tk.colors.border};
  font-family: ${tk.fonts.body};
  font-size: 14px;
  color: ${tk.colors.textSecondary};

  strong {
    font-family: ${tk.fonts.heading};
    font-size: 16px;
    color: ${tk.colors.textPrimary};
    font-variant-numeric: tabular-nums;
  }
`;

const Highlight = styled.div`
  margin-top: 18px;
  border-radius: 16px;
  background: ${tk.gradients.brand};
  padding: 20px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  .label { font-family: ${tk.fonts.heading}; font-size: 13px; font-weight: 700; color: #06121f; text-transform: uppercase; letter-spacing: 0.05em; }
  .value { font-family: ${tk.fonts.heading}; font-size: clamp(22px, 3vw, 30px); font-weight: 800; color: #06121f; font-variant-numeric: tabular-nums; }
  .pct { font-family: ${tk.fonts.heading}; font-size: 13px; font-weight: 700; color: #06121f; opacity: 0.75; }
`;

const Note = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 11.5px;
  line-height: 1.5;
  color: ${tk.colors.textMuted};
  margin-top: 16px;
`;

export function RoiSection() {
  const { copy, pricing, fmt } = usePortal();
  const r = copy.roi;

  const [users, setUsers] = useState(pricing.defaultUsers);
  const [license, setLicense] = useState(pricing.defaultLicense);
  const [skuId, setSkuId] = useState(pricing.skus[1].id);

  const { current, portal, monthly, pct, annual } = useMemo(() => {
    const sku = pricing.skus.find((s) => s.id === skuId) ?? pricing.skus[0];
    const cur = Math.max(0, users) * Math.max(0, license);
    const prt = sku.price;
    const mon = cur - prt;
    const p = cur > 0 ? (mon / cur) * 100 : 0;
    return { current: cur, portal: prt, monthly: mon, pct: p, annual: mon * 12 };
  }, [users, license, skuId, pricing]);

  const positive = monthly > 0;

  return (
    <Section id="roi">
      <Glow y="-10%" x="60%" />
      <Inner>
        <HeadCentered>
          <Eyebrow>{r.eyebrow}</Eyebrow>
          <SectionTitle>{r.title}</SectionTitle>
          <Subtitle>{r.subtitle}</Subtitle>
        </HeadCentered>

        <Grid>
          <div>
            <InfoTitle>{r.modelTitle}</InfoTitle>
            <InfoText>{r.modelText}</InfoText>
            <RuleBox>
              <strong>{r.ruleTitle}</strong>
              <span>{r.ruleText}</span>
            </RuleBox>
          </div>

          <Card>
            <SimTitle>{r.simTitle}</SimTitle>

            <Field>
              <span>{r.usersLabel}</span>
              <NumInput
                type="number" min={1} value={users}
                onChange={(e) => setUsers(Math.max(0, Number(e.target.value) || 0))}
              />
            </Field>

            <Field>
              <span>{r.licenseLabel} ({pricing.currency})</span>
              <NumInput
                type="number" min={0} value={license}
                onChange={(e) => setLicense(Math.max(0, Number(e.target.value) || 0))}
              />
            </Field>

            <Field>
              <span>{r.skuLabel}</span>
              <Select value={skuId} onChange={(e) => setSkuId(e.target.value)}>
                {pricing.skus.map((s) => (
                  <option key={s.id} value={s.id}>{s.label} — {fmt(s.price)}/mês</option>
                ))}
              </Select>
            </Field>

            <ResultRow>{r.currentLabel}<strong>{fmt(current)}</strong></ResultRow>
            <ResultRow>{r.portalLabel}<strong>{fmt(portal)}</strong></ResultRow>

            <Highlight style={positive ? undefined : { background: 'rgba(255,255,255,0.06)' }}>
              <div>
                <div className="label" style={positive ? undefined : { color: tk.colors.textSecondary }}>{r.monthlyLabel}</div>
                <div className="pct" style={positive ? undefined : { color: tk.colors.textMuted }}>
                  {r.annualLabel}: {fmt(Math.max(0, annual))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="value" style={positive ? undefined : { color: tk.colors.textSecondary }}>
                  {fmt(Math.max(0, monthly))}
                </div>
                <div className="pct" style={positive ? undefined : { color: tk.colors.textMuted }}>
                  {positive ? `${Math.round(pct)}%` : '—'}
                </div>
              </div>
            </Highlight>

            <Note>{r.note}</Note>
          </Card>
        </Grid>
      </Inner>
    </Section>
  );
}
