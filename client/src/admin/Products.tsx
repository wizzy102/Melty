import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { Menu, Product } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';
import { normalizeSearch } from '../lib/search';
import { Icon } from '../components/Icon';
import { Media } from '../components/ProductArt';
import { Button } from '../components/ui/Button';
import { InlineAlert, Skeleton, StateMessage } from '../components/ui/States';
import { useToast } from '../components/ui/Toast';
import { useAdminAuth } from './AdminAuth';

export function Products() {
  const { t, tr, price, errorText } = useI18n();
  const { handleError } = useAdminAuth();
  const toast = useToast();

  const [menu, setMenu] = useState<Menu | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoadError(false);
    adminApi
      .products()
      .then(setMenu)
      .catch((e: unknown) => !handleError(e) && setLoadError(true));
  }, [handleError]);

  useEffect(load, [load]);

  const patchProduct = (p: Product) =>
    setMenu((m) => (m ? { ...m, products: m.products.map((x) => (x.id === p.id ? p : x)) } : m));

  const toggle = async (p: Product) => {
    if (pending.has(p.id)) return;
    const available = !p.available;
    patchProduct({ ...p, available }); // optimistic
    setPending((s) => new Set(s).add(p.id));
    setSaveError(null);
    try {
      patchProduct(await adminApi.setAvailability(p.id, available));
      toast(t(available ? 'admin.products.markedAvailable' : 'admin.products.markedSoldOut', { name: tr(p.name) }));
    } catch (e) {
      patchProduct(p); // roll back
      if (!handleError(e)) setSaveError(errorText(e instanceof ApiError ? e.code : 'server_error'));
    } finally {
      setPending((s) => {
        const next = new Set(s);
        next.delete(p.id);
        return next;
      });
    }
  };

  if (loadError) {
    return (
      <div className="container admin-page">
        <StateMessage
          tone="error"
          icon="alert"
          title={t('state.error.title')}
          body={t('state.error.body')}
          action={<Button onClick={load}>{t('common.retry')}</Button>}
        />
      </div>
    );
  }

  const q = normalizeSearch(query);
  const matches = (p: Product) => !q || normalizeSearch(`${p.name.en} ${p.name.ar}`).includes(q);
  const soldOut = menu?.products.filter((p) => !p.available).length ?? 0;

  return (
    <div className="container admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="section-title">{t('admin.products.title')}</h1>
          <p className="panel__sub">{t('admin.products.sub')}</p>
        </div>
        {menu && soldOut > 0 && <span className="status status--rejected">{t('admin.products.soldOutCount', { count: soldOut })}</span>}
      </div>

      <div className="search admin-search">
        <Icon name="search" size={19} className="search__icon" />
        <input
          className="input search__input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('admin.products.search')}
          aria-label={t('admin.products.search')}
        />
      </div>

      {saveError && <InlineAlert>{saveError}</InlineAlert>}

      {!menu ? (
        <div className="order-list">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={68} radius={16} />
          ))}
        </div>
      ) : (
        menu.categories.map((c) => {
          const products = menu.products.filter((p) => p.categoryId === c.id && matches(p));
          if (!products.length) return null;
          return (
            <section key={c.id} className="admin-cat" aria-labelledby={`cat-${c.id}`}>
              <h2 id={`cat-${c.id}`} className="admin-cat__title">
                {tr(c.name)}
              </h2>
              <ul className="admin-products">
                {products.map((p) => (
                  <li key={p.id} className={`admin-product${p.available ? '' : ' is-off'}`}>
                    <span className="admin-product__media">
                      <Media image={p.image} art={c.art} seed={p.slug} alt="" />
                    </span>
                    <span className="admin-product__info">
                      <span className="admin-product__name">{tr(p.name)}</span>
                      <span className="admin-product__price">{price(p.price)}</span>
                    </span>
                    <label className="switch">
                      <span className={`switch__label${p.available ? '' : ' is-off'}`}>
                        {p.available ? t('admin.products.available') : t('admin.products.soldOut')}
                      </span>
                      <input
                        type="checkbox"
                        role="switch"
                        className="switch__input"
                        checked={p.available}
                        disabled={pending.has(p.id)}
                        onChange={() => toggle(p)}
                        aria-label={t('admin.products.toggle', { name: tr(p.name) })}
                      />
                      <span className="switch__track" aria-hidden="true" />
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      <p className="admin-note">
        <Icon name="sparkle" size={16} />
        {t('admin.products.note')}
      </p>
    </div>
  );
}
