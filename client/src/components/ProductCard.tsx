import { Link } from 'react-router';
import type { Product } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';
import { fromPrice } from '../lib/pricing';
import { useMenu } from '../store/menu';
import { Icon } from './Icon';
import { Media } from './ProductArt';

interface Props {
  product: Product;
  layout?: 'grid' | 'row';
}

export function ProductCard({ product, layout = 'grid' }: Props) {
  const { t, tr, price } = useI18n();
  const { categoryById } = useMenu();
  const art = categoryById.get(product.categoryId)?.art ?? 'cake';
  const { amount, varies } = fromPrice(product);
  const name = tr(product.name);
  const soldOut = !product.available;

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`pcard pcard--${layout}${soldOut ? ' pcard--soldout' : ''}`}
      aria-label={soldOut ? `${name} — ${t('product.soldOut')}` : name}
    >
      <div className="pcard__media">
        <Media image={product.image} art={art} seed={product.slug} alt={name} className="pcard__img" />
        {soldOut && <span className="pill pill--soldout">{t('product.soldOut')}</span>}
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{name}</h3>
        <p className="pcard__desc">{tr(product.description)}</p>
        <div className="pcard__foot">
          <span className="pcard__price">
            {varies ? t('price.from', { price: price(amount) }) : price(amount)}
          </span>
          {!soldOut && (
            <span className="pcard__add" aria-hidden="true">
              <Icon name="plus" size={20} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
