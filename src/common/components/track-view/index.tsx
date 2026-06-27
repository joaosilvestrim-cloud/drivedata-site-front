'use client';

import { useEffect } from 'react';

// Beacon de visualização: registra um acesso (best-effort) em /api/track.
export function TrackView({ articleId, lang }: { articleId?: string; lang?: string }) {
  useEffect(() => {
    try {
      let sid = sessionStorage.getItem('dd_sid');
      if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem('dd_sid', sid);
      }
      const body = JSON.stringify({
        articleId: articleId ?? null,
        path: window.location.pathname,
        lang: lang ?? document.documentElement.lang ?? null,
        referrer: document.referrer || null,
        sessionId: sid,
      });
      const url = '/api/track';
      if (navigator.sendBeacon) navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
      else fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
    } catch {
      /* best-effort */
    }
  }, [articleId, lang]);
  return null;
}
