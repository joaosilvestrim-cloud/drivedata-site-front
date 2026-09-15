'use client';

import { GlobalStyles } from '@/common/theme/GlobalStyles';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';

interface EmotionProviderProps {
  children: React.ReactNode;
}

export const EmotionProvider = ({ children }: EmotionProviderProps) => {
  // Each server render needs its own registry. Flush styles before streamed
  // content so inline Global styles cannot displace the first hydrated element.
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'css', prepend: true });
    cache.compat = true;
    const insert = cache.insert;
    let pending: { name: string; global: boolean }[] = [];
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        pending.push({ name: serialized.name, global: !selector });
      }
      return insert(...args);
    };
    return {
      cache,
      flush: () => {
        const entries = pending;
        pending = [];
        return entries;
      },
    };
  });

  useServerInsertedHTML(() => {
    const entries = flush();
    if (!entries.length) return null;
    let styles = '';
    const names: string[] = [];
    const globals: { name: string; css: string }[] = [];
    for (const entry of entries) {
      const css = cache.inserted[entry.name];
      if (typeof css !== 'string') continue;
      if (entry.global) globals.push({ name: entry.name, css });
      else {
        names.push(entry.name);
        styles += css;
      }
    }
    return (
      <>
        {globals.map((entry) => (
          <style
            key={entry.name}
            data-emotion={`${cache.key}-global ${entry.name}`}
            dangerouslySetInnerHTML={{ __html: entry.css }}
          />
        ))}
        {names.length > 0 && (
          <style
            data-emotion={`${cache.key} ${names.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </>
    );
  });
  return (
    <CacheProvider value={cache}>
      <GlobalStyles />
      {children}
    </CacheProvider>
  );
};
