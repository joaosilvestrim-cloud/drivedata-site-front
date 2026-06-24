import {
    CreateContactRequestParams,
    CreateContactRequestResult,
} from '../../types/create-contact-request-case';

// Envia a lead do formulário para o endpoint do próprio site (/api/lead),
// que grava no CRM (Supabase de produção, tenant Brasil).
export const httpCreateContactRequest = async (
  params: CreateContactRequestParams,
): Promise<CreateContactRequestResult> => {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    let message = 'Por favor, verifique os dados informados.';
    try {
      const data = await res.json();
      if (data?.error && typeof data.error === 'string') message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return res.json();
};

