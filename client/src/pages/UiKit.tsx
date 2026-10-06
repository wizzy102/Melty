import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useMenu } from '../store/menu';
import { useCart } from '../store/cart';
import { defaultSelections } from '../lib/pricing';
import { Logo } from '../components/Logo';
import { Icon } from '../components/Icon';
import { ProductArt } from '../components/ProductArt';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import { SelectField, TextAreaField, TextField } from '../components/ui/Field';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { Sheet } from '../components/ui/Sheet';
import { InlineAlert, Skeleton, Spinner, StateMessage } from '../components/ui/States';

/**
 * Internal component showcase for reviewing the design system (not linked
 * from the customer site). Reachable at /ui during the prototype.
 */
export function UiKit() {
  const { t, price, lang } = useI18n();
  const menu = useMenu();
  const cart = useCart();
  const [qty, setQty] = useState(2);
  const [sheetOpen, setSheetOpen] = useState(false);

  const sampleCards = [
    menu.productBySlug.get('melty-loaded-fries'),
    menu.productBySlug.get('lotus-pancake'),
    menu.productBySlug.get('banana-crepe'), // sold out
  ].filter((p) => p !== undefined);

  const addSample = () => {
    const p = menu.productBySlug.get('lotus-pancake');
    if (p) cart.add(p.id, defaultSelections(p), 1);
  };

  return (
    <div className="container section uikit page-enter">
      <p className="eyebrow">Prototype · design system</p>
      <h1 className="section-title">Melty UI kit</h1>
      <p className="section-sub">
        Every building block of the customer app. Switch language in the header to check Arabic / RTL.
      </p>

      <h2 className="uikit__h">Logo</h2>
      <div className="uikit__panel row" style={{ ['--row-gap' as string]: '28px' }}>
        <Logo height={96} glow />
        <Logo height={56} />
        <Logo height={34} />
      </div>

      <h2 className="uikit__h">Colors</h2>
      <div className="swatches">
        {[
          ['Night navy', '--bg'],
          ['Surface', '--surface'],
          ['Logo navy', '--logo-navy'],
          ['Fry yellow', '--yellow'],
          ['Melty cyan', '--cyan'],
          ['Warm amber', '--amber'],
          ['Cream text', '--text'],
          ['Muted text', '--text-muted'],
        ].map(([name, v]) => (
          <div key={v} className="swatch">
            <span className="swatch__chip" style={{ background: `var(${v})` }} />
            <strong>{name}</strong>
            <code>{v}</code>
          </div>
        ))}
      </div>

      <h2 className="uikit__h">Typography</h2>
      <div className="uikit__panel stack">
        <h1 style={{ fontSize: '2.6rem' }}>{t('brand.tagline')}</h1>
        <h2 style={{ fontSize: '1.8rem' }}>{t('home.featured.title')}</h2>
        <h3 style={{ fontSize: '1.25rem' }}>{t('home.how.2.title')}</h3>
        <p>{t('home.how.2.body')}</p>
        <p className="muted">{t('home.how.3.body')}</p>
        <p>
          Prices: <strong>{price(180)}</strong> · <strong>{price(1250)}</strong> · {t('price.from', { price: price(95) })}
        </p>
      </div>

      <h2 className="uikit__h">Buttons</h2>
      <div className="uikit__panel row">
        <Button>{t('home.hero.cta')}</Button>
        <Button variant="secondary">{t('cartbar.view')}</Button>
        <Button variant="ghost">{t('common.seeAll')}</Button>
        <Button variant="danger" icon={<Icon name="trash" size={18} />}>
          Remove
        </Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm">Small</Button>
        <Button size="lg" iconEnd={<Icon name="arrowRight" />}>
          Large
        </Button>
      </div>

      <h2 className="uikit__h">Form fields</h2>
      <div className="uikit__panel uikit__form">
        <TextField label={t('form.name')} placeholder="Mariam Adel" autoComplete="name" />
        <TextField label={t('form.phone')} hint={t('form.phoneHint')} inputMode="tel" placeholder="010 1234 5678" />
        <TextField label={t('form.phone')} defaultValue="12345" error={t('error.phone_invalid')} />
        <SelectField label={t('form.area')} defaultValue="">
          <option value="" disabled>
            {t('form.areaPlaceholder')}
          </option>
          <option>{lang === 'ar' ? 'مدينة نصر' : 'Nasr City'}</option>
          <option>{lang === 'ar' ? 'مصر الجديدة' : 'Heliopolis'}</option>
        </SelectField>
        <TextAreaField label={t('form.instructions')} optionalLabel={t('common.optional')} />
      </div>

      <h2 className="uikit__h">Quantity, sheet & alerts</h2>
      <div className="uikit__panel stack">
        <div className="row" style={{ ['--row-gap' as string]: '20px' }}>
          <QuantityStepper value={qty} onChange={setQty} />
          <QuantityStepper value={qty} onChange={setQty} size="sm" />
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>
            Open sheet / dialog
          </Button>
          <Button variant="secondary" onClick={addSample} icon={<Icon name="plus" size={18} />}>
            Add sample item → shows the cart bar
          </Button>
          {cart.count > 0 && (
            <Button variant="ghost" onClick={cart.clear}>
              Clear cart ({cart.count})
            </Button>
          )}
        </div>
        <InlineAlert>{t('error.phone_invalid')}</InlineAlert>
        <InlineAlert tone="success">Order #1006 received.</InlineAlert>
      </div>

      <h2 className="uikit__h">Placeholder product art</h2>
      <div className="art-grid">
        {['pancake', 'waffle', 'crepe', 'fries', 'chicken', 'icecream', 'cake', 'drink'].map((a) => (
          <figure key={a} className="art-grid__item">
            <ProductArt art={a} seed={a} />
            <figcaption>{a}</figcaption>
          </figure>
        ))}
      </div>

      <h2 className="uikit__h">Product cards</h2>
      <div className="product-grid">
        {sampleCards.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <h2 className="uikit__h">States</h2>
      <div className="uikit__states">
        <div className="uikit__panel stack">
          <strong>Loading</strong>
          <Spinner label={t('common.loading')} />
          <Skeleton height={120} radius={16} />
          <Skeleton width="70%" />
          <Skeleton width="40%" />
        </div>
        <div className="uikit__panel">
          <StateMessage icon="bag" title="Your cart is empty" body="Add something sweet to get started." />
        </div>
        <div className="uikit__panel">
          <StateMessage
            tone="error"
            icon="alert"
            title={t('state.error.title')}
            body={t('state.error.body')}
            action={<Button size="sm">{t('common.retry')}</Button>}
          />
        </div>
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={t('home.how.2.title')}
        footer={
          <Button block onClick={() => setSheetOpen(false)}>
            {t('common.close')}
          </Button>
        }
      >
        <p className="muted">{t('home.how.2.body')}</p>
      </Sheet>
    </div>
  );
}
