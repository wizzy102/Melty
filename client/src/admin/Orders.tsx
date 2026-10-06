import { Link, useSearchParams } from 'react-router';
import { ORDER_STATUSES, type AdminOrderSummary, type OrderStatus } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';
import { formatPhone } from '../lib/checkout';
import { clockTime, dateTime, relativeTime } from '../lib/format';
import { Icon } from '../components/Icon';
import { Button } from '../components/ui/Button';
import { Skeleton, StateMessage } from '../components/ui/States';
import { useOrdersFeed } from './OrdersFeed';
import { StatusBadge } from './status';

type Tab = 'all' | OrderStatus;

export function Orders() {
  const { t, lang } = useI18n();
  const feed = useOrdersFeed();
  const [params, setParams] = useSearchParams();

  const raw = params.get('status') ?? '';
  const tab: Tab = (ORDER_STATUSES as readonly string[]).includes(raw) ? (raw as OrderStatus) : 'all';
  const counts = feed.counts;
  const countFor = (k: Tab) => (counts ? (k === 'all' ? Object.values(counts).reduce((a, b) => a + b, 0) : counts[k]) : null);
  const list = feed.orders?.filter((o) => tab === 'all' || o.status === tab) ?? null;

  return (
    <div className="container admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="section-title">{t('admin.orders.title')}</h1>
          <p className={`admin-live${feed.offline ? ' admin-live--off' : ''}`} role="status">
            <span className="admin-live__dot" aria-hidden="true" />
            {feed.offline ? t('admin.orders.offline') : t('admin.orders.live')}
            {feed.lastUpdated && !feed.offline && (
              <span className="admin-live__time">
                · {t('admin.orders.updated', { time: clockTime(new Date(feed.lastUpdated).toISOString(), lang) })}
              </span>
            )}
          </p>
        </div>
        <div className="admin-tools">
          <button
            type="button"
            className={`admin-tool${feed.soundOn ? ' is-on' : ''}`}
            aria-pressed={feed.soundOn}
            title={t('admin.orders.soundHint')}
            onClick={() => feed.setSoundOn(!feed.soundOn)}
          >
            <Icon name={feed.soundOn ? 'volume' : 'volumeOff'} size={18} />
            {feed.soundOn ? t('admin.orders.soundOn') : t('admin.orders.soundOff')}
          </button>
          <Button variant="secondary" size="sm" icon={<Icon name="refresh" size={17} />} onClick={feed.refresh}>
            {t('admin.orders.refresh')}
          </Button>
        </div>
      </div>

      <div className="admin-tabs" role="group" aria-label={t('admin.orders.tabs')}>
        {(['all', ...ORDER_STATUSES] as Tab[]).map((k) => {
          const n = countFor(k);
          return (
            <button
              key={k}
              type="button"
              className={`chip admin-tab admin-tab--${k}${tab === k ? ' chip--active' : ''}`}
              aria-pressed={tab === k}
              onClick={() => setParams(k === 'all' ? {} : { status: k }, { replace: true })}
            >
              {k === 'all' ? t('admin.orders.all') : t(`status.${k}`)}
              {n !== null && <span className="admin-tab__count">{n}</span>}
            </button>
          );
        })}
      </div>

      {list === null ? (
        feed.offline ? (
          <StateMessage
            tone="error"
            icon="alert"
            title={t('state.error.title')}
            body={t('state.error.body')}
            action={<Button onClick={feed.refresh}>{t('common.retry')}</Button>}
          />
        ) : (
          <div className="order-list">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={74} radius={18} />
            ))}
          </div>
        )
      ) : list.length === 0 ? (
        <StateMessage
          icon="list"
          title={tab === 'all' ? t('admin.orders.empty.all') : t('admin.orders.empty.tab')}
          body={t('admin.orders.emptyBody')}
        />
      ) : (
        <div className="order-list" role="list">
          <div className="order-row order-row--head" aria-hidden="true">
            <span>{t('admin.orders.col.order')}</span>
            <span>{t('admin.orders.col.customer')}</span>
            <span>{t('admin.orders.col.area')}</span>
            <span>{t('admin.orders.col.items')}</span>
            <span>{t('admin.orders.col.total')}</span>
            <span>{t('admin.orders.col.status')}</span>
          </div>
          {list.map((o) => (
            <OrderRow key={o.id} order={o} fresh={feed.freshIds.has(o.id)} now={feed.serverNow} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRow({ order: o, fresh, now }: { order: AdminOrderSummary; fresh: boolean; now: number }) {
  const { t, tr, price, lang } = useI18n();
  const rel = relativeTime(o.createdAt, now, lang) ?? t('time.justNow');
  const cls = ['order-row', o.status === 'new' && 'order-row--new', fresh && 'order-row--fresh'].filter(Boolean).join(' ');

  return (
    <Link to={`/admin/orders/${o.id}`} className={cls} role="listitem">
      <span className="order-row__id">
        <strong>#{o.orderNumber}</strong>
        <time dateTime={o.createdAt} title={dateTime(o.createdAt, lang)}>
          {clockTime(o.createdAt, lang)} · {rel}
        </time>
      </span>
      <span className="order-row__customer">
        <bdi className="order-row__name">{o.customer.name}</bdi>
        <bdi dir="ltr" className="order-row__phone">
          {formatPhone(o.customer.phone)}
        </bdi>
      </span>
      <span className="order-row__area">
        <Icon name="pin" size={15} />
        {tr(o.area.name)}
      </span>
      <span className="order-row__items">{o.itemCount === 1 ? t('cartbar.item') : t('cartbar.items', { count: o.itemCount })}</span>
      <strong className="order-row__total">{price(o.total)}</strong>
      <span className="order-row__status">
        {fresh && <span className="fresh-pill">{t('admin.orders.fresh')}</span>}
        <StatusBadge status={o.status} />
      </span>
    </Link>
  );
}
