import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useI18n } from '../i18n/I18nProvider';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { useAdminAuth } from './AdminAuth';
import { OrdersFeedProvider, useOrdersFeed } from './OrdersFeed';

/** Shell for logged-in admin pages. Separate from the customer layout on purpose. */
export function AdminLayout() {
  return (
    <OrdersFeedProvider>
      <div className="admin">
        <AdminHeader />
        <main className="admin__main">
          <Outlet />
        </main>
      </div>
    </OrdersFeedProvider>
  );
}

function AdminHeader() {
  const { t, toggleLang } = useI18n();
  const { logout } = useAdminAuth();
  const { counts } = useOrdersFeed();
  const { pathname } = useLocation();
  const newCount = counts?.new ?? 0;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <header className="header admin-header">
      <div className="container header__inner">
        <Link to="/admin" className="header__logo admin-header__brand" aria-label={t('admin.title')}>
          <Logo height={36} />
          <span className="admin-header__tag">{t('admin.badge')}</span>
        </Link>

        <nav className="admin-nav" aria-label={t('admin.nav.main')}>
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav__link${isActive || pathname.startsWith('/admin/orders') ? ' is-active' : ''}`}>
            <Icon name="list" size={18} />
            <span>{t('admin.nav.orders')}</span>
            {newCount > 0 && <span className="admin-nav__count">{newCount}</span>}
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin-nav__link${isActive ? ' is-active' : ''}`}>
            <Icon name="box" size={18} />
            <span>{t('admin.nav.products')}</span>
          </NavLink>
        </nav>

        <div className="header__actions">
          <a href="/" target="_blank" rel="noopener" className="icon-btn admin-hide-sm" aria-label={t('admin.viewStore')} title={t('admin.viewStore')}>
            <Icon name="external" size={18} />
          </a>
          <button type="button" className="lang-toggle" onClick={toggleLang} aria-label={t('lang.switchLabel')}>
            <Icon name="globe" size={18} />
            <span>{t('lang.switch')}</span>
          </button>
          <button type="button" className="icon-btn" onClick={logout} aria-label={t('admin.logout')} title={t('admin.logout')}>
            <Icon name="logout" size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}
