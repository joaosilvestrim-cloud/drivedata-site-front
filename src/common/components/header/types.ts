import { AppLanguage } from '@/common/i18n/resources';

export interface HeaderProps {
  className?: string;
}

export interface NavigationItem {
  labelKey: string;
  href: string;
  external?: boolean;
  /** Linha de apoio exibida abaixo do título no submenu (desktop). */
  descriptionKey?: string;
  /** Item de fechamento do submenu ("Todas as soluções"): ganha divisor e seta. */
  summary?: boolean;
  /** Itens do submenu; quando presente, o item vira um gatilho de dropdown. */
  children?: NavigationItem[];
}

export type LanguageCode = AppLanguage;

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag?: string;
}
