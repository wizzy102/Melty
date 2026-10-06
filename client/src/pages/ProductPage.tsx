import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import type { OptionGroup, Product } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';
import { useMenu } from '../store/menu';
import { MAX_QUANTITY, useCart, type ResolvedLine } from '../store/cart';
import { defaultSelections, unitPrice, validateSelections, type Selections } from '../lib/pricing';
import { Media } from '../components/ProductArt';
import { Icon } from '../components/Icon';
import { Button, ButtonLink } from '../components/ui/Button';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { Skeleton, StateMessage, InlineAlert } from '../components/ui/States';
import { useToast } from '../components/ui/Toast';

export function ProductPage() {
  const { slug = '' } = useParams();
  const [params] = useSearchParams();
  const { t } = useI18n();
  const menu = useMenu();
  const cart = useCart();

  const product = menu.productBySlug.get(slug);
  const editKey = params.get('edit');
  const editLine = editKey ? cart.lines.find((l) => l.key === editKey && l.productId === product?.id) : undefined;

  if (menu.status === 'loading') {
    return (
      <div className="container section product-layout">
        <Skeleton height={320} radius={24} />
        <div className="stack">
          <Skeleton height={40} width="70%" />
          <Skeleton height={18} />
          <Skeleton height={18} width="80%" />
          <Skeleton height={160} radius={20} />
        </div>
      </div>
    );
  }

  if (menu.status === 'error') {
    return (
      <section className="container section">
        <StateMessage
          tone="error"
          icon="alert"
          title={t('state.error.title')}
          body={t('state.error.body')}
          action={<Button onClick={menu.reload}>{t('common.retry')}</Button>}
        />
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container section">
        <StateMessage
          icon="search"
          title={t('product.notFound.title')}
          body={t('product.notFound.body')}
          action={<ButtonLink to="/menu">{t('product.backToMenu')}</ButtonLink>}
        />
      </section>
    );
  }

  // Keyed so state re-initialises when switching product / edit target.
  return <ProductDetail key={`${product.id}:${editLine?.key ?? ''}`} product={product} editLine={editLine} />;
}

function ProductDetail({ product, editLine }: { product: Product; editLine?: ResolvedLine }) {
  const { t, tr, price } = useI18n();
  const { categoryById } = useMenu();
  const cart = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [selections, setSelections] = useState<Selections>(() => editLine?.selections ?? defaultSelections(product));
  const [quantity, setQuantity] = useState(editLine?.quantity ?? 1);
  const [showErrors, setShowErrors] = useState(false);
  const groupRefs = useRef(new Map<string, HTMLFieldSetElement>());

  const art = categoryById.get(product.categoryId)?.art ?? 'cake';
  const name = tr(product.name);
  const each = unitPrice(product, selections);
  const total = each * quantity;
  const problems = useMemo(() => validateSelections(product, selections), [product, selections]);
  const problemFor = (groupId: string) => (showErrors ? problems.find((p) => p.groupId === groupId) : undefined);

  const chosen = product.optionGroups.flatMap((g) =>
    (selections[g.id] ?? []).map((id) => ({ group: g, choice: g.choices.find((c) => c.id === id)! })).filter((x) => x.choice),
  );

  const toggle = (group: OptionGroup, choiceId: string) => {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      let next: string[];
      if (group.selection === 'single') {
        // Optional single groups can be cleared by tapping the selected choice again.
        next = current[0] === choiceId && !group.required ? [] : [choiceId];
      } else {
        next = current.includes(choiceId) ? current.filter((id) => id !== choiceId) : [...current, choiceId];
      }
      return { ...prev, [group.id]: next };
    });
  };

  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/menu');
  };

  const submit = () => {
    if (problems.length) {
      setShowErrors(true);
      groupRefs.current.get(problems[0].groupId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (editLine) {
      cart.replace(editLine.key, selections, quantity);
      toast(t('product.updated'));
      navigate('/cart');
    } else {
      cart.add(product.id, selections, quantity);
      toast(t('product.added', { name }));
      goBack();
    }
  };

  return (
    <div className="page-enter product-page">
      <div className="container product-layout">
        <div className="product-media">
          <button type="button" className="icon-btn product-media__back" onClick={goBack} aria-label={t('common.back')}>
            <Icon name="arrowLeft" />
          </button>
          <Media image={product.image} art={art} seed={product.slug} alt={name} className="product-media__img" />
        </div>

        <div className="product-info">
          <p className="eyebrow">{tr(categoryById.get(product.categoryId)?.name)}</p>
          <h1 className="product-info__name">{name}</h1>
          {tr(product.description) && <p className="product-info__desc">{tr(product.description)}</p>}
          <p className="product-info__price">{price(product.price)}</p>

          {!product.available ? (
            <InlineAlert tone="info">{t('product.soldOutBody')}</InlineAlert>
          ) : (
            <>
              {product.optionGroups.map((group) => {
                const selected = selections[group.id] ?? [];
                const max = group.selection === 'multiple' ? group.maxSelections : 1;
                const atMax = group.selection === 'multiple' && max > 0 && selected.length >= max;
                const problem = problemFor(group.id);
                return (
                  <fieldset
                    key={group.id}
                    className={`opt-group${problem ? ' opt-group--error' : ''}`}
                    ref={(el) => {
                      if (el) groupRefs.current.set(group.id, el);
                    }}
                  >
                    <legend className="opt-group__head">
                      <span className="opt-group__title">{tr(group.name)}</span>
                      <span className="opt-group__rule">
                        {group.selection === 'single'
                          ? t('product.chooseOne')
                          : max > 0
                            ? t('product.chooseUpTo', { max })
                            : t('product.chooseAny')}
                        <span className={`pill ${group.required ? 'pill--required' : ''}`}>
                          {group.required ? t('common.required') : t('common.optional')}
                        </span>
                      </span>
                    </legend>
                    {problem && (
                      <p className="field__error opt-group__error">
                        <Icon name="alert" size={15} />
                        {t(`error.${problem.code}`)}
                      </p>
                    )}
                    <div className="opt-list">
                      {group.choices.map((choice) => {
                        const checked = selected.includes(choice.id);
                        const disabled = !choice.available || (atMax && !checked);
                        return (
                          <label
                            key={choice.id}
                            className={`opt${checked ? ' opt--checked' : ''}${disabled ? ' opt--disabled' : ''}`}
                          >
                            <input
                              type={group.selection === 'single' ? 'radio' : 'checkbox'}
                              name={`g-${group.id}`}
                              checked={checked}
                              disabled={disabled}
                              onChange={() => toggle(group, choice.id)}
                              onClick={() => {
                                // radios don't fire onChange when re-clicked; allow clearing optional singles
                                if (group.selection === 'single' && checked && !group.required) toggle(group, choice.id);
                              }}
                              className="opt__input"
                            />
                            <span className={`opt__mark opt__mark--${group.selection}`} aria-hidden="true">
                              <Icon name="check" size={14} />
                            </span>
                            <span className="opt__name">{tr(choice.name)}</span>
                            <span className="opt__price">
                              {!choice.available
                                ? t('product.choiceSoldOut')
                                : choice.priceModifier > 0
                                  ? `+${price(choice.priceModifier)}`
                                  : ''}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {group.selection === 'multiple' && max > 0 && (
                      <p className="opt-group__count">{t('product.selectedCount', { count: selected.length, max })}</p>
                    )}
                  </fieldset>
                );
              })}

              <div className="breakdown" aria-live="polite">
                <h2 className="breakdown__title">{t('product.yourOrder')}</h2>
                <div className="breakdown__row">
                  <span>{name}</span>
                  <span>{price(product.price)}</span>
                </div>
                {chosen.map(({ group, choice }) => (
                  <div key={choice.id} className="breakdown__row breakdown__row--sub">
                    <span>
                      {tr(group.name)}: {tr(choice.name)}
                    </span>
                    <span>{choice.priceModifier > 0 ? `+${price(choice.priceModifier)}` : '—'}</span>
                  </div>
                ))}
                <div className="breakdown__row breakdown__row--total">
                  <span>
                    {price(each)} × {quantity}
                  </span>
                  <strong>{price(total)}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {product.available &&
        createPortal(
          <div className="action-bar">
            <div className="container action-bar__inner">
              <QuantityStepper value={quantity} onChange={setQuantity} max={MAX_QUANTITY} label={t('product.quantity')} />
              <Button size="lg" className="action-bar__btn" onClick={submit}>
                {editLine ? t('product.update') : t('product.addToCart')}
                <span className="action-bar__price">{price(total)}</span>
              </Button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
