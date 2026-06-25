'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';

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

const STEPS: Step[] = [
  { field: 'name', prompt: () => 'Oi! Eu sou a Tamires 👋 Vou te fazer umas perguntas rápidas. Como é o seu nome?' },
  {
    field: 'email',
    prompt: (d) => `Prazer, ${d.name?.split(' ')[0] || ''}! Qual o seu melhor e-mail?`,
    validate: (v) => (/\S+@\S+\.\S+/.test(v) ? null : 'Hmm, esse e-mail não parece válido. Pode conferir?'),
  },
  { field: 'phone', prompt: () => 'Perfeito. Informe seu telefone com DDD.' },
  { field: 'company', prompt: () => 'Qual o nome da sua empresa?' },
  { field: 'revenue', prompt: () => 'Qual o faturamento mensal da sua empresa?', options: ['Até R$10 mil', 'Até R$50 mil', 'Acima de R$50 mil'] },
  { field: 'segment', prompt: () => 'Selecione o segmento da sua empresa.', options: ['Varejo', 'Indústria', 'Serviços', 'Tecnologia', 'Saúde', 'Outro'] },
  { field: 'message', prompt: () => 'Por fim, conta rapidamente: qual a sua necessidade hoje?' },
];

export function LeadChat() {
  const [data, setData] = useState<Partial<Record<Field, string>>>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'asking' | 'sending' | 'done' | 'failed'>('asking');
  const scrollRef = useRef<HTMLDivElement>(null);

  // primeira pergunta
  useEffect(() => {
    setMessages([{ from: 'bot', text: STEPS[0].prompt({}) }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  const current = STEPS[stepIdx];

  async function submit(allData: Partial<Record<Field, string>>) {
    setStatus('sending');
    setMessages((m) => [...m, { from: 'bot', text: '🙌 Obrigada! Enviando seus dados para a nossa equipe…' }]);
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
      setMessages((m) => [...m, { from: 'bot', text: '✅ Seus dados foram enviados com sucesso! Em breve nossa equipe entra em contato. Muito obrigada! 💙' }]);
    } catch {
      setStatus('failed');
      setMessages((m) => [...m, { from: 'bot', text: '😕 Tivemos um problema ao enviar. Tente novamente em instantes ou use o formulário de contato.' }]);
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
          <HeaderName>Tamires · DriveData</HeaderName>
          <HeaderStatus>online agora</HeaderStatus>
        </div>
      </HeaderBar>

      <Messages ref={scrollRef}>
        {messages.map((m, i) => (
          <Row key={i} from={m.from}>
            {m.from === 'bot' && <MiniAvatar style={{ backgroundImage: 'url(/tamires-avatar.png)' }} />}
            <Bubble from={m.from}>{m.text}</Bubble>
          </Row>
        ))}
        {status === 'sending' && (
          <Row from="bot"><MiniAvatar style={{ backgroundImage: 'url(/tamires-avatar.png)' }} /><Bubble from="bot">…</Bubble></Row>
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
                placeholder="Digite aqui…"
              />
              <SendBtn type="submit" disabled={!input.trim()}>Enviar</SendBtn>
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
const Row = styled.div<{ from: 'bot' | 'user' }>`
  display: flex; align-items: flex-end; gap: 8px;
  justify-content: ${(p) => (p.from === 'user' ? 'flex-end' : 'flex-start')};
`;
const Bubble = styled.div<{ from: 'bot' | 'user' }>`
  max-width: 78%; padding: 10px 14px; font-size: 14px; line-height: 1.45;
  border-radius: ${(p) => (p.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px')};
  background: ${(p) => (p.from === 'user' ? 'linear-gradient(120deg,#0a96ec,#0b7fce)' : 'rgba(255,255,255,.07)')};
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
