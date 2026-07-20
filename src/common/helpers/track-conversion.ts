// Dispara um evento de conversão LIMPO no dataLayer, só quando uma lead é
// REALMENTE enviada com sucesso. Antes o GTM contava `gtm.formSubmit` a cada
// clique do chat (cada mensagem era um <form>), inflando a conversão. Agora o
// Google Ads deve usar este evento dedicado `lead_form_submit` como gatilho.
export function trackLeadConversion(data: {
  source: 'chat' | 'contact_form';
  leadScore?: number;
  mql?: boolean;
}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: 'lead_form_submit',
    lead_source: data.source,
    lead_score: typeof data.leadScore === 'number' ? data.leadScore : undefined,
    lead_mql: data.mql ?? false,
  });
}
