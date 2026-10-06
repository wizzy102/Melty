import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

interface Toast {
  id: number;
  message: string;
  icon: IconName;
  tone: 'default' | 'alert';
}

interface ToastOptions {
  icon?: IconName;
  /** "alert" = attention-grabbing (e.g. a new order) and stays longer */
  tone?: Toast['tone'];
}

type Show = (message: string, options?: ToastOptions) => void;

const ToastContext = createContext<Show | null>(null);

/** Small confirmation messages ("Added to cart"). Announced to screen readers. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const show = useCallback<Show>((message, { icon = 'check', tone = 'default' } = {}) => {
    const id = nextId.current++;
    setToasts((t) => [...t.slice(-2), { id, message, icon, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === 'alert' ? 6000 : 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            <span className="toast__icon">
              <Icon name={t.icon} size={16} />
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
