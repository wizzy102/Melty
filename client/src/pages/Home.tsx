import { useI18n } from '../i18n/I18nProvider';
import { useMenu } from '../store/menu';
import { ButtonLink, Button } from '../components/ui/Button';
import { Skeleton, StateMessage } from '../components/ui/States';
import { CategoryTile } from '../components/CategoryTile';
import { ProductCard } from '../components/ProductCard';
import { ProductArt } from '../components/ProductArt';
import { Logo } from '../components/Logo';
import { Icon, type IconName } from '../components/Icon';

export function Home() {
  const { t } = useI18n();
  const menu = useMenu();
  const featured = menu.products.filter((p) => p.featured);
  const countByCategory = new Map<string, number>();
  for (const p of menu.products) countByCategory.set(p.categoryId, (countByCategory.get(p.categoryId) ?? 0) + 1);

  return (
    <div className="page-enter">
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="fry-crown" aria-hidden="true" />
        <div className="wood-band" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <Logo height={86} glow className="hero__logo" />
            <p className="eyebrow">{t('home.hero.eyebrow')}</p>
            <h1 className="hero__title">{t('brand.tagline')}</h1>
            <p className="hero__sub">{t('brand.taglineSub')}</p>
            <div className="hero__ctas">
              <ButtonLink to="/menu" size="lg" iconEnd={<Icon name="arrowRight" size={20} />}>
                {t('home.hero.cta')}
              </ButtonLink>
              <ButtonLink to="/#how" variant="ghost" size="lg">
                {t('home.hero.secondary')}
              </ButtonLink>
            </div>
            <p className="hero__badge">
              <Icon name="scooter" size={18} />
              {t('home.hero.badge')}
            </p>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero__art hero__art--a">
              <ProductArt art="pancake" seed="hero-a" />
            </div>
            <div className="hero__art hero__art--b">
              <ProductArt art="fries" seed="hero-b" />
            </div>
            <div className="hero__art hero__art--c">
              <ProductArt art="drink" seed="hero-c" />
            </div>
          </div>
        </div>
      </section>

      {menu.status === 'error' ? (
        <section className="container section">
          <StateMessage
            tone="error"
            icon="alert"
            title={t('state.error.title')}
            body={t('state.error.body')}
            action={<Button onClick={menu.reload}>{t('common.retry')}</Button>}
          />
        </section>
      ) : (
        <>
          {/* ---------- Categories ---------- */}
          <section className="container section">
            <div className="section-head">
              <div>
                <h2 className="section-title">{t('home.categories.title')}</h2>
                <p className="section-sub">{t('home.categories.sub')}</p>
              </div>
            </div>
            <div className="h-scroll category-row">
              {menu.status === 'loading'
                ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} width={148} height={168} radius={20} />)
                : menu.categories.map((c) => (
                    <CategoryTile key={c.id} category={c} count={countByCategory.get(c.id) ?? 0} />
                  ))}
            </div>
          </section>

          {/* ---------- Featured ---------- */}
          <section className="container section">
            <div className="section-head">
              <div>
                <h2 className="section-title">{t('home.featured.title')}</h2>
                <p className="section-sub">{t('home.featured.sub')}</p>
              </div>
              <ButtonLink to="/menu" variant="ghost" size="sm" iconEnd={<Icon name="arrowRight" size={16} />}>
                {t('common.seeAll')}
              </ButtonLink>
            </div>
            <div className="product-grid">
              {menu.status === 'loading'
                ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} height={300} radius={20} />)
                : featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        </>
      )}

      {/* ---------- How it works ---------- */}
      <section className="container section" id="how">
        <h2 className="section-title">{t('home.how.title')}</h2>
        <ol className="steps">
          {(
            [
              ['1', 'sparkle'],
              ['2', 'edit'],
              ['3', 'scooter'],
            ] as const satisfies readonly (readonly [string, IconName])[]
          ).map(([n, icon]) => (
            <li key={n} className="step">
              <span className="step__icon">
                <Icon name={icon} size={24} />
              </span>
              <span className="step__num">{n}</span>
              <h3 className="step__title">{t(`home.how.${n}.title` as 'home.how.1.title')}</h3>
              <p className="muted">{t(`home.how.${n}.body` as 'home.how.1.body')}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="container section">
        <div className="cta-band">
          <div>
            <h2>{t('home.cta.title')}</h2>
            <p>{t('home.cta.body')}</p>
          </div>
          <ButtonLink to="/menu" size="lg" iconEnd={<Icon name="arrowRight" size={20} />}>
            {t('home.hero.cta')}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
