import { Types } from 'mongoose';
import { Product } from '../models/Product.js';
import { DeliveryArea } from '../models/DeliveryArea.js';
import type { Localized } from '../models/shared.js';
import { badRequest, conflict } from '../utils/httpError.js';
import type { CartLineInput } from './orderInput.js';

export interface PricedSelection {
  groupId: Types.ObjectId;
  groupName: Localized;
  choiceId: Types.ObjectId;
  choiceName: Localized;
  priceModifier: number;
}

export interface PricedLine {
  product: Types.ObjectId;
  name: Localized;
  basePrice: number;
  selections: PricedSelection[];
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PricedArea {
  _id: Types.ObjectId;
  city: Localized;
  name: Localized;
  fee: number;
}

/**
 * AUTHORITATIVE pricing. Every number comes from the database; the client
 * only supplies IDs and quantities. Throws a 400/409 with a stable error code
 * (plus the offending line index) when anything is invalid or unavailable.
 */
export async function priceCart(lines: CartLineInput[]): Promise<{ items: PricedLine[]; subtotal: number }> {
  const ids = [...new Set(lines.map((l) => l.productId))];
  const products = await Product.find({ _id: { $in: ids } }).lean();
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const items: PricedLine[] = lines.map((line, index) => {
    const product = byId.get(line.productId);
    if (!product) throw badRequest('product_not_found', { index });
    if (!product.available) throw conflict('product_unavailable', { index });

    const requested = new Map<string, string[]>();
    for (const sel of line.selections) {
      if (requested.has(sel.groupId)) throw badRequest('invalid_option', { index });
      requested.set(sel.groupId, [...new Set(sel.choiceIds)]);
    }

    const knownGroupIds = new Set(product.optionGroups.map((g) => String(g._id)));
    for (const groupId of requested.keys()) {
      if (!knownGroupIds.has(groupId)) throw badRequest('invalid_option', { index });
    }

    const selections: PricedSelection[] = [];
    for (const group of product.optionGroups) {
      const chosen = requested.get(String(group._id)) ?? [];

      if (group.required && chosen.length === 0) throw badRequest('option_required', { index });
      if (group.selection === 'single' && chosen.length > 1) throw badRequest('invalid_option', { index });
      if (group.selection === 'multiple' && group.maxSelections > 0 && chosen.length > group.maxSelections) {
        throw badRequest('too_many_selections', { index });
      }

      for (const choiceId of chosen) {
        const choice = group.choices.find((c) => String(c._id) === choiceId);
        if (!choice) throw badRequest('invalid_option', { index });
        if (!choice.available) throw conflict('option_unavailable', { index });
        selections.push({
          groupId: group._id,
          groupName: group.name,
          choiceId: choice._id,
          choiceName: choice.name,
          priceModifier: choice.priceModifier,
        });
      }
    }

    const unitPrice = product.price + selections.reduce((sum, s) => sum + s.priceModifier, 0);
    return {
      product: product._id,
      name: product.name,
      basePrice: product.price,
      selections,
      unitPrice,
      quantity: line.quantity,
      lineTotal: unitPrice * line.quantity,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { items, subtotal };
}

export async function getActiveArea(areaId: string): Promise<PricedArea> {
  const area = await DeliveryArea.findOne({ _id: areaId, active: true }).lean();
  if (!area) throw badRequest('area_not_found');
  return { _id: area._id, city: area.city, name: area.name, fee: area.fee };
}
