import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { adminApi } from '../api/endpoints';
import type { AdminOrderSummary, OrderStatus } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';
import { useToast } from '../components/ui/Toast';
import { useAdminAuth } from './AdminAuth';

export const POLL_MS = 10_000;
const SOUND_KEY = 'melty.admin.sound';

interface Feed {
  orders: AdminOrderSummary[] | null;
  counts: Record<OrderStatus, number> | null;
  /** Server clock at the last successful poll (relative times use it, not the device clock). */
  serverNow: number;
  lastUpdated: number | null;
  offline: boolean;
  /** Orders that arrived while this dashboard was open and haven't been opened yet. */
  freshIds: Set<string>;
  markSeen: (id: string) => void;
  refresh: () => void;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
}

const FeedContext = createContext<Feed | null>(null);

function loadSound(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === '1';
  } catch {
    return false;
  }
}

/** Short two-note chime. No audio file needed. */
function chime() {
  try {
    const ctx = new AudioContext();
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
    setTimeout(() => ctx.close(), 1000);
  } catch {
    /* audio not available / blocked until the user interacts */
  }
}

export function OrdersFeedProvider({ children }: { children: ReactNode }) {
  const { t, price } = useI18n();
  const toast = useToast();
  const { handleError } = useAdminAuth();

  const [orders, setOrders] = useState<AdminOrderSummary[] | null>(null);
  const [counts, setCounts] = useState<Record<OrderStatus, number> | null>(null);
  const [serverNow, setServerNow] = useState(Date.now());
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [offline, setOffline] = useState(false);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [soundOn, setSoundState] = useState(loadSound);

  const highestSeen = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inFlight = useRef(false);
  // Read inside the poll without restarting it when these change.
  const live = useRef({ t, price, toast, handleError, soundOn });
  live.current = { t, price, toast, handleError, soundOn };

  const poll = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    clearTimeout(timer.current);
    try {
      const r = await adminApi.orders();
      const max = r.orders.reduce((m, o) => Math.max(m, o.orderNumber), 0);
      if (highestSeen.current !== null) {
        const arrived = r.orders.filter((o) => o.orderNumber > highestSeen.current!);
        if (arrived.length) {
          const { t, price, toast, soundOn } = live.current;
          setFreshIds((s) => new Set([...s, ...arrived.map((o) => o.id)]));
          for (const o of [...arrived].reverse()) {
            toast(t('admin.orders.newToast', { number: o.orderNumber, total: price(o.total) }), { icon: 'bell', tone: 'alert' });
          }
          if (soundOn) chime();
        }
      }
      highestSeen.current = Math.max(highestSeen.current ?? 0, max);
      setOrders(r.orders);
      setCounts(r.counts);
      setServerNow(new Date(r.serverTime).getTime());
      setLastUpdated(Date.now());
      setOffline(false);
    } catch (e) {
      if (live.current.handleError(e)) return; // logged out — the guard redirects, stop polling
      setOffline(true);
    } finally {
      inFlight.current = false;
    }
    timer.current = setTimeout(poll, POLL_MS);
  }, []);

  useEffect(() => {
    poll();
    // Catch up immediately when staff come back to the tab.
    const onVisible = () => document.visibilityState === 'visible' && poll();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [poll]);

  // Keeps the "5 min ago" labels moving between polls.
  useEffect(() => {
    const id = setInterval(() => setServerNow((n) => n + 15_000), 15_000);
    return () => clearInterval(id);
  }, []);

  const markSeen = useCallback(
    (id: string) =>
      setFreshIds((s) => {
        if (!s.has(id)) return s;
        const next = new Set(s);
        next.delete(id);
        return next;
      }),
    [],
  );

  const setSoundOn = useCallback((on: boolean) => {
    setSoundState(on);
    try {
      localStorage.setItem(SOUND_KEY, on ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (on) chime(); // also unlocks audio, since this runs on a click
  }, []);

  // Tab title shows waiting orders, e.g. "(2) Melty Admin"; restored when leaving the admin area.
  const baseTitle = useRef(document.title);
  const newCount = counts?.new ?? 0;
  useEffect(() => {
    document.title = newCount > 0 ? `(${newCount}) ${t('admin.title')}` : t('admin.title');
  }, [newCount, t]);
  useEffect(() => () => void (document.title = baseTitle.current), []);

  const value = useMemo<Feed>(
    () => ({
      orders,
      counts,
      serverNow,
      lastUpdated,
      offline,
      freshIds,
      markSeen,
      refresh: poll,
      soundOn,
      setSoundOn,
    }),
    [orders, counts, serverNow, lastUpdated, offline, freshIds, markSeen, poll, soundOn, setSoundOn],
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useOrdersFeed(): Feed {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error('useOrdersFeed must be used inside <OrdersFeedProvider>');
  return ctx;
}
