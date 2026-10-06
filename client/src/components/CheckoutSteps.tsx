import { useI18n } from '../i18n/I18nProvider';
import type { MessageKey } from '../i18n/en';
import { Icon } from './Icon';

const STEPS: MessageKey[] = ['checkout.step.details', 'checkout.step.review', 'checkout.step.done'];

export function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  const { t } = useI18n();
  return (
    <ol className="steps-bar" aria-label={t('checkout.steps')}>
      {STEPS.map((key, i) => {
        const n = i + 1;
        const done = n < current || current === STEPS.length;
        const state = done ? 'done' : n === current ? 'current' : 'todo';
        return (
          <li key={key} className={`steps-bar__step steps-bar__step--${state}`} aria-current={n === current ? 'step' : undefined}>
            <span className="steps-bar__dot">{done ? <Icon name="check" size={15} /> : n}</span>
            <span className="steps-bar__label">{t(key)}</span>
          </li>
        );
      })}
    </ol>
  );
}
