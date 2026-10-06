import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Icon } from '../Icon';

interface FieldShell {
  label: string;
  hint?: string;
  error?: string;
  optionalLabel?: string;
}

function Shell({
  id,
  label,
  hint,
  error,
  optionalLabel,
  children,
}: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {optionalLabel && <span className="field__optional">{optionalLabel}</span>}
      </label>
      {children}
      {error ? (
        <p className="field__error" id={`${id}-msg`}>
          <Icon name="alert" size={15} />
          {error}
        </p>
      ) : (
        hint && (
          <p className="field__hint" id={`${id}-msg`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

const a11y = (id: string, f: FieldShell) => ({
  id,
  'aria-invalid': f.error ? true : undefined,
  'aria-describedby': f.error || f.hint ? `${id}-msg` : undefined,
});

export function TextField({ label, hint, error, optionalLabel, ...rest }: FieldShell & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} {...{ label, hint, error, optionalLabel }}>
      <input className="input" {...a11y(id, { label, hint, error })} {...rest} />
    </Shell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  optionalLabel,
  ...rest
}: FieldShell & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} {...{ label, hint, error, optionalLabel }}>
      <textarea className="input input--textarea" rows={3} {...a11y(id, { label, hint, error })} {...rest} />
    </Shell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  optionalLabel,
  children,
  ...rest
}: FieldShell & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} {...{ label, hint, error, optionalLabel }}>
      <div className="select">
        <select className="input" {...a11y(id, { label, hint, error })} {...rest}>
          {children}
        </select>
        <Icon name="chevronDown" size={18} className="select__chevron" />
      </div>
    </Shell>
  );
}
