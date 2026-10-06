import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang, Localized } from '../api/types';
import { business } from '../config/business';
import { en, type MessageKey } from './en';
import { ar } from './ar';

const dictionaries: Record<Lang, Record<MessageKey, string>> = { en, ar };
const STORAGE_KEY = 'melty.lang';
const numberFormat = new Intl.NumberFormat('en-US'); // Western digits in both languages

interface I18n {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  /** UI string by key, with {placeholder} interpolation. */
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  /** Pick the current language from a localized API field. */
  tr: (value: Localized | null | undefined) => string;
  /** Format a whole-pound amount, e.g. "180 EGP" / "180 جنيه". */
  price: (amount: number) => string;
  /** Translate an API error code, falling back to a generic message. */
  errorText: (code: string) => string;
}

const I18nContext = createContext<I18n | null>(null);

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang, dir]);

  const t = useCallback<I18n['t']>(
    (key, vars) => {
      let s: string = dictionaries[lang][key] ?? en[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
    [lang],
  );

  const value = useMemo<I18n>(
    () => ({
      lang,
      dir,
      setLang: setLangState,
      toggleLang: () => setLangState((l) => (l === 'en' ? 'ar' : 'en')),
      t,
      tr: (v) => (v ? v[lang] || v.en || '' : ''),
      price: (amount) =>
        lang === 'ar'
          ? `${numberFormat.format(amount)} ${business.currency.ar}`
          : `${numberFormat.format(amount)} ${business.currency.en}`,
      errorText: (code) => {
        const key = `error.${code}` as MessageKey;
        return key in en ? t(key) : t('error.server_error');
      },
    }),
    [lang, dir, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
