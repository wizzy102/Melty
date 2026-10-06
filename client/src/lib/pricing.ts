import type { Product } from '../api/types';

/** groupId → chosen choiceIds */
export type Selections = Record<string, string[]>;

/**
 * DISPLAY-ONLY price preview. The server recomputes every price from the
 * database when quoting/placing an order; nothing here is trusted.
 */
export function unitPrice(product: Product, selections: Selections): number {
  let price = product.price;
  for (const group of product.optionGroups) {
    for (const choiceId of selections[group.id] ?? []) {
      const choice = group.choices.find((c) => c.id === choiceId);
      if (choice) price += choice.priceModifier;
    }
  }
  return price;
}

/** Cheapest valid configuration — shown as "From X" on cards. */
export function fromPrice(product: Product): { amount: number; varies: boolean } {
  let amount = product.price;
  let varies = false;
  for (const group of product.optionGroups) {
    if (group.choices.some((c) => c.priceModifier > 0)) varies = true;
    if (group.required) {
      const cheapest = Math.min(...group.choices.filter((c) => c.available).map((c) => c.priceModifier));
      if (Number.isFinite(cheapest)) amount += cheapest;
    }
  }
  return { amount, varies };
}

/** Default selections when a product page opens. */
export function defaultSelections(product: Product): Selections {
  const out: Selections = {};
  for (const group of product.optionGroups) {
    if (group.selection === 'single' && group.required) {
      const def = group.choices.find((c) => c.isDefault && c.available) ?? group.choices.find((c) => c.available);
      if (def) out[group.id] = [def.id];
    }
  }
  return out;
}

export type SelectionProblem = { groupId: string; code: 'option_required' | 'too_many_selections' };

/** Mirrors the server's option rules so the UI can guide the customer. */
export function validateSelections(product: Product, selections: Selections): SelectionProblem[] {
  const problems: SelectionProblem[] = [];
  for (const group of product.optionGroups) {
    const chosen = selections[group.id] ?? [];
    if (group.required && chosen.length === 0) problems.push({ groupId: group.id, code: 'option_required' });
    if (group.selection === 'multiple' && group.maxSelections > 0 && chosen.length > group.maxSelections) {
      problems.push({ groupId: group.id, code: 'too_many_selections' });
    }
  }
  return problems;
}

/** Stable identity for "same product, same options" so duplicates merge in the cart. */
export function configKey(productId: string, selections: Selections): string {
  const parts = Object.keys(selections)
    .filter((g) => selections[g].length)
    .sort()
    .map((g) => `${g}:${[...selections[g]].sort().join(',')}`);
  return `${productId}|${parts.join(';')}`;
}
