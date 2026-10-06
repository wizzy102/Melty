import { Schema, model, type InferSchemaType } from 'mongoose';
import { LocalizedSchema, OptionalLocalizedSchema } from './shared.js';

const CategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: LocalizedSchema, required: true },
    description: { type: OptionalLocalizedSchema, default: () => ({}) },
    /** Real photo URL. When empty the client renders branded placeholder art. */
    image: { type: String, default: '' },
    /** Key of the placeholder illustration used when there is no photo. */
    art: { type: String, default: 'dessert' },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type CategoryDoc = InferSchemaType<typeof CategorySchema>;
export const Category = model('Category', CategorySchema);
