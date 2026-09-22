export interface PartnerItem {
  imageUrl: string;
  name?: string | null;
  featured: boolean;
}

export interface PartnersSectionProps {
  className?: string;
  /** Lista vinda do servidor (tabela `partner`, já filtrada por país). */
  partners?: PartnerItem[];
}

