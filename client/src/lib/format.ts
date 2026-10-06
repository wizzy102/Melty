import type { Lang } from '../api/types';

/** Western digits in both languages. */
const locale = (lang: Lang) => (lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB');

/** "11:37" */
export function clockTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
}

/** "6 Oct, 11:37" */
export function dateTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(
    new Date(iso),
  );
}

/** "5 minutes ago" / "منذ 5 دقائق"; null when under a minute (caller shows "just now"). */
export function relativeTime(iso: string, now: number, lang: Lang): string | null {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return null;
  const rtf = new Intl.RelativeTimeFormat(locale(lang), { numeric: 'auto' });
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute');
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour');
  return dateTime(iso, lang);
}
