import { Schema } from 'mongoose';

/** A string available in every supported UI language. */
export interface Localized {
  en: string;
  ar: string;
}

export const LocalizedSchema = new Schema<Localized>(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const OptionalLocalizedSchema = new Schema<Localized>(
  {
    en: { type: String, default: '', trim: true },
    ar: { type: String, default: '', trim: true },
  },
  { _id: false },
);
