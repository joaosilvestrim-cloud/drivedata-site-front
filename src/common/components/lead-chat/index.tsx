'use client';

import styled from '@emotion/styled';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Chat de captação próprio da DriveData. Coleta os dados (mesmo fluxo do antigo
// Typebot) e grava direto no CRM via /api/lead (origem "Chat"). Sem dependência
// externa.

type Msg = { from: 'bot' | 'user'; text: string };
type Field = 'name' | 'email' | 'phone' | 'company' | 'revenue' | 'segment' | 'message';

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
      { field: 'revenue', prompt: () => t('leadChat.steps.revenue'), options: t('leadChat.revenueOptions', { returnObjects: true }) as unknown as string[] },
      { field: 'segment', prompt: () => t('leadChat.steps.segment'), options: t('leadChat.segmentOptions', { returnObjects: true }) as unknown as string[] },
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

  const current = STEPS[stepIdx];

  async function submit(allData: Partial<Record<Field, string>>) {
    setStatus('sending');
    setMessages((m) => [...m, { from: 'bot', text: t('leadChat.messages.sending') }]);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: allData.name,
          email: allData.email,
          phone: allData.phone,
          company: allData.company,
          revenue: allData.revenue,
          segment: allData.segment,
          message: allData.message,
          origin: 'Site DriveData — Chat',
          page: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      });
      if (!res.ok) throw new Error('falha');
      setStatus('done');
      setMessages((m) => [...m, { from: 'bot', text: t('leadChat.messages.success') }]);
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
            <InputRow
              onSubmit={(e) => { e.preventDefault(); answer(input); }}
            >
              <TextInput
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('leadChat.ui.placeholder')}
              />
              <SendBtn type="submit" disabled={!input.trim()}>{t('leadChat.ui.send')}</SendBtn>
            </InputRow>
          )}
          {error && <ErrorText>{error}</ErrorText>}
        </Composer>
      )}
    </Root>
  );
}

// ─── estilos ───────────────────────────────────────────────
const Root = styled.div`
  display: flex; flex-direction: column; height: 100%; width: 100%;
  background: #0b1220; color: #fff; overflow: hidden;
`;
const HeaderBar = styled.div`
  display: flex; align-items: center; gap: 12px; padding: 14px 18px;
  background: linear-gradient(120deg, #0a96ec, #54da89); flex-shrink: 0;
`;
const Avatar = styled.div`
  width: 40px; height: 40px; border-radius: 50%; background-size: cover; background-position: center;
  border: 2px solid rgba(255,255,255,.6); flex-shrink: 0;
`;
const MiniAvatar = styled.div`
  width: 26px; height: 26px; border-radius: 50%; background-size: cover; background-position: center; flex-shrink: 0;
`;
const HeaderName = styled.p` font-weight: 700; font-size: 14px; line-height: 1.1; margin: 0; `;
const HeaderStatus = styled.p` font-size: 11px; opacity: .85; margin: 2px 0 0; `;
const Messages = styled.div`
  flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 10px;
  background: radial-gradient(ellipse at top, #0f1f3d 0%, #0b1220 70%);
`;
const Row = styled.div<{ variant: 'bot' | 'user' }>`
  display: flex; align-items: flex-end; gap: 8px;
  justify-content: ${(p) => (p.variant === 'user' ? 'flex-end' : 'flex-start')};
`;
const Bubble = styled.div<{ variant: 'bot' | 'user' }>`
  max-width: 78%; padding: 10px 14px; font-size: 14px; line-height: 1.45;
  border-radius: ${(p) => (p.variant === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px')};
  background: ${(p) => (p.variant === 'user' ? 'linear-gradient(120deg,#0a96ec,#0b7fce)' : 'rgba(255,255,255,.07)')};
  color: #fff; border: 1px solid rgba(255,255,255,.08); white-space: pre-wrap;
`;
const Composer = styled.div` padding: 14px; border-top: 1px solid rgba(255,255,255,.08); flex-shrink: 0; background: #0b1220; `;
const Options = styled.div` display: flex; flex-wrap: wrap; gap: 8px; `;
const OptionBtn = styled.button`
  border: 1px solid rgba(84,218,137,.5); background: rgba(84,218,137,.1); color: #54da89;
  padding: 9px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; transition: .15s;
  &:hover { background: rgba(84,218,137,.2); }
`;
const InputRow = styled.form` display: flex; gap: 8px; `;
const TextInput = styled.input`
  flex: 1; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); color: #fff;
  padding: 11px 14px; border-radius: 12px; font-size: 14px; outline: none;
  &::placeholder { color: rgba(255,255,255,.4); }
  &:focus { border-color: #0a96ec; }
`;
const SendBtn = styled.button`
  background: linear-gradient(120deg,#0a96ec,#54da89); color: #fff; border: none; font-weight: 700;
  padding: 0 18px; border-radius: 12px; font-size: 14px; cursor: pointer;
  &:disabled { opacity: .45; cursor: default; }
`;
const ErrorText = styled.p` color: #ff8a8a; font-size: 12px; margin: 8px 2px 0; `;
