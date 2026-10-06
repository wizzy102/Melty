import type { OrderConfirmation } from '../api/types';
import type { CheckoutDraft } from '../store/checkout';

/** Mirrors server/src/services/orderInput.ts — the server re-validates everything. */
export const LIMITS = { name: 80, address: 300, instructions: 300 } as const;

/**
 * Egyptian mobile: 010 / 011 / 012 / 015 + 8 digits. Accepts +20 / 0020,
 * spaces, dashes and Arabic-Indic digits; returns the 11-digit local form.
 */
export function normalizeEgyptianPhone(raw: string): string | null {
  const westernized = raw.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
  let digits = westernized.replace(/[\s\-()]/g, '');
  if (digits.startsWith('+20')) digits = '0' + digits.slice(3);
  else if (digits.startsWith('0020')) digits = '0' + digits.slice(4);
  else if (digits.startsWith('20') && digits.length === 12) digits = '0' + digits.slice(2);
  return /^01[0125]\d{8}$/.test(digits) ? digits : null;
}

/** "01012345678" → "010 1234 5678" */
export function formatPhone(raw: string): string {
  const n = normalizeEgyptianPhone(raw);
  return n ? `${n.slice(0, 3)} ${n.slice(3, 7)} ${n.slice(7)}` : raw;
}

export type CheckoutField = 'name' | 'phone' | 'areaId' | 'address' | 'instructions';
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

/** Returns error codes (same codes the API uses), keyed by field. */
export function validateCheckout(d: CheckoutDraft, areaIds: string[] | null): CheckoutErrors {
  const e: CheckoutErrors = {};
  const name = d.name.trim();
  if (name.length < 2) e.name = 'name_required';
  else if (name.length > LIMITS.name) e.name = 'too_long';

  if (!d.phone.trim()) e.phone = 'phone_required';
  else if (!normalizeEgyptianPhone(d.phone)) e.phone = 'phone_invalid';

  if (!d.areaId || (areaIds && !areaIds.includes(d.areaId))) e.areaId = 'area_not_found';

  const address = d.address.trim();
  if (address.length < 5) e.address = 'address_required';
  else if (address.length > LIMITS.address) e.address = 'too_long';

  if (d.instructions.trim().length > LIMITS.instructions) e.instructions = 'too_long';
  return e;
}

/** API validation paths → form fields. */
export const SERVER_FIELD: Record<string, CheckoutField> = {
  'customer.name': 'name',
  'customer.phone': 'phone',
  'delivery.areaId': 'areaId',
  'delivery.address': 'address',
  'delivery.instructions': 'instructions',
};

/** Error codes meaning "the cart no longer matches the menu". */
export const CART_ERROR_CODES = new Set([
  'product_unavailable',
  'option_unavailable',
  'product_not_found',
  'invalid_option',
  'option_required',
  'too_many_selections',
  'invalid_quantity',
  'cart_empty',
  'cart_too_large',
]);

// ---- Last placed order. There is deliberately no public "look up an order"
// endpoint, so the confirmation screen reads what the API returned, kept for
// this browser tab only.

const LAST_ORDER_KEY = 'melty.lastOrder.v1';

export function saveLastOrder(order: OrderConfirmation) {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* storage unavailable — confirmation still renders from memory below */
  }
  memoryOrder = order;
}

let memoryOrder: OrderConfirmation | null = null;

export function loadLastOrder(): OrderConfirmation | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    const parsed = raw ? (JSON.parse(raw) as OrderConfirmation) : null;
    if (parsed && typeof parsed.orderNumber === 'number' && Array.isArray(parsed.items)) return parsed;
  } catch {
    /* fall through */
  }
  return memoryOrder;
}
