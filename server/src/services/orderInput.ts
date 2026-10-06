import { z } from 'zod';
import { objectId } from '../utils/validate.js';

/** Max quantity of a single cart line, and max distinct lines per order. */
export const LIMITS = {
  maxQuantity: 20,
  maxLines: 30,
  maxNameLength: 80,
  maxAddressLength: 300,
  maxInstructionsLength: 300,
} as const;

/**
 * Egyptian mobile numbers: 010 / 011 / 012 / 015 + 8 digits.
 * Accepts common input forms (+20…, 0020…, spaces, dashes, Arabic-Indic
 * digits) and normalizes to the local 11-digit form, e.g. 01012345678.
 */
export function normalizeEgyptianPhone(raw: string): string | null {
  const westernized = raw.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
  let digits = westernized.replace(/[\s\-()]/g, '');
  if (digits.startsWith('+20')) digits = '0' + digits.slice(3);
  else if (digits.startsWith('0020')) digits = '0' + digits.slice(4);
  else if (digits.startsWith('20') && digits.length === 12) digits = '0' + digits.slice(2);
  return /^01[0125]\d{8}$/.test(digits) ? digits : null;
}

/**
 * Free text from customers, cleaned before validation: removes control
 * characters and invisible bidi overrides (U+202A–202E, U+2066–2069), which
 * could make a name or address display reversed/misleading in the admin.
 * Newlines are kept for addresses; runs of spaces are collapsed.
 */
const UNSAFE_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F‎‏‪-‮⁦-⁩]/g;
const cleanText = (multiline = false) =>
  z
    .string()
    .transform((v) => {
      const s = v.replace(UNSAFE_CHARS, '').replace(/[ \t]+/g, ' ');
      return (multiline ? s.replace(/\n{3,}/g, '\n\n') : s.replace(/\n/g, ' ')).trim();
    });

/** What the client is allowed to send for a cart line. No prices. */
export const CartLineInput = z.object({
  productId: objectId,
  quantity: z.number().int('invalid_quantity').min(1, 'invalid_quantity').max(LIMITS.maxQuantity, 'invalid_quantity'),
  selections: z
    .array(
      z.object({
        groupId: objectId,
        choiceIds: z.array(objectId).max(20),
      }),
    )
    .max(20)
    .default([]),
});
export type CartLineInput = z.infer<typeof CartLineInput>;

export const CartInput = z
  .array(CartLineInput)
  .min(1, 'cart_empty')
  .max(LIMITS.maxLines, 'cart_too_large');

export const CustomerInput = z.object({
  name: cleanText().pipe(z.string().min(2, 'name_required').max(LIMITS.maxNameLength, 'too_long')),
  phone: z
    .string()
    .trim()
    .min(1, 'phone_required')
    .transform((v, ctx) => {
      const normalized = normalizeEgyptianPhone(v);
      if (!normalized) {
        ctx.addIssue({ code: 'custom', message: 'phone_invalid' });
        return z.NEVER;
      }
      return normalized;
    }),
});

export const DeliveryInput = z.object({
  areaId: objectId,
  address: cleanText(true).pipe(z.string().min(5, 'address_required').max(LIMITS.maxAddressLength, 'too_long')),
  instructions: cleanText(true).pipe(z.string().max(LIMITS.maxInstructionsLength, 'too_long')).default(''),
});

/** POST /api/orders/quote — price a cart for an area (no customer details). */
export const QuoteInput = z.object({
  items: CartInput,
  areaId: objectId.optional(),
});

/**
 * POST /api/orders — note: no subtotal / fee / total / price fields exist
 * here. Anything extra the client sends is stripped by zod and ignored.
 */
export const CreateOrderInput = z.object({
  items: CartInput,
  customer: CustomerInput,
  delivery: DeliveryInput,
  locale: z.enum(['en', 'ar']).default('en'),
});
