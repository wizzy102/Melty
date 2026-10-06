import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { publicApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { Category, Menu, Product } from '../api/types';

interface MenuState {
  status: 'loading' | 'ready' | 'error';
  errorCode: string | null;
  categories: Category[];
  products: Product[];
  productById: Map<string, Product>;
  productBySlug: Map<string, Product>;
  categoryById: Map<string, Category>;
  reload: () => void;
}

const MenuContext = createContext<MenuState | null>(null);

/** Loads the whole public menu once and shares it across the app. */
export function MenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [status, setStatus] = useState<MenuState['status']>('loading');
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const load = useCallback(() => {
    setStatus('loading');
    setErrorCode(null);
    publicApi
      .menu()
      .then((m) => {
        setMenu(m);
        setStatus('ready');
      })
      .catch((e: unknown) => {
        setErrorCode(e instanceof ApiError ? e.code : 'server_error');
        setStatus('error');
      });
  }, []);

  useEffect(load, [load]);

  const value = useMemo<MenuState>(() => {
    const categories = menu?.categories ?? [];
    const products = menu?.products ?? [];
    return {
      status,
      errorCode,
      categories,
      products,
      productById: new Map(products.map((p) => [p.id, p])),
      productBySlug: new Map(products.map((p) => [p.slug, p])),
      categoryById: new Map(categories.map((c) => [c.id, c])),
      reload: load,
    };
  }, [menu, status, errorCode, load]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuState {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used inside <MenuProvider>');
  return ctx;
}
