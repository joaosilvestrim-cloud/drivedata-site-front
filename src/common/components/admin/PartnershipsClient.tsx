'use client';

import {
  DATA_MATURITY_LABEL,
  PARTNER_STATUS_LABEL,
  PARTNERSHIP_TYPE_LABEL,
  type PartnerApplicationModel,
  type PartnerStatus,
} from '@/common/model/partner-application.model';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Badge, Button, C, Card, ErrorBar, Modal, PageHeader, Select, Spinner, Textarea, table as T } from './ui';

const TONE: Record<PartnerStatus, 'scheduled' | 'neutral' | 'live' | 'danger'> = {
  new: 'scheduled',
  contacted: 'neutral',
  qualified: 'neutral',
  approved: 'live',
  rejected: 'danger',
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

// Solicitações do Portal do Parceiro: filtro por status, notas internas e detalhe.
export function PartnershipsClient() {
  const [items, setItems] = useState<PartnerApplicationModel[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [removing, setRemoving] = useState<PartnerApplicationModel | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/partnerships${status ? `?status=${status}` : ''}`, { cache: 'no-store' });
      if (!r.ok) throw new Error();
      setItems(await r.json());
    } catch {
      setError('Não conseguimos carregar as solicitações. Recarregue a página.');
    }
    setLoading(false);
  }, [status]);
  useEffect(() => {
    load();
  }, [load]);

  async function patch(a: PartnerApplicationModel, body: { status?: PartnerStatus; notes?: string }) {
    try {
      const r = await fetch(`/api/admin/partnerships/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      setItems((prev) => prev.map((x) => (x.id === a.id ? { ...x, ...body } : x)));
    } catch {
      setError('Não conseguimos salvar a alteração. Tente de novo.');
    }
  }

  async function remove() {
    if (!removing) return;
    try {
      await fetch(`/api/admin/partnerships/${removing.id}`, { method: 'DELETE' });
    } catch {
      setError('Não conseguimos excluir a solicitação. Tente de novo.');
    }
    setRemoving(null);
    await load();
  }

  const novas = items.filter((a) => a.status === 'new').length;
  const link = (href: string | null, label: string) =>
    href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: C.green, textDecoration: 'none', marginRight: 10 }}>
        {label} ↗
      </a>
    ) : null;

  return (
    <div>
      <PageHeader
        title="Parcerias"
        subtitle="Quem pediu para entrar no programa de parceiros pelo site. Acompanhe o status e anote o que importa."
        icon="link"
        actions={
          <Select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 220 }}>
            <option value="">Todos os status</option>
            {Object.entries(PARTNER_STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        }
      />
      {error && <ErrorBar>{error}</ErrorBar>}

      <div style={{ display: 'flex', gap: 14, marginBottom: 16, color: C.muted, fontSize: 13 }}>
        <span>
          <b style={{ color: C.text, fontSize: 18 }}>{items.length}</b> solicitaç{items.length === 1 ? 'ão' : 'ões'}
        </span>
        <span>
          <b style={{ color: C.green, fontSize: 18 }}>{novas}</b> nova{novas === 1 ? '' : 's'}
        </span>
      </div>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Card>
          <div style={{ color: C.muted, fontSize: 14 }}>Nenhuma solicitação de parceria por aqui ainda.</div>
        </Card>
      ) : (
        <table style={T.table}>
          <thead>
            <tr>
              <th style={T.th}>Empresa</th>
              <th style={T.th}>Contato</th>
              <th style={T.th}>Modelo</th>
              <th style={T.th}>Recebida</th>
              <th style={T.th}>Status</th>
              <th style={{ ...T.th, textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <Fragment key={a.id}>
                <tr>
                  <td style={T.td}>
                    <div style={{ fontWeight: 600 }}>{a.company}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      {[a.segment, a.region].filter(Boolean).join(' · ') || '—'}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      {link(a.website, 'Site')}
                      {link(a.linkedinUrl, 'LinkedIn')}
                    </div>
                  </td>
                  <td style={T.td}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.contactName}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      <a href={`mailto:${a.email}`} style={{ color: C.muted }}>
                        {a.email}
                      </a>
                      {a.phone ? ` · ${a.phone}` : ''}
                    </div>
                    {a.contactRole && <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{a.contactRole}</div>}
                  </td>
                  <td style={T.td}>
                    <Badge tone="neutral">{PARTNERSHIP_TYPE_LABEL[a.partnershipType]}</Badge>
                  </td>
                  <td style={{ ...T.td, whiteSpace: 'nowrap', color: C.muted, fontSize: 13 }}>{fmt(a.createdAt)}</td>
                  <td style={T.td}>
                    <Select
                      value={a.status}
                      onChange={(e) => patch(a, { status: e.target.value as PartnerStatus })}
                      style={{ width: 150, padding: '7px 10px', fontSize: 13 }}
                    >
                      {Object.entries(PARTNER_STATUS_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td style={{ ...T.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setOpen(open === a.id ? null : a.id);
                        setNotes(a.notes ?? '');
                      }}
                    >
                      {open === a.id ? 'Fechar' : 'Detalhes'}
                    </Button>
                    <Button
                      variant="subtle"
                      icon="trash"
                      title="Excluir"
                      style={{ color: C.danger }}
                      onClick={() => setRemoving(a)}
                    />
                  </td>
                </tr>
                {open === a.id && (
                  <tr>
                    <td colSpan={6} style={{ ...T.td, background: C.panel2 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div>
                          <div style={{ fontSize: 11.5, color: C.faint, marginBottom: 6 }}>O que escreveu</div>
                          <div
                            style={{
                              fontSize: 14,
                              whiteSpace: 'pre-wrap',
                              color: a.message ? C.text : C.faint,
                              lineHeight: 1.6,
                            }}
                          >
                            {a.message || 'Não escreveu mensagem.'}
                          </div>
                          <div style={{ fontSize: 12, color: C.faint, marginTop: 12, lineHeight: 1.7 }}>
                            {a.cnpj && (
                              <>
                                CNPJ: {a.cnpj}
                                <br />
                              </>
                            )}
                            {a.companySize && (
                              <>
                                Tamanho: {a.companySize} pessoas
                                <br />
                              </>
                            )}
                            {a.dataMaturity && (
                              <>
                                Maturidade: {DATA_MATURITY_LABEL[a.dataMaturity] ?? a.dataMaturity}
                                <br />
                              </>
                            )}
                            {a.howHeard && (
                              <>
                                Conheceu por: {a.howHeard}
                                <br />
                              </>
                            )}
                            {a.page && <>Origem: {a.source || 'site'} · {a.page}</>}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11.5, color: C.faint, marginBottom: 6 }}>Notas internas</div>
                          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Só a equipe vê." />
                          <div style={{ marginTop: 8, textAlign: 'right' }}>
                            <Button variant="primary" onClick={() => patch(a, { notes })}>
                              Salvar notas
                            </Button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}

      {removing && (
        <Modal
          title="Excluir solicitação"
          onClose={() => setRemoving(null)}
          width={480}
          footer={
            <>
              <Button onClick={() => setRemoving(null)}>Cancelar</Button>
              <Button variant="danger" onClick={remove}>
                Excluir
              </Button>
            </>
          }
        >
          <p style={{ margin: 0, color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
            A solicitação de <b style={{ color: C.text }}>{removing.company}</b> será apagada. Não dá para desfazer.
          </p>
        </Modal>
      )}
    </div>
  );
}
