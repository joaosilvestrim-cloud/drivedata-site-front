'use client';

import styled from '@emotion/styled';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAttribution } from '@/common/helpers/attribution';
import { trackLeadConversion } from '@/common/helpers/track-conversion';

// Chat de captação próprio da DriveData. Coleta os dados (mesmo fluxo do antigo
// Typebot) e grava direto no CRM via /api/lead (origem "Chat"). Sem dependência
// externa.

type Msg = { from: 'bot' | 'user'; text: string };
type Field = 'name' | 'email' | 'phone' | 'company' | 'role' | 'revenue' | 'segment' | 'urgency' | 'message';

// Pontuação do Lead Scoring (índice da opção → pontos), conforme a spec DALT.
// Faturamento anual: 2/4/5 · Cargo: 3/2/1/0 · Urgência: 2/0 · MQL quando >= 6.
const SCORE_POINTS: Partial<Record<Field, number[]>> = {
  revenue: [2, 4, 5],
  role: [3, 2, 1, 0],
  urgency: [2, 0],
};
const MQL_THRESHOLD = 6;

interface Step {
  field: Field;
  prompt: (data: Partial<Record<Field, string>>) => string;
  options?: string[];
  validate?: (v: string) => string | null; // retorna erro ou null
}

export function LeadChat() {
  const { t, i18n } = useTranslation();
  // Passos do chat construídos a partir do i18n (seguem o idioma atual).
  const STEPS: Step[] = useMemo(
    () => [
      { field: 'name', prompt: () => t('leadChat.steps.name') },
      {
        field: 'email',
        prompt: (d) => t('leadChat.steps.email', { name: d.name?.split(' ')[0] || '' }),
        validate: (v) => (/\S+@\S+\.\S+/.test(v) ? null : t('leadChat.validation.email')),
      },
      { field: 'phone', prompt: () => t('leadChat.steps.phone') },
      { field: 'company', prompt: () => t('leadChat.steps.company') },
      { field: 'role', prompt: () => t('leadChat.steps.role'), options: t('leadChat.roleOptions', { returnObjects: true }) as unknown as string[] },
      { field: 'revenue', prompt: () => t('leadChat.steps.revenue'), options: t('leadChat.revenueOptions', { returnObjects: true }) as unknown as string[] },
      { field: 'segment', prompt: () => t('leadChat.steps.segment'), options: t('leadChat.segmentOptions', { returnObjects: true }) as unknown as string[] },
      { field: 'urgency', prompt: () => t('leadChat.steps.urgency'), options: t('leadChat.urgencyOptions', { returnObjects: true }) as unknown as string[] },
      { field: 'message', prompt: () => t('leadChat.steps.message') },
    ],
    [t],
  );

  const [data, setData] = useState<Partial<Record<Field, string>>>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'asking' | 'sending' | 'done' | 'failed'>('asking');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Saudação no idioma atual. Roda no mount e quando o idioma muda — mas só
  // enquanto ninguém respondeu ainda (stepIdx === 0), pra não apagar a conversa.
  useEffect(() => {
    if (stepIdx === 0) {
      setMessages([{ from: 'bot', text: STEPS[0].prompt({}) }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  // Foca o input SEM rolar a página. O autoFocus antigo fazia a home descer
  // sozinha no primeiro acesso (o navegador rolava até o input focado).
  useEffect(() => {
    if (status === 'asking' && !STEPS[stepIdx]?.options) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [stepIdx, status, STEPS]);

  const current = STEPS[stepIdx];

  async function submit(allData: Partial<Record<Field, string>>) {
    setStatus('sending');
    setMessages((m) => [...m, { from: 'bot', text: t('leadChat.messages.sending') }]);

    // Lead Score (0–10) pelos índices das opções escolhidas (independe do idioma).
    let leadScore = 0;
    (['revenue', 'role', 'urgency'] as Field[]).forEach((f) => {
      const step = STEPS.find((s) => s.field === f);
      const val = allData[f];
      if (step?.options && val) {
        const idx = step.options.indexOf(val);
        if (idx >= 0) leadScore += SCORE_POINTS[f]?.[idx] ?? 0;
      }
    });
    const isMQL = leadScore >= MQL_THRESHOLD;

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: allData.name,
          email: allData.email,
          phone: allData.phone,
          company: allData.company,
          role: allData.role,
          revenue: allData.revenue,
          segment: allData.segment,
          urgency: allData.urgency,
          message: allData.message,
          leadScore,
          mql: isMQL,
          origin: 'Site DriveData — Chat',
          page: typeof window !== 'undefined' ? window.location.pathname : '/',
          tracking: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error('falha');
      setStatus('done');
      setMessages((m) => [...m, { from: 'bot', text: t('leadChat.messages.success') }]);
      // Conversão só AQUI: a lead foi de fato gravada no CRM.
      trackLeadConversion({ source: 'chat', leadScore, mql: isMQL });
    } catch {
      setStatus('failed');
      setMessages((m) => [...m, { from: 'bot', text: t('leadChat.messages.error') }]);
    }
  }

  function answer(value: string) {
    const v = value.trim();
    if (!v) return;
    if (current.validate) {
      const err = current.validate(v);
      if (err) { setError(err); return; }
    }
    setError(null);
    const nextData = { ...data, [current.field]: v };
    setData(nextData);
    setMessages((m) => [...m, { from: 'user', text: v }]);
    setInput('');

    const nextIdx = stepIdx + 1;
    if (nextIdx < STEPS.length) {
      setStepIdx(nextIdx);
      setTimeout(() => setMessages((m) => [...m, { from: 'bot', text: STEPS[nextIdx].prompt(nextData) }]), 350);
    } else {
      submit(nextData);
    }
  }

  return (
    <Root>
      <HeaderBar>
        <Avatar style={{ backgroundImage: 'url(/tamires-avatar.png)' }} />
        <div>
          <HeaderName>{t('leadChat.ui.headerName')}</HeaderName>
          <HeaderStatus>{t('leadChat.ui.status')}</HeaderStatus>
        </div>
      </HeaderBar>

      <Messages ref={scrollRef}>
        {messages.map((m, i) => (
          <Row key={i} variant={m.from}>
            {m.from === 'bot' && <MiniAvatar style={{ backgroundImage: 'url(/tamires-avatar.png)' }} />}
            <Bubble variant={m.from}>{m.text}</Bubble>
          </Row>
        ))}
        {status === 'sending' && (
          <Row variant="bot"><MiniAvatar style={{ backgroundImage: 'url(/tamires-avatar.png)' }} /><Bubble variant="bot">…</Bubble></Row>
        )}
      </Messages>

      {status === 'asking' && (
        <Composer>
          {current.options ? (
            <Options>
              {current.options.map((opt) => (
                <OptionBtn key={opt} onClick={() => answer(opt)}>{opt}</OptionBtn>
              ))}
            </Options>
          ) : (
            <InputRow>
              <TextInput
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); answer(input); } }}
                placeholder={t('leadChat.ui.placeholder')}
              />
              <SendBtn type="button" onClick={() => answer(input)} disabled={!input.trim()}>{t('leadChat.ui.send')}</SendBtn>
            </InputRow>
          )}
          {error && <ErrorText>{error}</ErrorText>}
        </Composer>
      )}
    </Root>
  );
}

// ─── estilos ───────────────────────────────────────────────
// Identidade DriveData (a mesma do site): cabeçalho azul-marinho, conversa sobre
// névoa, balões chapados, opções em pílula de contorno e o verde só no Enviar.
// No tema escuro do site (html[data-site-theme="dark"]) as superfícies escurecem.
const DARK = "html[data-site-theme='dark'] &";
const Root = styled.div`
  --c-ink: #0a1628; --c-body: #3d4a5c; --c-slate: #5b6778; --c-fog: #eef2f7; --c-paper: #ffffff;
  --c-line: #dbe2ea; --c-bot: #ffffff; --c-bot-text: #0a1628; --c-user: #0a1628; --c-user-text: #ffffff;
  --c-green: #54da89; --c-green-hover: #6fe39d; --c-danger: #b42318;
  ${DARK} {
    --c-ink: #e8eef8; --c-body: #b6c2d4; --c-slate: #8d9ab0; --c-fog: #0a1322; --c-paper: #0d192c;
    --c-line: #22314a; --c-bot: #14233c; --c-bot-text: #e8eef8; --c-user: #e8eef8; --c-user-text: #0a1628;
    --c-danger: #ff8f80;
  }
  display: flex; flex-direction: column; height: 100%; width: 100%;
  background: var(--c-paper); color: var(--c-body); overflow: hidden;
  font-family: var(--font-inter), 'Inter', ui-sans-serif, system-ui, sans-serif;
`;
const HeaderBar = styled.div`
  display: flex; align-items: center; gap: 14px; padding: 18px 76px 18px 22px;
  background: #0a1628; color: #fff; flex-shrink: 0;
`;
const Avatar = styled.div`
  width: 46px; height: 46px; border-radius: 50%; background-size: cover; background-position: center;
  box-shadow: 0 0 0 2px #0a1628, 0 0 0 4px #54da89; flex-shrink: 0;
`;
const MiniAvatar = styled.div`
  width: 28px; height: 28px; border-radius: 50%; background-size: cover; background-position: center; flex-shrink: 0;
`;
const HeaderName = styled.p`
  margin: 0; font: 700 17px/1.15 var(--font-sora), 'Sora', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.02em;
`;
const HeaderStatus = styled.p`
  display: flex; align-items: center; gap: 6px; margin: 4px 0 0; font-size: 13px; color: rgba(234, 240, 251, 0.72);
  &::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #54da89; }
`;
const Messages = styled.div`
  flex: 1; overflow-y: auto; padding: 22px; display: flex; flex-direction: column; gap: 12px;
  background: var(--c-fog);
`;
const Row = styled.div<{ variant: 'bot' | 'user' }>`
  display: flex; align-items: flex-end; gap: 8px;
  justify-content: ${(p) => (p.variant === 'user' ? 'flex-end' : 'flex-start')};
`;
const Bubble = styled.div<{ variant: 'bot' | 'user' }>`
  max-width: 80%; padding: 12px 16px; font-size: 15px; line-height: 1.5; white-space: pre-wrap;
  border-radius: ${(p) => (p.variant === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px')};
  background: ${(p) => (p.variant === 'user' ? 'var(--c-user)' : 'var(--c-bot)')};
  color: ${(p) => (p.variant === 'user' ? 'var(--c-user-text)' : 'var(--c-bot-text)')};
`;
const Composer = styled.div`
  padding: 16px 18px 18px; border-top: 1px solid var(--c-line); flex-shrink: 0; background: var(--c-paper);
`;
const Options = styled.div` display: flex; flex-wrap: wrap; gap: 8px; `;
const OptionBtn = styled.button`
  border: 0; background: transparent; color: var(--c-ink); box-shadow: inset 0 0 0 1.5px var(--c-ink);
  padding: 10px 16px; min-height: 42px; border-radius: 999px; font-size: 14px; font-weight: 600; line-height: 1.2; font-family: inherit;
  cursor: pointer; transition: background-color 0.15s ease, color 0.15s ease;
  &:hover { background: var(--c-ink); color: var(--c-paper); }
  &:focus-visible { outline: 3px solid rgba(10, 114, 196, 0.45); outline-offset: 2px; }
`;
const InputRow = styled.div` display: flex; gap: 10px; `;
const TextInput = styled.input`
  flex: 1; min-width: 0; background: var(--c-fog); border: 0; color: var(--c-ink);
  padding: 0 18px; min-height: 48px; border-radius: 999px; font-size: 15px; line-height: 1.4; font-family: inherit; outline: none;
  transition: box-shadow 0.15s ease;
  &::placeholder { color: var(--c-slate); }
  &:focus { box-shadow: 0 0 0 3px rgba(10, 114, 196, 0.35); }
`;
const SendBtn = styled.button`
  background: var(--c-green); color: #0a1628; border: 0; font-size: 15px; font-weight: 600; line-height: 1; font-family: inherit;
  padding: 0 22px; min-height: 48px; border-radius: 999px; cursor: pointer; transition: background-color 0.15s ease;
  &:hover:not(:disabled) { background: var(--c-green-hover); }
  &:disabled { opacity: 0.45; cursor: default; }
  &:focus-visible { outline: 3px solid rgba(10, 114, 196, 0.45); outline-offset: 2px; }
`;
const ErrorText = styled.p` color: var(--c-danger); font-size: 13px; margin: 10px 4px 0; `;
