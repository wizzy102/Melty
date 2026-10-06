import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { adminApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import { ORDER_STATUSES, type AdminOrderDetail, type OrderStatus } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';
import { formatPhone } from '../lib/checkout';
import { dateTime, relativeTime } from '../lib/format';
import { Icon } from '../components/Icon';
import { TotalsRows } from '../components/OrderSummary';
import { Button } from '../components/ui/Button';
import { SelectField } from '../components/ui/Field';
import { Sheet } from '../components/ui/Sheet';
import { InlineAlert, Skeleton, StateMessage } from '../components/ui/States';
import { useToast } from '../components/ui/Toast';
import { useAdminAuth } from './AdminAuth';
import { useOrdersFeed } from './OrdersFeed';
import { whatsappLink, whatsappMessage } from '../config/whatsapp';
import { NEXT_STATUS, StatusBadge, isClosed } from './status';

export function OrderDetail() {
  const { id = '' } = useParams();
  const { t, tr, price, lang, errorText } = useI18n();
  const { handleError } = useAdminAuth();
  const feed = useOrdersFeed();
  const toast = useToast();

  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState<OrderStatus | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmReject, setConfirmReject] = useState(false);
  const [copied, setCopied] = useState<'phone' | 'address' | null>(null);
  /** Status whose WhatsApp message staff opened (this visit), and whether to nudge after a change. */
  const [waOpenedFor, setWaOpenedFor] = useState<OrderStatus | null>(null);
  const [waNudge, setWaNudge] = useState(false);

  const { markSeen, refresh } = feed;

  const load = useCallback(() => {
    setLoadError(null);
    adminApi
      .order(id)
      .then(setOrder)
      .catch((e: unknown) => {
        if (handleError(e)) return;
        setLoadError(e instanceof ApiError ? e.code : 'server_error');
      });
  }, [id, handleError]);

  useEffect(() => {
    setOrder(null);
    setWaOpenedFor(null);
    setWaNudge(false);
    load();
  }, [load]);

  useEffect(() => {
    markSeen(id);
  }, [id, markSeen]);

  const setStatus = async (status: OrderStatus) => {
    if (!order || saving || status === order.status) return;
    setSaving(status);
    setSaveError(null);
    try {
      const updated = await adminApi.setStatus(order.id, status);
      setOrder(updated);
      setConfirmReject(false);
      setWaNudge(true);
      refresh();
      toast(t('admin.order.statusUpdated', { number: updated.orderNumber, status: t(`status.${status}`) }));
    } catch (e) {
      if (!handleError(e)) setSaveError(errorText(e instanceof ApiError ? e.code : 'server_error'));
    } finally {
      setSaving(null);
    }
  };

  const copy = async (what: 'phone' | 'address', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied((c) => (c === what ? null : c)), 1600);
    } catch {
      /* clipboard blocked — the text is still selectable */
    }
  };

  const back = (
    <Link to="/admin" className="text-btn admin-back">
      <Icon name="arrowLeft" size={17} />
      {t('admin.order.back')}
    </Link>
  );

  if (loadError) {
    const missing = loadError === 'order_not_found' || loadError === 'validation_failed' || loadError === 'invalid_id';
    return (
      <div className="container admin-page">
        {back}
        <StateMessage
          tone={missing ? 'default' : 'error'}
          icon="alert"
          title={missing ? t('admin.order.notFound') : t('state.error.title')}
          body={missing ? t('admin.order.notFoundBody') : t('state.error.body')}
          action={!missing && <Button onClick={load}>{t('common.retry')}</Button>}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container admin-page">
        {back}
        <div className="admin-detail">
          <Skeleton height={140} radius={24} />
          <Skeleton height={320} radius={24} />
        </div>
      </div>
    );
  }

  const next = NEXT_STATUS[order.status];
  const closed = isClosed(order.status);
  const phone = formatPhone(order.customer.phone);
  const area = `${tr(order.delivery.area)} — ${tr(order.delivery.city)}`;
  const fullAddress = `${order.delivery.address}\n${area}`;

  return (
    <div className="container admin-page">
      {back}

      <div className="admin-page__head">
        <div>
          <h1 className="section-title admin-detail__title">
            {t('admin.order.title', { number: order.orderNumber })}
            <StatusBadge status={order.status} />
          </h1>
          <p className="panel__sub">
            {t('admin.order.placed', { time: dateTime(order.createdAt, lang) })}
            {' · '}
            {relativeTime(order.createdAt, feed.serverNow, lang) ?? t('time.justNow')}
            {' · '}
            {t('admin.order.lang', { lang: t(`admin.lang.${order.locale}`) })}
          </p>
        </div>
      </div>

      <div className="admin-detail">
        <div className="admin-detail__main">
          {/* Status actions first: it's what staff touch most */}
          <section className="panel admin-actions" aria-labelledby="status-title">
            <h2 id="status-title" className="panel__title">
              {t('admin.order.status')}
            </h2>
            {closed ? (
              <InlineAlert tone={order.status === 'completed' ? 'success' : 'info'}>{t('admin.order.closed')}</InlineAlert>
            ) : (
              <div className="admin-actions__row">
                {next && (
                  <Button size="lg" loading={saving === next} disabled={saving !== null} onClick={() => setStatus(next)} iconEnd={<Icon name="arrowRight" size={19} />}>
                    {t(`admin.order.next.${next}`)}
                  </Button>
                )}
                <Button variant="danger" size="lg" disabled={saving !== null} onClick={() => setConfirmReject(true)}>
                  {t('admin.order.reject')}
                </Button>
              </div>
            )}
            {saveError && <InlineAlert>{saveError}</InlineAlert>}

            <div className={`wa-box${waNudge ? ' wa-box--nudge' : ''}`}>
              <div className="wa-box__head">
                <span className="wa-box__title">{waNudge ? t('admin.wa.nudge') : t('admin.wa.title')}</span>
                <span className="wa-box__lang">{t('admin.wa.lang', { lang: t(`admin.lang.${order.locale}`) })}</span>
              </div>
              <p className="wa-box__preview" lang={order.locale} dir={order.locale === 'ar' ? 'rtl' : 'ltr'}>
                {whatsappMessage(order)}
              </p>
              <div className="wa-box__foot">
                {/* A real link (not window.open) so it is never caught by popup blockers */}
                <a
                  className="btn btn--md wa-btn"
                  href={whatsappLink(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setWaOpenedFor(order.status);
                    setWaNudge(false);
                  }}
                >
                  <Icon name="whatsapp" size={20} />
                  <span className="btn__label">{t('admin.wa.send', { status: t(`status.${order.status}`) })}</span>
                </a>
                {waOpenedFor === order.status ? (
                  <span className="wa-box__done">
                    <Icon name="check" size={16} />
                    {t('admin.wa.opened')}
                  </span>
                ) : (
                  <span className="wa-box__hint">{t('admin.wa.hint')}</span>
                )}
              </div>
            </div>

            <SelectField
              label={t('admin.order.setStatus')}
              value={order.status}
              disabled={saving !== null}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`status.${s}`)}
                </option>
              ))}
            </SelectField>
          </section>

          <section className="panel" aria-labelledby="items-title">
            <h2 id="items-title" className="panel__title">
              {t('admin.order.items')}
            </h2>
            <ul className="order-items">
              {order.items.map((item, i) => (
                <li key={i} className="order-item">
                  <span className="order-item__qty">{item.quantity}×</span>
                  <div className="order-item__body">
                    <span className="order-item__name">{tr(item.name)}</span>
                    {item.selections.length > 0 && (
                      <ul className="admin-opts">
                        {item.selections.map((s, j) => (
                          <li key={j}>
                            <span className="admin-opts__group">{tr(s.groupName)}:</span> {tr(s.choiceName)}
                            {s.priceModifier > 0 && <span className="admin-opts__mod"> +{price(s.priceModifier)}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="order-item__unit">{t('cart.unitPrice', { price: price(item.unitPrice) })}</span>
                  </div>
                  <strong className="order-item__total">{price(item.lineTotal)}</strong>
                </li>
              ))}
            </ul>
            <TotalsRows subtotal={order.subtotal} deliveryFee={order.deliveryFee} total={order.total} />
          </section>
        </div>

        <aside className="admin-detail__side">
          <section className="panel" aria-labelledby="customer-title">
            <h2 id="customer-title" className="panel__title">
              {t('admin.order.customer')}
            </h2>
            <p className="admin-big">
              <bdi>{order.customer.name}</bdi>
            </p>
            <p className="admin-phone">
              <bdi dir="ltr">{phone}</bdi>
            </p>
            <div className="admin-actions__row">
              <a className="btn btn--primary btn--md" href={`tel:${order.customer.phone}`}>
                <Icon name="phone" size={18} />
                <span className="btn__label">{t('admin.order.call')}</span>
              </a>
              <Button variant="secondary" icon={<Icon name={copied === 'phone' ? 'check' : 'copy'} size={17} />} onClick={() => copy('phone', order.customer.phone)}>
                {copied === 'phone' ? t('admin.order.copied') : t('admin.order.copy')}
              </Button>
            </div>
          </section>

          <section className="panel" aria-labelledby="delivery-title">
            <h2 id="delivery-title" className="panel__title">
              {t('admin.order.delivery')}
            </h2>
            <dl className="details-list">
              <div>
                <dt>{t('form.city')}</dt>
                <dd>{tr(order.delivery.city)}</dd>
              </div>
              <div>
                <dt>{t('form.area')}</dt>
                <dd>{tr(order.delivery.area)}</dd>
              </div>
              <div className="details-list__wide">
                <dt>{t('form.address')}</dt>
                <dd>
                  <bdi>{order.delivery.address}</bdi>
                </dd>
              </div>
              <div className="details-list__wide">
                <dt>{t('form.instructions')}</dt>
                <dd className={order.delivery.instructions ? undefined : 'details-list__none'}>
                  {order.delivery.instructions ? <bdi>{order.delivery.instructions}</bdi> : t('review.noInstructions')}
                </dd>
              </div>
            </dl>
            <Button variant="secondary" size="sm" icon={<Icon name={copied === 'address' ? 'check' : 'copy'} size={16} />} onClick={() => copy('address', fullAddress)}>
              {copied === 'address' ? t('admin.order.copied') : t('admin.order.copyAddress')}
            </Button>
          </section>

          <section className="panel" aria-labelledby="history-title">
            <h2 id="history-title" className="panel__title">
              {t('admin.order.history')}
            </h2>
            <ol className="timeline">
              {[...order.statusHistory].reverse().map((h, i) => (
                <li key={i} className={i === 0 ? 'is-current' : undefined}>
                  <StatusBadge status={h.status} />
                  <time dateTime={h.at}>{dateTime(h.at, lang)}</time>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      <Sheet
        open={confirmReject}
        onClose={() => setConfirmReject(false)}
        title={t('admin.order.rejectTitle', { number: order.orderNumber })}
        footer={
          <div className="admin-actions__row">
            <Button variant="secondary" onClick={() => setConfirmReject(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" loading={saving === 'rejected'} onClick={() => setStatus('rejected')}>
              {t('admin.order.rejectConfirm')}
            </Button>
          </div>
        }
      >
        <p className="muted">{t('admin.order.rejectBody')}</p>
      </Sheet>
    </div>
  );
}
