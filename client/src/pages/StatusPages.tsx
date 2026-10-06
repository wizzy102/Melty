import { useI18n } from '../i18n/I18nProvider';
import { ButtonLink } from '../components/ui/Button';
import { StateMessage } from '../components/ui/States';

export function NotFound() {
  const { t } = useI18n();
  return (
    <section className="container section page-enter">
      <StateMessage
        icon="alert"
        title={t('state.notFound.title')}
        body={t('state.notFound.body')}
        action={<ButtonLink to="/">{t('state.notFound.cta')}</ButtonLink>}
      />
    </section>
  );
}
