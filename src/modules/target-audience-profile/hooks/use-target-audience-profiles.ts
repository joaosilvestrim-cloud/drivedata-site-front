'use client';

import { useDynamicServerData } from '@/common/hooks/use-dynamic-server-data';
import { getLanguageSafe } from '@/common/helpers/get-language-client';
import { TargetAudienceProfileModel } from '@/common/model/target-audience-profile.model';
import { httpFindManyTargetAudienceProfile } from '../api/find-many-target-audience-profile/http-find-many-target-audience-profile';
import { FindManyTargetAudienceProfileParams } from '../types/find-many-target-audience-profile-case';

/**
 * Hook para gerenciar target audience profiles com atualização automática ao trocar idioma.
 * 
 * @param initialProfiles - Perfis iniciais vindos do SSR
 * @param params - Parâmetros opcionais para a busca
 * @returns Objeto com dados atuais, estado de loading e possível erro
 */
export function useTargetAudienceProfiles(
  initialProfiles: TargetAudienceProfileModel[],
  params?: FindManyTargetAudienceProfileParams
) {
  return useDynamicServerData(
    initialProfiles,
    () => {
      const lang = getLanguageSafe();
      return httpFindManyTargetAudienceProfile(params || {}, lang);
    }
  );
}
