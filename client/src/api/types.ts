/** Response shapes — mirror server/src/services/serializers.ts */

export type Lang = 'en' | 'ar';
export type Localized = Record<Lang, string>;

export interface Category {
  id: string;
  slug: string;
  name: Localized;
  description: Localized;
  image: string | null;
  art: string;
}

export interface OptionChoice {
  id: string;
  name: Localized;
  priceModifier: number;
  available: boolean;
  isDefault: boolean;
}

export interface OptionGroup {
  id: string;
  name: Localized;
  selection: 'single' | 'multiple';
  required: boolean;
  /** 0 = unlimited (multiple only) */
  maxSelections: number;
  choices: OptionChoice[];
}

export interface Product {
  id: string;
  slug: string;
  name: Localized;
  description: Localized;
  price: number;
  image: string | null;
  categoryId: string;
  available: boolean;
  featured: boolean;
  optionGroups: OptionGroup[];
}

export interface Menu {
  categories: Category[];
  products: Product[];
}

export interface DeliveryArea {
  id: string;
  city: Localized;
  name: Localized;
  fee: number;
}

/** What the client sends for a cart line — IDs and quantities only, never prices. */
export interface CartLinePayload {
  productId: string;
  quantity: number;
  selections: { groupId: string; choiceIds: string[] }[];
}

export interface PricedLine {
  productId: string;
  name: Localized;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  selections: {
    groupId: string;
    groupName: Localized;
    choiceId: string;
    choiceName: Localized;
    priceModifier: number;
  }[];
}

export interface Quote {
  items: PricedLine[];
  subtotal: number;
  deliveryFee: number | null;
  total: number;
  area: DeliveryArea | null;
}

export interface OrderConfirmation {
  orderNumber: number;
  createdAt: string;
  customerName: string;
  area: { city: Localized; name: Localized };
  items: PricedLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface CreateOrderPayload {
  items: CartLinePayload[];
  customer: { name: string; phone: string };
  delivery: { areaId: string; address: string; instructions: string };
  locale: Lang;
}

// ---- Admin

export const ORDER_STATUSES = [
  'new',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'completed',
  'rejected',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface AdminOrderSummary {
  id: string;
  orderNumber: number;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; phone: string };
  area: { city: Localized; name: Localized };
  itemCount: number;
  total: number;
}

export interface AdminOrderDetail extends AdminOrderSummary {
  updatedAt: string;
  locale: Lang;
  fulfillmentType: 'delivery';
  delivery: { city: Localized; area: Localized; address: string; instructions: string };
  items: {
    productId: string;
    name: Localized;
    basePrice: number;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    selections: { groupName: Localized; choiceName: Localized; priceModifier: number }[];
  }[];
  subtotal: number;
  deliveryFee: number;
  statusHistory: { status: OrderStatus; at: string }[];
}

export interface AdminOrdersList {
  orders: AdminOrderSummary[];
  counts: Record<OrderStatus, number>;
  serverTime: string;
}
