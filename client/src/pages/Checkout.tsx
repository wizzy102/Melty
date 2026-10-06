import { useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useI18n } from '../i18n/I18nProvider';
import { useCart } from '../store/cart';
import { useCheckout, useDeliveryAreas } from '../store/checkout';
import { LIMITS, normalizeEgyptianPhone, validateCheckout, type CheckoutField } from '../lib/checkout';
import { CheckoutSteps } from '../components/CheckoutSteps';
import { Icon } from '../components/Icon';
import { Button } from '../components/ui/Button';
import { SelectField, TextAreaField, TextField } from '../components/ui/Field';
import { InlineAlert, Skeleton } from '../components/ui/States';

/** Optional message handed back from the review step (e.g. an area was deactivated). */
export interface CheckoutNotice {
  notice?: string;
}

export function Checkout() {
  const { t, tr, price, errorText } = useI18n();
  const cart = useCart();
  const { draft, update } = useCheckout();
  const { areas, error: areasError, retry } = useDeliveryAreas();
  const navigate = useNavigate();
  const notice = (useLocation().state as CheckoutNotice | null)?.notice;

  const [submitted, setSubmitted] = useState(Boolean(notice));
  const [touched, setTouched] = useState<Partial<Record<CheckoutField, boolean>>>({});
  const [pickedCity, setPickedCity] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  if (cart.lines.length === 0 || cart.hasProblems) return <Navigate to="/cart" replace />;

  const cities = [...new Map((areas ?? []).map((a) => [a.city.en, a.city])).values()];
  const area = areas?.find((a) => a.id === draft.areaId) ?? null;
  const city = area?.city.en ?? (pickedCity || (cities.length === 1 ? cities[0].en : ''));
  const cityAreas = (areas ?? []).filter((a) => a.city.en === city);

  const errors = validateCheckout(draft, areas ? areas.map((a) => a.id) : null);
  const show = (f: CheckoutField) => (submitted || touched[f]) && errors[f] ? errorText(errors[f]) : undefined;
  const blur = (f: CheckoutField) => () => setTouched((s) => ({ ...s, [f]: true }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    update({
      name: draft.name.trim(),
      phone: normalizeEgyptianPhone(draft.phone) ?? draft.phone,
      address: draft.address.trim(),
      instructions: draft.instructions.trim(),
    });
    navigate('/checkout/review');
  };

  const hasErrors = submitted && Object.keys(errors).length > 0;

  return (
    <div className="container section page-enter">
      <div className="checkout-head">
        <h1 className="section-title">{t('checkout.title')}</h1>
        <CheckoutSteps current={1} />
      </div>

      <div className="cart-layout">
        <form id="checkout-form" ref={formRef} className="checkout-form" noValidate onSubmit={submit}>
          {notice && <InlineAlert>{notice === 'area_gone' ? t('checkout.areaGone') : errorText(notice)}</InlineAlert>}

          <section className="panel" aria-labelledby="contact-title">
            <header className="panel__head">
              <Icon name="phone" size={20} className="panel__icon" />
              <div>
                <h2 id="contact-title" className="panel__title">{t('checkout.contact.title')}</h2>
                <p className="panel__sub">{t('checkout.contact.sub')}</p>
              </div>
            </header>
            <div className="form-row">
              <TextField
                label={t('form.name')}
                name="name"
                autoComplete="name"
                dir="auto"
                maxLength={LIMITS.name}
                value={draft.name}
                onChange={(e) => update({ name: e.target.value })}
                onBlur={blur('name')}
                error={show('name')}
              />
              <TextField
                label={t('form.phone')}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                maxLength={20}
                placeholder="010 1234 5678"
                value={draft.phone}
                onChange={(e) => update({ phone: e.target.value })}
                onBlur={blur('phone')}
                hint={t('form.phoneHint')}
                error={show('phone')}
              />
            </div>
          </section>

          <section className="panel" aria-labelledby="delivery-title">
            <header className="panel__head">
              <Icon name="pin" size={20} className="panel__icon" />
              <div>
                <h2 id="delivery-title" className="panel__title">{t('checkout.delivery.title')}</h2>
                <p className="panel__sub">{t('checkout.delivery.sub')}</p>
              </div>
            </header>

            {areasError ? (
              <InlineAlert>
                {t('checkout.areasError')}{' '}
                <button type="button" className="text-btn" onClick={retry}>
                  {t('common.retry')}
                </button>
              </InlineAlert>
            ) : !areas ? (
              <div className="form-row">
                <Skeleton height={76} radius={14} />
                <Skeleton height={76} radius={14} />
              </div>
            ) : (
              <div className="form-row">
                <SelectField
                  label={t('form.city')}
                  name="city"
                  value={city}
                  onChange={(e) => {
                    setPickedCity(e.target.value);
                    if (area && area.city.en !== e.target.value) update({ areaId: '' });
                  }}
                >
                  <option value="" disabled>
                    {t('form.cityPlaceholder')}
                  </option>
                  {cities.map((c) => (
                    <option key={c.en} value={c.en}>
                      {tr(c)}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  label={t('form.area')}
                  name="area"
                  value={area ? area.id : ''}
                  disabled={!city}
                  onChange={(e) => update({ areaId: e.target.value })}
                  onBlur={blur('areaId')}
                  error={show('areaId')}
                >
                  <option value="" disabled>
                    {city ? t('form.areaPlaceholder') : t('form.areaFirst')}
                  </option>
                  {cityAreas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {tr(a.name)} — {price(a.fee)}
                    </option>
                  ))}
                </SelectField>
              </div>
            )}

            <TextAreaField
              label={t('form.address')}
              name="address"
              autoComplete="street-address"
              dir="auto"
              rows={2}
              maxLength={LIMITS.address}
              placeholder={t('form.addressPlaceholder')}
              value={draft.address}
              onChange={(e) => update({ address: e.target.value })}
              onBlur={blur('address')}
              error={show('address')}
            />
            <TextAreaField
              label={t('form.instructions')}
              optionalLabel={t('common.optional')}
              name="instructions"
              dir="auto"
              rows={2}
              maxLength={LIMITS.instructions}
              placeholder={t('form.instructionsPlaceholder')}
              value={draft.instructions}
              onChange={(e) => update({ instructions: e.target.value })}
              onBlur={blur('instructions')}
              error={show('instructions')}
            />
          </section>
        </form>

        <aside className="summary" aria-labelledby="summary-title">
          <div className="summary__head">
            <h2 id="summary-title" className="summary__title">
              {t('cart.summary')}
            </h2>
            <Link to="/cart" className="text-btn">
              <Icon name="edit" size={16} />
              {t('checkout.editCart')}
            </Link>
          </div>

          <ul className="mini-items">
            {cart.lines.map((l) => (
              <li key={l.key}>
                <span className="mini-items__qty">{l.quantity}×</span>
                <span className="mini-items__name">{l.product ? tr(l.product.name) : <Skeleton width={120} />}</span>
                <span className="mini-items__total">{price(l.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <dl className="summary__rows">
            <div className="summary__row">
              <dt>{t('cart.subtotal')}</dt>
              <dd>{price(cart.subtotal)}</dd>
            </div>
            <div className="summary__row">
              <dt>{t('cart.deliveryFee')}</dt>
              <dd>{area ? price(area.fee) : '—'}</dd>
            </div>
            <div className="summary__row summary__row--total">
              <dt>{t('cart.total')}</dt>
              <dd className={area ? undefined : 'summary__pending'}>
                {area ? price(cart.subtotal + area.fee) : t('cart.totalPlusDelivery', { price: price(cart.subtotal) })}
              </dd>
            </div>
          </dl>

          {hasErrors && <InlineAlert>{t('checkout.fixErrors')}</InlineAlert>}

          <Button type="submit" form="checkout-form" size="lg" block iconEnd={<Icon name="arrowRight" size={20} />}>
            {t('checkout.continue')}
          </Button>
        </aside>
      </div>
    </div>
  );
}
