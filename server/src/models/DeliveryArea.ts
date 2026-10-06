import { Schema, model, type InferSchemaType } from 'mongoose';
import { LocalizedSchema } from './shared.js';

/**
 * Each delivery area carries its own fee. Areas and fees live in the
 * database (seeded with placeholders) — never hardcoded in the frontend.
 */
const DeliveryAreaSchema = new Schema(
  {
    city: { type: LocalizedSchema, required: true },
    name: { type: LocalizedSchema, required: true },
    /** Delivery fee in whole Egyptian pounds. */
    fee: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type DeliveryAreaDoc = InferSchemaType<typeof DeliveryAreaSchema>;
export const DeliveryArea = model('DeliveryArea', DeliveryAreaSchema);
