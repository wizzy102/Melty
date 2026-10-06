import { Link, useNavigate } from 'react-router';
import { useI18n } from '../i18n/I18nProvider';
import { MAX_QUANTITY, useCart, type ResolvedLine } from '../store/cart';
import { useCheckout, useDeliveryAreas } from '../store/checkout';
import { useMenu } from '../store/menu';
import { Media } from '../components/ProductArt';
import { Icon } from '../components/Icon';
import { Button, ButtonLink } from '../components/ui/Button';
import { SelectField } from '../components/ui/Field';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { InlineAlert, Skeleton, StateMessage } from '../components/ui/States';
import { ProductArt } from '../components/ProductArt';

export function Cart() {
  const { t, tr, price } = useI18n();
  const cart = useCart();
  const menu = useMenu();
  const { draft, update } = useCheckout();
  const { areas } = useDeliveryAreas();
  const navigate = useNavigate();

  if (cart.lines.length === 0) {
    return (
      <section className="container section page-enter">
        <StateMessage
          art={
            <div className="state__art">
              <ProductArt art="fries" seed="empty-cart" />
            </div>
          }
          title={t('cart.empty.title')}
          body={t('cart.empty.body')}
          action={<ButtonLink to="/menu">{t('cart.empty.cta')}</ButtonLink>}
        />
      </section>
    );
  }

  const area = areas?.find((a) => a.id === draft.areaId) ?? null;
  const minFee = areas?.length ? Math.min(...areas.map((a) => a.fee)) : null;
  const total = cart.subtotal + (area?.fee ?? 0);

  return (
    <div className="container section page-enter">
      <div className="cart-head">
        <h1 className="section-title">{t('cart.title')}</h1>
        <Link to="/menu" className="cart-head__more">
          <Icon name="plus" size={18} />
          {t('cart.addMore')}
        </Link>
      </div>

      <div className="cart-layout">
        <ul className="cart-lines">
          {cart.lines.map((line) => (
            <CartLineItem key={line.key} line={line} loading={menu.status === 'loading'} />
          ))}
        </ul>

        <aside className="summary" aria-labelledby="summary-title">
          <h2 id="summary-title" className="summary__title">
            {t('cart.summary')}
          </h2>

          {areas ? (
            <SelectField
              label={t('cart.deliverTo')}
              value={draft.areaId}
              onChange={(e) => update({ areaId: e.target.value })}
              hint={area ? undefined : t('cart.feeHint')}
            >
              <option value="" disabled>
                {t('form.areaPlaceholder')}
              </option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {tr(a.name)} — {tr(a.city)} ({price(a.fee)})
                </option>
              ))}
            </SelectField>
          ) : (
            <Skeleton height={52} radius={14} />
          )}

          <dl className="summary__rows">
            <div className="summary__row">
              <dt>{t('cart.subtotal')}</dt>
              <dd>{price(cart.subtotal)}</dd>
            </div>
            <div className="summary__row">
              <dt>{t('cart.deliveryFee')}</dt>
              <dd>
                {area ? price(area.fee) : minFee !== null ? t('cart.feeFrom', { price: price(minFee) }) : '—'}
              </dd>
            </div>
            <div className="summary__row summary__row--total">
              <dt>{t('cart.total')}</dt>
              <dd className={area ? undefined : 'summary__pending'}>
                {area ? price(total) : t('cart.totalPlusDelivery', { price: price(cart.subtotal) })}
              </dd>
            </div>
          </dl>

          {cart.hasProblems && <InlineAlert>{t('cart.fixProblems')}</InlineAlert>}

          <Button
            size="lg"
            block
            disabled={cart.hasProblems}
            onClick={() => navigate('/checkout')}
            iconEnd={<Icon name="arrowRight" size={20} />}
          >
            {t('cart.checkout')}
          </Button>
        </aside>
      </div>
    </div>
  );
}

function CartLineItem({ line, loading }: { line: ResolvedLine; loading: boolean }) {
  const { t, tr, price } = useI18n();
  const cart = useCart();
  const { categoryById } = useMenu();
  const product = line.product;

  if (!product) {
    return (
      <li className="cart-line cart-line--problem">
        {loading ? (
          <Skeleton height={88} radius={16} />
        ) : (
          <div className="cart-line__problem-only">
            <InlineAlert>{t('cart.problem.missing')}</InlineAlert>
            <Button variant="danger" size="sm" icon={<Icon name="trash" size={16} />} onClick={() => cart.remove(line.key)}>
              {t('cart.remove')}
            </Button>
          </div>
        )}
      </li>
    );
  }

  const name = tr(product.name);
  const chosen = product.optionGroups.flatMap((g) =>
    (line.selections[g.id] ?? [])
      .map((id) => g.choices.find((c) => c.id === id))
      .filter((c) => c !== undefined)
      .map((c) => ({ id: c.id, label: tr(c.name), mod: c.priceModifier })),
  );

  return (
    <li className={`cart-line${line.problem ? ' cart-line--problem' : ''}`}>
      <Link to={`/product/${product.slug}?edit=${encodeURIComponent(line.key)}`} className="cart-line__media" tabIndex={-1} aria-hidden="true">
        <Media image={product.image} art={categoryById.get(product.categoryId)?.art ?? 'cake'} seed={product.slug} alt="" />
      </Link>

      <div className="cart-line__body">
        <div className="cart-line__top">
          <h3 className="cart-line__name">{name}</h3>
          <strong className="cart-line__total">{line.problem ? '—' : price(line.lineTotal)}</strong>
        </div>

        {chosen.length > 0 && (
          <ul className="cart-line__opts">
            {chosen.map((c) => (
              <li key={c.id}>
                {c.label}
                {c.mod > 0 && <span> +{price(c.mod)}</span>}
              </li>
            ))}
          </ul>
        )}
        <p className="cart-line__unit">{t('cart.unitPrice', { price: price(line.unitPrice) })}</p>

        {line.problem && <InlineAlert>{t(`cart.problem.${line.problem}`)}</InlineAlert>}

        <div className="cart-line__actions">
          {!line.problem && (
            <QuantityStepper
              size="sm"
              value={line.quantity}
              max={MAX_QUANTITY}
              onChange={(q) => cart.setQuantity(line.key, q)}
              label={t('product.quantity')}
            />
          )}
          <div className="cart-line__links">
            {!line.problem && (
              <Link className="text-btn" to={`/product/${product.slug}?edit=${encodeURIComponent(line.key)}`}>
                <Icon name="edit" size={16} />
                {t('cart.edit')}
              </Link>
            )}
            <button
              type="button"
              className="text-btn text-btn--danger"
              onClick={() => cart.remove(line.key)}
              aria-label={t('cart.removeNamed', { name })}
            >
              <Icon name="trash" size={16} />
              {t('cart.remove')}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
