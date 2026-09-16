'use client';

import { ApplicationsClient } from '@/common/components/admin/ApplicationsClient';
import { Spinner } from '@/common/components/admin/ui';
import { Suspense } from 'react';

// useSearchParams (filtro ?job=) exige um limite de Suspense na rota.
export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ApplicationsClient />
    </Suspense>
  );
}
