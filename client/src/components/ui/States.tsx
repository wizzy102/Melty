import type { ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

export function Spinner({ size = 24, label }: { size?: number; label?: string }) {
  return (
    <span className="spinner" style={{ width: size, height: size }} role={label ? 'status' : undefined}>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

export function Skeleton({ height = 16, width = '100%', radius }: { height?: number | string; width?: number | string; radius?: number }) {
  return <span className="skeleton" style={{ height, width, borderRadius: radius }} aria-hidden="true" />;
}

interface StateProps {
  icon?: IconName;
  art?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
  tone?: 'default' | 'error';
}

/** Used for empty, error and "not found" screens. */
export function StateMessage({ icon, art, title, body, action, tone = 'default' }: StateProps) {
  return (
    <div className={`state state--${tone}`} role={tone === 'error' ? 'alert' : undefined}>
      {art ?? (icon && <span className="state__icon"><Icon name={icon} size={30} /></span>)}
      <h2 className="state__title">{title}</h2>
      {body && <p className="state__body">{body}</p>}
      {action && <div className="state__action">{action}</div>}
    </div>
  );
}

export function InlineAlert({ children, tone = 'error' }: { children: ReactNode; tone?: 'error' | 'success' | 'info' }) {
  return (
    <div className={`alert alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={tone === 'success' ? 'check' : 'alert'} size={18} />
      <div>{children}</div>
    </div>
  );
}
