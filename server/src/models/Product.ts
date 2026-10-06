import { Schema, model, type InferSchemaType } from 'mongoose';
import { LocalizedSchema, OptionalLocalizedSchema } from './shared.js';

/**
 * One generic structure covers both "variants" and "add-ons":
 *   - Size     → selection: 'single',   required: true
 *   - Add-ons  → selection: 'multiple', required: false, maxSelections: n
 * The client renders any combination from data; no per-product UI code.
 */
const OptionChoiceSchema = new Schema({
  name: { type: LocalizedSchema, required: true },
  /** Added to the product's base price when selected (whole EGP, may be 0). */
  priceModifier: { type: Number, default: 0, min: 0 },
  available: { type: Boolean, default: true },
  /** Pre-selected when the product page opens (single-choice groups). */
  isDefault: { type: Boolean, default: false },
});

const OptionGroupSchema = new Schema({
  name: { type: LocalizedSchema, required: true },
  selection: { type: String, enum: ['single', 'multiple'], required: true },
  required: { type: Boolean, default: false },
  /** Only meaningful for 'multiple'. 0 = no limit. */
  maxSelections: { type: Number, default: 0, min: 0 },
  choices: { type: [OptionChoiceSchema], default: [] },
});

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: LocalizedSchema, required: true },
    description: { type: OptionalLocalizedSchema, default: () => ({}) },
    /** Base price in whole Egyptian pounds. */
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    optionGroups: { type: [OptionGroupSchema], default: [] },
  },
  { timestamps: true },
);

export type ProductDoc = InferSchemaType<typeof ProductSchema>;
export const Product = model('Product', ProductSchema);
