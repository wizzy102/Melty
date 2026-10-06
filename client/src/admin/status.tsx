import type { OrderStatus } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';

/** The usual next step for each status (staff can still set any status manually). */
export const NEXT_STATUS: Partial<Record<OrderStatus, Exclude<OrderStatus, 'new' | 'rejected'>>> = {
  new: 'confirmed',
  confirmed: 'preparing',
  preparing: 'out_for_delivery',
  out_for_delivery: 'completed',
};

export const isClosed = (s: OrderStatus) => s === 'completed' || s === 'rejected';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useI18n();
  return (
    <span className={`status status--${status}`}>
      <span className="status__dot" aria-hidden="true" />
      {t(`status.${status}`)}
    </span>
  );
}
