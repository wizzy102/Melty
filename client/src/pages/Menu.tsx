import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useI18n } from '../i18n/I18nProvider';
import { useMenu } from '../store/menu';
import { ProductCard } from '../components/ProductCard';
import { Icon } from '../components/Icon';
import { Button } from '../components/ui/Button';
import { Skeleton, StateMessage } from '../components/ui/States';
import type { Product } from '../api/types';
import { normalizeSearch as normalize } from '../lib/search';

export function Menu() {
  const { t, tr } = useI18n();
  const menu = useMenu();
  const { hash } = useLocation();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string>('');
  const chipsRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(
    () =>
      menu.categories
        .map((c) => ({ category: c, products: menu.products.filter((p) => p.categoryId === c.id) }))
        .filter((s) => s.products.length > 0),
    [menu.categories, menu.products],
  );

  const results = useMemo<Product[] | null>(() => {
    const q = normalize(query);
    if (!q) return null;
    return menu.products.filter((p) =>
      [p.name.en, p.name.ar, p.description.en, p.description.ar].some((s) => normalize(s).includes(q)),
    );
  }, [query, menu.products]);

  // Arriving via /menu#crepes → jump to that section once the menu is ready.
  useEffect(() => {
    if (menu.status !== 'ready' || !hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  }, [menu.status, hash]);

  // Scroll-spy: highlight the category currently on screen.
  useEffect(() => {
    if (results || sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-140px 0px -55% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.category.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections, results]);

  // Keep the active chip visible in the horizontal chip bar.
  useEffect(() => {
    const chip = chipsRef.current?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    const bar = chipsRef.current;
    if (!chip || !bar) return;
    const chipRect = chip.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();
    if (chipRect.left < barRect.left || chipRect.right > barRect.right) {
      bar.scrollBy({ left: chipRect.left - barRect.left - barRect.width / 2 + chipRect.width / 2, behavior: 'smooth' });
    }
  }, [active]);

  const jumpTo = (slug: string) => {
    setActive(slug);
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${slug}`);
  };

  return (
    <div className="page-enter">
      <section className="container menu-head">
        <h1 className="section-title">{t('menu.title')}</h1>
        <p className="section-sub">{t('menu.sub')}</p>
        <div className="search">
          <Icon name="search" size={20} className="search__icon" />
          <input
            className="input search__input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('menu.search')}
            aria-label={t('menu.search')}
            enterKeyHint="search"
          />
          {query && (
            <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label={t('menu.searchClear')}>
              <Icon name="close" size={18} />
            </button>
          )}
        </div>
      </section>

      {menu.status === 'error' && (
        <section className="container section">
          <StateMessage
            tone="error"
            icon="alert"
            title={t('state.error.title')}
            body={t('state.error.body')}
            action={<Button onClick={menu.reload}>{t('common.retry')}</Button>}
          />
        </section>
      )}

      {menu.status === 'loading' && (
        <section className="container section">
          <div className="row" style={{ marginBottom: 24 }}>
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} width={96} height={40} radius={999} />
            ))}
          </div>
          <div className="menu-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} height={130} radius={20} />
            ))}
          </div>
        </section>
      )}

      {menu.status === 'ready' && results && (
        <section className="container section">
          {results.length > 0 ? (
            <>
              <p className="muted menu-results">{t('menu.results', { count: results.length, query })}</p>
              <div className="menu-grid">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} layout="row" />
                ))}
              </div>
            </>
          ) : (
            <StateMessage
              icon="search"
              title={t('menu.noResults.title', { query })}
              body={t('menu.noResults.body')}
              action={
                <Button variant="secondary" onClick={() => setQuery('')}>
                  {t('menu.searchClear')}
                </Button>
              }
            />
          )}
        </section>
      )}

      {menu.status === 'ready' && !results && (
        <>
          <nav className="chips-bar" aria-label={t('menu.categories')}>
            <div className="container">
              <div className="chips" ref={chipsRef}>
                {sections.map(({ category }) => (
                  <a
                    key={category.id}
                    href={`#${category.slug}`}
                    data-slug={category.slug}
                    className={`chip${active === category.slug ? ' chip--active' : ''}`}
                    aria-current={active === category.slug ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      jumpTo(category.slug);
                    }}
                  >
                    {tr(category.name)}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          <div className="container">
            {sections.map(({ category, products }) => (
              <section key={category.id} id={category.slug} className="menu-section" aria-labelledby={`h-${category.slug}`}>
                <div className="menu-section__head">
                  <h2 id={`h-${category.slug}`}>{tr(category.name)}</h2>
                  {tr(category.description) && <p className="muted">{tr(category.description)}</p>}
                </div>
                <div className="menu-grid">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} layout="row" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
