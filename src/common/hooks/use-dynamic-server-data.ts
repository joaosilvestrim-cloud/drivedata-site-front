'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { i18n } from '@/common/i18n';

/**
 * Hook genérico para gerenciar dados do servidor que precisam ser refetchados
 * automaticamente quando o idioma muda.
 * 
 * @param initialData - Dados iniciais vindos do SSR
 * @param fetchFn - Função assíncrona para buscar os dados
 * @returns Objeto com dados atuais, estado de loading e possível erro
 */
export function useDynamicServerData<T>(
  initialData: T,
  fetchFn: () => Promise<T>
): {
  data: T;
  isLoading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Ref para rastrear a última requisição e evitar race conditions
  const requestIdRef = useRef(0);

  const refetch = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    
    setIsLoading(true);
    setError(null);

    try {
      const newData = await fetchFn();
      
      // Apenas atualiza se esta ainda é a requisição mais recente
      if (currentRequestId === requestIdRef.current) {
        setData(newData);
      }
    } catch (err) {
      // Apenas atualiza erro se esta ainda é a requisição mais recente
      if (currentRequestId === requestIdRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        console.error('Error fetching dynamic server data:', err);
      }
    } finally {
      // Apenas remove loading se esta ainda é a requisição mais recente
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchFn]);

  useEffect(() => {
    if (!i18n) {
      return;
    }

    // Handler para mudança de idioma
    const handleLanguageChange = () => {
      void refetch();
    };

    // Registra listener para mudança de idioma
    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [refetch]);

  return { data, isLoading, error };
}
