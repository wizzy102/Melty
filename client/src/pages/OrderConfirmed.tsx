import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { loadLastOrder } from '../lib/checkout';
import { CheckoutSteps } from '../components/CheckoutSteps';
import { OrderItems, TotalsRows } from '../components/OrderSummary';
import { Icon } from '../components/Icon';
import { ButtonLink } from '../components/ui/Button';
import { StateMessage } from '../components/ui/States';

export function OrderConfirmed() {
  const { t, tr, lang } = useI18n();
  const [order] = useState(loadLastOrder);

  if (!order) {
    return (
      <section className="container section page-enter">
        <StateMessage
          icon="bag"
          title={t('confirm.none.title')}
          body={t('confirm.none.body')}
          action={<ButtonLink to="/menu">{t('cart.empty.cta')}</ButtonLink>}
        />
      </section>
    );
  }

  const placedAt = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(order.createdAt));

  return (
    <div className="container section page-enter confirm">
      <CheckoutSteps current={3} />

      <div className="confirm__hero" role="status">
        <span className="confirm__badge" aria-hidden="true">
          <Icon name="check" size={46} />
        </span>
        <p className="eyebrow">{t('confirm.eyebrow', { number: order.orderNumber })}</p>
        <h1 className="confirm__title">{t('confirm.title')}</h1>
        <p className="confirm__body">{t('confirm.body', { name: `⁨${order.customerName}⁩` /* isolate: name may be in either script */ })}</p>
      </div>

      <div className="confirm__grid">
        <section className="panel" aria-labelledby="confirm-meta">
          <h2 id="confirm-meta" className="sr-only">
            {t('confirm.number')}
          </h2>
          <dl className="confirm__meta">
            <div>
              <dt>{t('confirm.number')}</dt>
              <dd className="confirm__number">#{order.orderNumber}</dd>
            </div>
            <div>
              <dt>{t('confirm.placed')}</dt>
              <dd>{placedAt}</dd>
            </div>
            <div>
              <dt>{t('confirm.deliverTo')}</dt>
              <dd>
                {tr(order.area.name)} — {tr(order.area.city)}
              </dd>
            </div>
          </dl>

          <h3 className="confirm__next-title">{t('confirm.next.title')}</h3>
          <ol className="confirm__next">
            <li>
              <Icon name="phone" size={18} />
              {t('confirm.next.1')}
            </li>
            <li>
              <Icon name="sparkle" size={18} />
              {t('confirm.next.2')}
            </li>
            <li>
              <Icon name="scooter" size={18} />
              {t('confirm.next.3')}
            </li>
          </ol>
        </section>

        <section className="panel" aria-labelledby="confirm-summary">
          <h2 id="confirm-summary" className="panel__title">
            {t('confirm.summary')}
          </h2>
          <OrderItems items={order.items} />
          <TotalsRows subtotal={order.subtotal} deliveryFee={order.deliveryFee} total={order.total} />
        </section>
      </div>

      <div className="confirm__actions">
        <ButtonLink to="/menu" size="lg" iconEnd={<Icon name="arrowRight" size={20} />}>
          {t('confirm.again')}
        </ButtonLink>
        <ButtonLink to="/" size="lg" variant="secondary">
          {t('confirm.home')}
        </ButtonLink>
      </div>
    </div>
  );
}
