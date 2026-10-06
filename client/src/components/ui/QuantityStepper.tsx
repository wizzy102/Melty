import { useI18n } from '../../i18n/I18nProvider';
import { Icon } from '../Icon';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 20, size = 'md', label }: Props) {
  const { lang } = useI18n();
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={lang === 'ar' ? 'تقليل الكمية' : 'Decrease quantity'}
      >
        <Icon name="minus" size={size === 'sm' ? 16 : 18} />
      </button>
      <output className="stepper__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={lang === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
      >
        <Icon name="plus" size={size === 'sm' ? 16 : 18} />
      </button>
    </div>
  );
}
