/**
 * Explicit response shapes. Only fields listed here leave the server —
 * no raw Mongoose documents, timestamps or internal fields are exposed.
 */
import type { Localized } from '../models/shared.js';

type Id = { toString(): string };

interface CategoryLike {
  _id: Id;
  slug: string;
  name: Localized;
  description?: Localized | null;
  image?: string | null;
  art?: string | null;
}

interface ChoiceLike {
  _id: Id;
  name: Localized;
  priceModifier: number;
  available: boolean;
  isDefault: boolean;
}

interface GroupLike {
  _id: Id;
  name: Localized;
  selection: string;
  required: boolean;
  maxSelections: number;
  choices: ChoiceLike[];
}

interface ProductLike {
  _id: Id;
  slug: string;
  name: Localized;
  description?: Localized | null;
  price: number;
  image?: string | null;
  category: Id;
  available: boolean;
  featured: boolean;
  optionGroups: GroupLike[];
}

interface AreaLike {
  _id: Id;
  city: Localized;
  name: Localized;
  fee: number;
}

const emptyText: Localized = { en: '', ar: '' };

export const serializeCategory = (c: CategoryLike) => ({
  id: String(c._id),
  slug: c.slug,
  name: c.name,
  description: c.description ?? emptyText,
  image: c.image || null,
  art: c.art || 'dessert',
});

export const serializeProduct = (p: ProductLike) => ({
  id: String(p._id),
  slug: p.slug,
  name: p.name,
  description: p.description ?? emptyText,
  price: p.price,
  image: p.image || null,
  categoryId: String(p.category),
  available: p.available,
  featured: p.featured,
  optionGroups: p.optionGroups.map((g) => ({
    id: String(g._id),
    name: g.name,
    selection: g.selection,
    required: g.required,
    maxSelections: g.maxSelections,
    choices: g.choices.map((c) => ({
      id: String(c._id),
      name: c.name,
      priceModifier: c.priceModifier,
      available: c.available,
      isDefault: c.isDefault,
    })),
  })),
});

export const serializeArea = (a: AreaLike) => ({
  id: String(a._id),
  city: a.city,
  name: a.name,
  fee: a.fee,
});

export const serializePricedLine = (l: {
  product: Id;
  name: Localized;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  selections: { groupId: Id; groupName: Localized; choiceId: Id; choiceName: Localized; priceModifier: number }[];
}) => ({
  productId: String(l.product),
  name: l.name,
  basePrice: l.basePrice,
  unitPrice: l.unitPrice,
  quantity: l.quantity,
  lineTotal: l.lineTotal,
  selections: l.selections.map((s) => ({
    groupId: String(s.groupId),
    groupName: s.groupName,
    choiceId: String(s.choiceId),
    choiceName: s.choiceName,
    priceModifier: s.priceModifier,
  })),
});
