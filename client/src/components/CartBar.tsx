import { Link, useLocation } from 'react-router';
import { useI18n } from '../i18n/I18nProvider';
import { useCart } from '../store/cart';
import { Icon } from './Icon';

/** Screens where the cart is the focus or that have their own bottom action bar. */
const HIDDEN_ON = ['/cart', '/checkout', '/order', '/product'];

/** Persistent "View cart" bar, always one tap from checkout. */
export function CartBar() {
  const { t, price } = useI18n();
  const { count, subtotal } = useCart();
  const { pathname } = useLocation();

  if (count === 0 || HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="cartbar">
      <Link to="/cart" className="cartbar__inner">
        <span className="cartbar__count">{count}</span>
        <span className="cartbar__label">
          {t('cartbar.view')}
          <small>{count === 1 ? t('cartbar.item') : t('cartbar.items', { count })}</small>
        </span>
        <span className="cartbar__total">{price(subtotal)}</span>
        <Icon name="arrowRight" size={20} />
      </Link>
    </div>
  );
}
