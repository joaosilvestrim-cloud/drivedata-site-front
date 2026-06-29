import { AppLanguage } from '@/common/i18n/resources';

export interface HeaderProps {
  className?: string;
}

export interface NavigationItem {
  labelKey: string;
  href: string;
  external?: boolean;
}

export type LanguageCode = AppLanguage;

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}
