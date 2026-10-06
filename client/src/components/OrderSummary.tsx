import type { PricedLine } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';

/** Server-priced line items (review + confirmation screens). */
export function OrderItems({ items }: { items: PricedLine[] }) {
  const { t, tr, price } = useI18n();
  return (
    <ul className="order-items">
      {items.map((item, i) => (
        <li key={i} className="order-item">
          <span className="order-item__qty">{item.quantity}×</span>
          <div className="order-item__body">
            <span className="order-item__name">{tr(item.name)}</span>
            {item.selections.length > 0 && (
              <ul className="cart-line__opts">
                {item.selections.map((s) => (
                  <li key={s.choiceId}>
                    {tr(s.choiceName)}
                    {s.priceModifier > 0 && <span> +{price(s.priceModifier)}</span>}
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
  );
}

export function TotalsRows({ subtotal, deliveryFee, total }: { subtotal: number; deliveryFee: number; total: number }) {
  const { t, price } = useI18n();
  return (
    <dl className="summary__rows">
      <div className="summary__row">
        <dt>{t('cart.subtotal')}</dt>
        <dd>{price(subtotal)}</dd>
      </div>
      <div className="summary__row">
        <dt>{t('cart.deliveryFee')}</dt>
        <dd>{price(deliveryFee)}</dd>
      </div>
      <div className="summary__row summary__row--total">
        <dt>{t('cart.total')}</dt>
        <dd>{price(total)}</dd>
      </div>
    </dl>
  );
}
