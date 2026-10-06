import { Link, NavLink } from 'react-router';
import { useI18n } from '../i18n/I18nProvider';
import { useCart } from '../store/cart';
import { Icon } from './Icon';
import { Logo } from './Logo';

export function Header() {
  const { t, toggleLang } = useI18n();
  const { count } = useCart();

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" aria-label="Melty — home">
          <Logo height={42} />
        </Link>

        <nav className="header__nav" aria-label="Main">
          <NavLink to="/menu" className="header__link">
            {t('nav.menu')}
          </NavLink>
        </nav>

        <div className="header__actions">
          <button type="button" className="lang-toggle" onClick={toggleLang} aria-label={t('lang.switchLabel')}>
            <Icon name="globe" size={18} />
            <span>{t('lang.switch')}</span>
          </button>
          <Link to="/cart" className="icon-btn icon-btn--cart" aria-label={t('nav.openCart', { count })}>
            <Icon name="bag" size={22} />
            {count > 0 && <span className="badge-count">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
