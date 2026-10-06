import { Link } from 'react-router';
import type { Category } from '../api/types';
import { useI18n } from '../i18n/I18nProvider';
import { Media } from './ProductArt';

export function CategoryTile({ category, count }: { category: Category; count?: number }) {
  const { tr } = useI18n();
  const name = tr(category.name);
  return (
    <Link to={`/menu#${category.slug}`} className="ctile">
      <Media image={category.image} art={category.art} seed={`cat-${category.slug}`} alt={name} className="ctile__img" />
      <span className="ctile__label">
        <span className="ctile__name">{name}</span>
        {count !== undefined && <span className="ctile__count">{count}</span>}
      </span>
    </Link>
  );
}
