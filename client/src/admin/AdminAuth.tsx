import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { adminApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import { useI18n } from '../i18n/I18nProvider';
import { Button } from '../components/ui/Button';
import { Spinner, StateMessage } from '../components/ui/States';

type AuthState =
  | { status: 'checking' }
  | { status: 'error' }
  | { status: 'in'; username: string }
  | { status: 'out'; reason?: 'expired' | 'logout' };

interface AdminAuth {
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  recheck: () => void;
  /** Pass any admin API error here. Returns true if it meant "not logged in" (and logs out locally). */
  handleError: (e: unknown) => boolean;
}

const AuthContext = createContext<AdminAuth | null>(null);

/**
 * Client-side view of the admin session. This only decides what to render —
 * every admin API route is protected on the server regardless.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'checking' });

  const recheck = useCallback(() => {
    setState({ status: 'checking' });
    adminApi
      .me()
      .then((r) => setState({ status: 'in', username: r.admin.username }))
      .catch((e: unknown) =>
        setState(e instanceof ApiError && e.status === 401 ? { status: 'out' } : { status: 'error' }),
      );
  }, []);

  useEffect(recheck, [recheck]);

  // Stable identity: pages use it as an effect dependency.
  const handleError = useCallback((e: unknown) => {
    if (e instanceof ApiError && e.status === 401) {
      setState({ status: 'out', reason: 'expired' });
      return true;
    }
    return false;
  }, []);

  const value = useMemo<AdminAuth>(
    () => ({
      state,
      recheck,
      handleError,
      login: async (username, password) => {
        const r = await adminApi.login(username, password);
        setState({ status: 'in', username: r.admin.username });
      },
      logout: async () => {
        await adminApi.logout().catch(() => undefined);
        setState({ status: 'out', reason: 'logout' });
      },
    }),
    [state, recheck, handleError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth(): AdminAuth {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return ctx;
}

export interface LoginRedirectState {
  from?: string;
  reason?: 'expired' | 'logout';
}

/** Route guard: renders child routes only for a logged-in admin. */
export function RequireAdmin() {
  const { state, recheck } = useAdminAuth();
  const { t } = useI18n();
  const location = useLocation();

  if (state.status === 'checking') {
    return (
      <div className="admin-center">
        <Spinner size={34} label={t('common.loading')} />
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <div className="admin-center">
        <StateMessage
          tone="error"
          icon="alert"
          title={t('state.error.title')}
          body={t('state.error.body')}
          action={<Button onClick={recheck}>{t('common.retry')}</Button>}
        />
      </div>
    );
  }
  if (state.status === 'out') {
    const redirect: LoginRedirectState = { from: location.pathname + location.search, reason: state.reason };
    return <Navigate to="/admin/login" replace state={redirect} />;
  }
  return <Outlet />;
}
