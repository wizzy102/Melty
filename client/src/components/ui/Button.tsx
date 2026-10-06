import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { Spinner } from './States';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Common {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

const cls = ({ variant = 'primary', size = 'md', block }: Common, extra = '') =>
  `btn btn--${variant} btn--${size}${block ? ' btn--block' : ''} ${extra}`.trim();

export function Button({
  variant,
  size,
  block,
  loading,
  icon,
  iconEnd,
  children,
  className,
  disabled,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cls({ variant, size, block }, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size={18} /> : icon}
      {children && <span>{children}</span>}
      {!loading && iconEnd}
    </button>
  );
}

export function ButtonLink({ variant, size, block, icon, iconEnd, children, className, ...rest }: Common & LinkProps) {
  return (
    <Link className={cls({ variant, size, block }, className)} {...rest}>
      {icon}
      {children && <span>{children}</span>}
      {iconEnd}
    </Link>
  );
}
