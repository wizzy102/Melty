import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartLinePayload, Product } from '../api/types';
import { configKey, unitPrice, type Selections } from '../lib/pricing';
import { useMenu } from './menu';

const STORAGE_KEY = 'melty.cart.v1';
export const MAX_QUANTITY = 20;

/** Stored cart line: IDs + quantity only. Prices are always derived. */
export interface CartLine {
  key: string;
  productId: string;
  quantity: number;
  selections: Selections;
}

/** Cart line joined with current menu data for display. */
export interface ResolvedLine extends CartLine {
  product: Product | null;
  unitPrice: number;
  lineTotal: number;
  /** product removed from the menu, or marked sold out since it was added */
  problem: 'missing' | 'unavailable' | null;
}

interface CartState {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  hasProblems: boolean;
  add: (productId: string, selections: Selections, quantity: number) => void;
  replace: (key: string, selections: Selections, quantity: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  /** API payload — what the server receives (no prices). */
  toPayload: () => CartLinePayload[];
}

const CartContext = createContext<CartState | null>(null);

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        l && typeof l.key === 'string' && typeof l.productId === 'string' && Number.isInteger(l.quantity) && l.selections && typeof l.selections === 'object',
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { productById, status } = useMenu();
  const [stored, setStored] = useState<CartLine[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* storage unavailable — cart still works for this visit */
    }
  }, [stored]);

  const add = useCallback<CartState['add']>((productId, selections, quantity) => {
    const key = configKey(productId, selections);
    setStored((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + quantity) } : l));
      }
      return [...prev, { key, productId, selections, quantity: Math.min(MAX_QUANTITY, quantity) }];
    });
  }, []);

  /** Edit customization of an existing line (merges if it now matches another line). */
  const replace = useCallback<CartState['replace']>((oldKey, selections, quantity) => {
    setStored((prev) => {
      const old = prev.find((l) => l.key === oldKey);
      if (!old) return prev;
      const key = configKey(old.productId, selections);
      const without = prev.filter((l) => l.key !== oldKey);
      const twin = without.find((l) => l.key === key);
      if (twin) {
        return without.map((l) => (l.key === key ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + quantity) } : l));
      }
      const index = prev.findIndex((l) => l.key === oldKey);
      const next = [...without];
      next.splice(index, 0, { key, productId: old.productId, selections, quantity });
      return next;
    });
  }, []);

  const setQuantity = useCallback<CartState['setQuantity']>((key, quantity) => {
    setStored((prev) =>
      prev.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, Math.min(MAX_QUANTITY, quantity)) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setStored((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setStored([]), []);

  const value = useMemo<CartState>(() => {
    const lines: ResolvedLine[] = stored.map((l) => {
      const product = productById.get(l.productId) ?? null;
      const price = product ? unitPrice(product, l.selections) : 0;
      // Only flag "missing" once the menu has actually loaded.
      const problem = status !== 'ready' ? null : !product ? 'missing' : !product.available ? 'unavailable' : null;
      return { ...l, product, unitPrice: price, lineTotal: price * l.quantity, problem };
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.filter((l) => !l.problem).reduce((s, l) => s + l.lineTotal, 0),
      hasProblems: lines.some((l) => l.problem),
      add,
      replace,
      setQuantity,
      remove,
      clear,
      toPayload: () =>
        stored.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
          selections: Object.entries(l.selections)
            .filter(([, ids]) => ids.length)
            .map(([groupId, choiceIds]) => ({ groupId, choiceIds })),
        })),
    };
  }, [stored, productById, status, add, replace, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
