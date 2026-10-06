/** Lowercase + strip Arabic diacritics/letter variants so search is forgiving in both languages. */
export const normalizeSearch = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
