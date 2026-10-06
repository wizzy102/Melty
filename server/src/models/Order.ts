import { Schema, model, type InferSchemaType } from 'mongoose';
import { LocalizedSchema } from './shared.js';

export const ORDER_STATUSES = [
  'new',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'completed',
  'rejected',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * Only 'delivery' is offered in the prototype. Pickup is an open question for
 * the owner; adding it later means adding 'pickup' here and making `delivery`
 * conditional — the rest of the order shape stays the same.
 */
export const FULFILLMENT_TYPES = ['delivery'] as const;

// ---- Snapshots: copied from the menu at order time so that later menu
// ---- edits (renames, price changes) never alter historical orders.

const SelectedChoiceSchema = new Schema(
  {
    groupId: { type: Schema.Types.ObjectId, required: true },
    groupName: { type: LocalizedSchema, required: true },
    choiceId: { type: Schema.Types.ObjectId, required: true },
    choiceName: { type: LocalizedSchema, required: true },
    priceModifier: { type: Number, required: true },
  },
  { _id: false },
);

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: LocalizedSchema, required: true },
    basePrice: { type: Number, required: true },
    selections: { type: [SelectedChoiceSchema], default: [] },
    /** basePrice + sum(priceModifier) */
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    /** unitPrice × quantity */
    lineTotal: { type: Number, required: true },
  },
  { _id: false },
);

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const DeliverySchema = new Schema(
  {
    area: { type: Schema.Types.ObjectId, ref: 'DeliveryArea', required: true },
    city: { type: LocalizedSchema, required: true },
    areaName: { type: LocalizedSchema, required: true },
    address: { type: String, required: true, trim: true },
    instructions: { type: String, default: '', trim: true },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: Number, required: true, unique: true },
    customer: { type: CustomerSchema, required: true },
    fulfillmentType: { type: String, enum: FULFILLMENT_TYPES, required: true, default: 'delivery' },
    delivery: { type: DeliverySchema, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'new', index: true },
    statusHistory: {
      type: [
        new Schema(
          {
            status: { type: String, enum: ORDER_STATUSES, required: true },
            at: { type: Date, default: Date.now },
          },
          { _id: false },
        ),
      ],
      default: () => [{ status: 'new', at: new Date() }],
    },
    /** UI language the customer ordered in — useful when Melty contacts them. */
    locale: { type: String, enum: ['en', 'ar'], default: 'en' },
  },
  { timestamps: true },
);

OrderSchema.index({ createdAt: -1 });

export type OrderDoc = InferSchemaType<typeof OrderSchema>;
export const Order = model('Order', OrderSchema);
