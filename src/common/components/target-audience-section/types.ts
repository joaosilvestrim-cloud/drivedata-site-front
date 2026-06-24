import { TargetAudienceProfileModel } from "@/common/model/target-audience-profile.model";

export interface TargetAudienceSectionProps {
  className?: string;
  profiles: TargetAudienceProfileModel[];
}

export interface TargetAudienceItem {
  id: string;
  title: string;
  description: string;
}

export interface TargetAudienceColumn {
  id: string;
  title: string;
  highlightedWord: string;
  items: TargetAudienceItem[];
  isPositive: boolean; // true para "Para quem é", false para "Para quem não é"
}
