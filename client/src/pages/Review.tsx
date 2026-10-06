import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { publicApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { Quote } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';
import { useCart } from '../store/cart';
import { useMenu } from '../store/menu';
import { invalidateDeliveryAreas, useCheckout } from '../store/checkout';
import { CART_ERROR_CODES, SERVER_FIELD, formatPhone, saveLastOrder, validateCheckout } from '../lib/checkout';
import { CheckoutSteps } from '../components/CheckoutSteps';
import { OrderItems, TotalsRows } from '../components/OrderSummary';
import { Icon } from '../components/Icon';
import { Button, ButtonLink } from '../components/ui/Button';
import { InlineAlert, Skeleton } from '../components/ui/States';
import type { CheckoutNotice } from './Checkout';

type Problem = { kind: 'cart' | 'retry'; code: string } | null;

export function Review() {
  const { t, tr, price, errorText, lang } = useI18n();
  const cart = useCart();
  const menu = useMenu();
  const { draft, reset } = useCheckout();
  const navigate = useNavigate();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [problem, setProblem] = useState<Problem>(null);
  const [pricesChanged, setPricesChanged] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);
  const busy = useRef(false);

  const payloadKey = JSON.stringify(cart.toPayload());
  const detailsOk = Object.keys(validateCheckout(draft, null)).length === 0;
  const canQuote = cart.lines.length > 0 && !cart.hasProblems && detailsOk && !placed;

  /** Shared handling for errors from both the quote and the order request. */
  const handleError = (e: unknown): string | null => {
    const err = e instanceof ApiError ? e : new ApiError(0, 'server_error');
    if (CART_ERROR_CODES.has(err.code)) {
      menu.reload(); // refresh availability so the cart can flag the item
      setProblem({ kind: 'cart', code: err.code });
      return null;
    }
    const field = Object.keys(err.fieldErrors).map((p) => SERVER_FIELD[p]).find(Boolean);
    if (err.code === 'area_not_found' || field === 'areaId') {
      invalidateDeliveryAreas();
      navigate('/checkout', { replace: true, state: { notice: 'area_gone' } satisfies CheckoutNotice });
      return null;
    }
    if (field) {
      navigate('/checkout', { replace: true, state: { notice: err.fieldErrors[Object.keys(err.fieldErrors)[0]] } satisfies CheckoutNotice });
      return null;
    }
    return err.code;
  };

  useEffect(() => {
    if (!canQuote) return;
    let alive = true;
    setQuote(null);
    setProblem(null);
    publicApi
      .quote(JSON.parse(payloadKey), draft.areaId)
      .then((q) => {
        if (!alive) return;
        setQuote(q);
        if (q.subtotal !== cart.subtotal) {
          setPricesChanged(true);
          menu.reload();
        }
      })
      .catch((e: unknown) => {
        if (!alive) return;
        const code = handleError(e);
        if (code) setProblem({ kind: 'retry', code });
      });
    return () => {
      alive = false;
    };
    // cart.subtotal / menu are read once per quote on purpose, not tracked
  }, [payloadKey, draft.areaId, attempt, canQuote]);

  if (placed) return null;
  if (cart.lines.length === 0 || cart.hasProblems) return <Navigate to="/cart" replace />;
  if (!detailsOk) return <Navigate to="/checkout" replace />;

  const placeOrder = async () => {
    if (busy.current || !quote) return;
    busy.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const order = await publicApi.createOrder({
        items: cart.toPayload(),
        customer: { name: draft.name, phone: draft.phone },
        delivery: { areaId: draft.areaId, address: draft.address, instructions: draft.instructions },
        locale: lang,
      });
      saveLastOrder(order);
      setPlaced(true);
      cart.clear();
      reset();
      navigate('/order/confirmed', { replace: true });
    } catch (e) {
      const code = handleError(e);
      if (code) setSubmitError(code === 'network_error' ? t('review.submitNetwork') : errorText(code));
      busy.current = false;
      setSubmitting(false);
    }
  };

  const phone = formatPhone(draft.phone);

  return (
    <div className="container section page-enter">
      <div className="checkout-head">
        <div>
          <h1 className="section-title">{t('review.title')}</h1>
          <p className="section-sub">{t('review.sub')}</p>
        </div>
        <CheckoutSteps current={2} />
      </div>

      <div className="cart-layout">
        <div className="checkout-form">
          {problem?.kind === 'cart' && (
            <InlineAlert>
              <p>{errorText(problem.code)}</p>
              <p>{t('review.cartChanged')}</p>
              <ButtonLink to="/cart" size="sm" variant="secondary" className="alert__action">
                {t('review.backToCart')}
              </ButtonLink>
            </InlineAlert>
          )}
          {pricesChanged && <InlineAlert tone="info">{t('review.pricesChanged')}</InlineAlert>}

          <section className="panel" aria-labelledby="details-title">
            <header className="panel__head">
              <Icon name="pin" size={20} className="panel__icon" />
              <h2 id="details-title" className="panel__title">
                {t('review.details')}
              </h2>
              <Link to="/checkout" className="text-btn panel__edit">
                <Icon name="edit" size={16} />
                {t('review.edit')}
              </Link>
            </header>
            <dl className="details-list">
              <div>
                <dt>{t('form.name')}</dt>
                <dd>
                  <bdi>{draft.name}</bdi>
                </dd>
              </div>
              <div>
                <dt>{t('form.phone')}</dt>
                <dd>
                  <bdi dir="ltr">{phone}</bdi>
                </dd>
              </div>
              <div>
                <dt>{t('form.city')}</dt>
                <dd>{quote?.area ? tr(quote.area.city) : <Skeleton width={90} />}</dd>
              </div>
              <div>
                <dt>{t('form.area')}</dt>
                <dd>{quote?.area ? tr(quote.area.name) : <Skeleton width={110} />}</dd>
              </div>
              <div className="details-list__wide">
                <dt>{t('form.address')}</dt>
                <dd>
                  <bdi>{draft.address}</bdi>
                </dd>
              </div>
              <div className="details-list__wide">
                <dt>{t('form.instructions')}</dt>
                <dd className={draft.instructions ? undefined : 'details-list__none'}>
                  {draft.instructions ? <bdi>{draft.instructions}</bdi> : t('review.noInstructions')}
                </dd>
              </div>
            </dl>
          </section>

          <section className="panel" aria-labelledby="items-title">
            <header className="panel__head">
              <Icon name="bag" size={20} className="panel__icon" />
              <h2 id="items-title" className="panel__title">
                {t('review.items')}
              </h2>
              <Link to="/cart" className="text-btn panel__edit">
                <Icon name="edit" size={16} />
                {t('review.edit')}
              </Link>
            </header>
            {quote ? (
              <OrderItems items={quote.items} />
            ) : (
              <div className="stack">
                {cart.lines.map((l) => (
                  <Skeleton key={l.key} height={58} radius={12} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="summary" aria-labelledby="summary-title" aria-busy={!quote || undefined}>
          <h2 id="summary-title" className="summary__title">
            {t('cart.summary')}
          </h2>

          {problem?.kind === 'retry' ? (
            <InlineAlert>
              <p>{t('review.quoteError')} {problem.code === 'network_error' ? errorText(problem.code) : ''}</p>
              <Button size="sm" variant="secondary" className="alert__action" onClick={() => setAttempt((n) => n + 1)}>
                {t('common.retry')}
              </Button>
            </InlineAlert>
          ) : quote && quote.deliveryFee !== null ? (
            <TotalsRows subtotal={quote.subtotal} deliveryFee={quote.deliveryFee} total={quote.total} />
          ) : (
            <div className="stack">
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={34} />
            </div>
          )}

          <p className="contact-note">
            <Icon name="phone" size={16} />
            {/* U+2066/U+2069 isolate the LTR number inside Arabic text */}
            <span>{t('review.contactNote', { phone: `⁦${phone}⁩` })}</span>
          </p>

          {submitError && <InlineAlert>{submitError}</InlineAlert>}

          <Button
            size="lg"
            block
            className="place-btn"
            loading={submitting}
            disabled={!quote || problem !== null}
            onClick={placeOrder}
            icon={<Icon name="check" size={20} />}
          >
            {submitting ? t('review.placing') : t('review.place')}
            {quote && <span className="action-bar__price">{price(quote.total)}</span>}
          </Button>
        </aside>
      </div>
    </div>
  );
}
