import { TargetAudienceProfileTypeEnum } from '@/common/enums/target-audience-profile-type.enum';

export type TargetAudienceProfileModel = {
  id: string;
  title: string;
  description: string;
  order: number;
  whitelabelId: string;
  type: TargetAudienceProfileTypeEnum;
  createdAt: string;
  updatedAt: string;
};
