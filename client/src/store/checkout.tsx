import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { publicApi } from '../api/endpoints';
import type { DeliveryArea } from '../api/types';

/**
 * Customer + delivery details entered during checkout. Kept in
 * sessionStorage (not localStorage): personal details shouldn't outlive
 * the browsing session on a shared device.
 */
export interface CheckoutDraft {
  name: string;
  phone: string;
  areaId: string;
  address: string;
  instructions: string;
}

const STORAGE_KEY = 'melty.checkout.v1';
const EMPTY: CheckoutDraft = { name: '', phone: '', areaId: '', address: '', instructions: '' };

function load(): CheckoutDraft {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

interface CheckoutState {
  draft: CheckoutDraft;
  update: (patch: Partial<CheckoutDraft>) => void;
  reset: () => void;
}

const CheckoutContext = createContext<CheckoutState | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CheckoutDraft>(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable */
    }
  }, [draft]);

  const update = useCallback((patch: Partial<CheckoutDraft>) => setDraft((d) => ({ ...d, ...patch })), []);
  const reset = useCallback(() => setDraft(EMPTY), []);

  const value = useMemo(() => ({ draft, update, reset }), [draft, update, reset]);
  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutState {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used inside <CheckoutProvider>');
  return ctx;
}

// ---- Delivery areas (fetched once per page load, shared by cart + checkout)

let areasPromise: Promise<DeliveryArea[]> | null = null;

/** Forget the cached list, e.g. after the server says an area was deactivated. */
export function invalidateDeliveryAreas() {
  areasPromise = null;
}

export function useDeliveryAreas() {
  const [areas, setAreas] = useState<DeliveryArea[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    areasPromise ??= publicApi.deliveryAreas();
    areasPromise
      .then((a) => alive && setAreas(a))
      .catch(() => {
        areasPromise = null; // allow retry
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, [attempt]);

  return {
    areas,
    error,
    retry: () => {
      setError(false);
      setAttempt((n) => n + 1);
    },
  };
}
